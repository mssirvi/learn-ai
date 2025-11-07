export const Config = {
    get geminiApiKey() {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            throw new Error('GEMINI_API_KEY is not defined in the environment variables');
        }
        return geminiApiKey;
    },
    get geminiModelName() {
        return process.env.GEMINI_MODEL_NAME || 'gemini-1.5-flash';
    }
}