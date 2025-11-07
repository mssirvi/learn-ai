import { ChatResponse } from '@/app/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function sendChatMessage(
    prompt: string,
    onChunk: (text: string) => void,
    chatId?: string,
    onChatId?: (chatId: string) => void
): Promise<string | undefined> {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, chatId }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
        throw new Error('No reader available');
    }

    let returnedChatId: string | undefined = undefined;
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data: ChatResponse & { chatId?: string } = JSON.parse(line.slice(6));
                    if (data.chatId) {
                        returnedChatId = data.chatId;
                        if (onChatId) {
                            try { onChatId(data.chatId); } catch (e) { /* ignore */ }
                        }
                    }
                    if (data.done) continue;
                    if (data.error) throw new Error(data.error);
                    if (data.text) onChunk(data.text);
                } catch (e) {
                    console.error('Error parsing SSE data:', e);
                }
            }
        }
    }

    return returnedChatId;
}