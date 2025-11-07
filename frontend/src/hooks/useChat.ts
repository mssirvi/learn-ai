import { useState, useCallback } from 'react';
import { Message } from '@/app/types';
import { sendChatMessage } from '@/services/chat.service';

const CHAT_ID_STORAGE_KEY = 'learnai_chat_id';

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(async (prompt: string) => {
        if (!prompt.trim() || isLoading) return;
        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        setIsLoading(true);
        let assistantMessage = '';

        try {
            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            // get persisted chatId if any
            const storedChatId = typeof window !== 'undefined' ? localStorage.getItem(CHAT_ID_STORAGE_KEY) ?? undefined : undefined;

            const returnedChatId = await sendChatMessage(prompt, (chunk) => {
                assistantMessage += chunk;
                setMessages(prev => [
                    ...prev.slice(0, -1),
                    { role: 'assistant', content: assistantMessage }
                ]);
            }, storedChatId, (chatId) => {
                try { localStorage.setItem(CHAT_ID_STORAGE_KEY, chatId); } catch (e) { /* ignore */ }
            });

            if (returnedChatId) {
                try {
                    localStorage.setItem(CHAT_ID_STORAGE_KEY, returnedChatId);
                } catch (e) {
                    /* ignore storage errors */
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev.slice(0, -1), { 
                role: 'assistant', 
                content: 'Sorry, there was an error processing your request.' 
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    return {
        messages,
        isLoading,
        sendMessage
    };
}