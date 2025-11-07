interface ChatInputProps {
    input: string;
    isLoading: boolean;
    onInputChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) => {
    return (
        <form onSubmit={onSubmit} className="p-4 border-t bg-transparent">
            <div className="flex space-x-4 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md transition-transform transform
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );
};