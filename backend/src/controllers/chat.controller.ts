import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { GeminiService } from '../services/gemini.service';
import { createChat, appendMessage, getLastNMessages, updateLastAssistantMessageAppend } from '../store/chatStore';

export class ChatController {
    private geminiService: GeminiService;

    constructor() {
        this.geminiService = new GeminiService();
    }

    async handleChat(req: Request, res: Response): Promise<void> {
        try {
            console.log("api request received");
            const { prompt, chatId: incomingChatId } = req.body;

            // determine chatId
            const chatId = incomingChatId || randomUUID?.() || `${Date.now()}-${Math.floor(Math.random()*10000)}`;
            createChat(chatId);

            if (!prompt) {
                res.status(400).json({ error: 'Prompt is required' });
                return;
            }

            // append user message to store
            appendMessage(chatId, { role: 'user', content: prompt, ts: Date.now() });

            // For debugging: log current stored messages for this chatId
            try {
                // lazy require to avoid circular issues
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { getMessages } = require('../store/chatStore');
                const all = getMessages(chatId) as any[];
                console.log('chat history for', chatId, all.map((m: any) => ({ role: m.role, contentPreview: m.content?.slice(0,120) })));
            } catch (e) {
                // ignore
            }

            // Set up SSE
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            // Send the chatId early so client can persist it immediately
            res.write(`data: ${JSON.stringify({ chatId })}\n\n`);

            try {
                // prepare context: last N messages
                const history = getLastNMessages(chatId, 10);
                // build a simple combined prompt with roles
                const combinedPrompt = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n') + `\nASSISTANT:`;

                // add an assistant placeholder so frontend shows loader
                appendMessage(chatId, { role: 'assistant', content: '', ts: Date.now() });
                console.log("prompt:", combinedPrompt);
                await this.geminiService.generateStreamingText(combinedPrompt, (chunk) => {
                    // stream chunk to client
                    res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
                    // update store by appending to last assistant message
                    updateLastAssistantMessageAppend(chatId, chunk);
                });

                // done - include chatId so client can persist it
                res.write(`data: ${JSON.stringify({ done: true, chatId })}\n\n`);
            } catch (error) {
                console.error('Streaming error:', error);
                res.write(`data: ${JSON.stringify({ error: 'Error during streaming' })}\n\n`);
            }

            res.end();
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}