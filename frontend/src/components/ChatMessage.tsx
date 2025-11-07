import { Message } from '@/app/types';

interface ChatMessageProps {
    message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
    return (
        <div
            className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
        >
            <div
                className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'bg-white border border-gray-100 text-gray-800 shadow-sm'
                }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
        </div>
    );
};