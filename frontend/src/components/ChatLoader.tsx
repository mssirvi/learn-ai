export const ChatLoader = () => {
    return (
        <div className="flex items-center space-x-2">
            <div className="w-10 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-lg shadow-sm">
                <span className="inline-block w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-75" style={{ animationDelay: '0s' }} />
                <span className="inline-block w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '150ms' }} />
                <span className="inline-block w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
};

export default ChatLoader;
