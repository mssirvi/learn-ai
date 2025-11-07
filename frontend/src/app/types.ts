export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    text?: string;
    error?: string;
    done?: boolean;
}