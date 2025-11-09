import 'dotenv/config';
import { createAgent, tool, initChatModel } from "langchain";
import * as z from "zod";
import { Config } from "./config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver, type Runtime } from "@langchain/langgraph";
import { weatherForcasterPrompt } from './prompts/weather.prompt';


const { geminiApiKey } = Config;

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: geminiApiKey,
    temperature: 1.5,
});

async function main() {

    // Define tools
    const getWeather = tool(
        ({ city }: any) => `It's always sunny in ${city}!`,
        {
            name: "get_weather_for_location",
            description: "Get the weather for a given city",
            schema: z.object({
                city: z.string(),
            }),
        }
    );

    const getUserLocation = tool(
        (_: any, config: Runtime<{ user_id: string }>) => {
            const { user_id }: any = config.context;
            return user_id === "1" ? "Florida" : "SF";
        },
        {
            name: "get_user_location",
            description: "Retrieve user information based on user ID",
            schema: z.object({}),
        }
    );

    // Define response format
    const responseFormat = z.object({
        punny_response: z.string(),
        weather_conditions: z.string().optional(),
    });

    // Set up memory
    const checkpointer = new MemorySaver();

    // Create agent
    const agent = createAgent({
        model: model,
        systemPrompt: weatherForcasterPrompt,
        tools: [getUserLocation, getWeather],
        responseFormat,
        checkpointer,
    });

    // Run agent
    // `thread_id` is a unique identifier for a given conversation.
    const config = {
        configurable: { thread_id: "1" },
        context: { user_id: "1" },
    };

    const response = await agent.invoke(
        { messages: [{ role: "user", content: "what is the weather outside?" }] },
        config
    );
    console.log(response.structuredResponse);
    // {
    //   punny_response: "Florida is still having a 'sun-derful' day! The sunshine is playing 'ray-dio' hits all day long! I'd say it's the perfect weather for some 'solar-bration'! If you were hoping for rain, I'm afraid that idea is all 'washed up' - the forecast remains 'clear-ly' brilliant!",
    //   weather_conditions: "It's always sunny in Florida!"
    // }

    // Note that we can continue the conversation using the same `thread_id`.
   
    const thankYouResponse = await agent.invoke(
        { messages: [{ role: "user", content: "thank you!" }] },
        config
    );
    console.log(thankYouResponse.structuredResponse);
    // {
    //   punny_response: "You're 'thund-erfully' welcome! It's always a 'breeze' to help you stay 'current' with the weather. I'm just 'cloud'-ing around waiting to 'shower' you with more forecasts whenever you need them. Have a 'sun-sational' day in the Florida sunshine!",
    //   weather_conditions: undefined
    // }

}

main();
