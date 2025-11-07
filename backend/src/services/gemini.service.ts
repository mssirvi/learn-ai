import { GoogleGenAI } from "@google/genai";
import { Config } from "../config";

export class GeminiService {
    private readonly ai: GoogleGenAI;
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: Config.geminiApiKey });
    }

    async generateText(ask: string) {
        const response = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: ask,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0
                }
            }
        });
        return response;
    }

    async generateStreamingText(ask: string, onChunk: (chunk: string) => void) {
        const response = await this.ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: ask,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0
                }
            }
        });

        for await (const chunk of response) {
            if (chunk?.text) {
                onChunk(chunk.text);
            }
        }
    }
}

