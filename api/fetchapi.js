// src/api/fetchapi.js
import { OpenRouter } from "@openrouter/sdk";

// Helper to create a client instance on the fly
const createClient = (key) => new OpenRouter({
    apiKey: key,
    defaultHeaders: {
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://fusionx.netlify.app',
        'X-Title': 'FusionX Chat',
    },
});

const keys = [
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY1,
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY2,
].filter(Boolean); // Removes undefined keys

const resolveModel = (inputModel) => {
    const modelMap = {
        "openai": "openai/gpt-oss-20b:free",
        "stepfun": "stepfun/step-3.5-flash:free",
        "liquid": "liquid/lfm-2.5-1.2b-thinking:free",
        "Arcee": "arcee-ai/trinity-large-preview:free",
        "Z.AI": "z-ai/glm-4.5-air:free",
        "Nemotron": "nvidia/nemotron-3-nano-30b-a3b:free",
        "image": "flux"
    };
    return modelMap[inputModel] || inputModel;
};

// 1. TEXT STREAM (With Key Fallback)
async function* fetchOpenRouterTextStream(model, messages) {
    let lastError;

    for (const key of keys) {
        try {
            const client = createClient(key);
            const stream = await client.chat.send({
                model: model,
                messages: model=='liquid' ? [{ role: "system", content: "Your name is Liquid assistant." }, ...messages] : messages,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) yield content;
            }
            return; // Success! Exit the function.
        } catch (error) {
            console.error(`API Key failed: ${key.slice(0, 8)}...`, error);
            lastError = error;
            // Continue to next key...
        }
    }

    // FINAL FALLBACK: If all keys fail, try the free model with the first key
    try {
        const fallbackClient = createClient(keys[0]);
        const stream = await fallbackClient.chat.send({
            model: "openai/gpt-oss-20b:free",
            messages: [{ role: "system", content: `my name is ${model} assistant.` }, ...messages],
            stream: true,
        });
        console.warn("All keys failed. Falling back to free model with the first key.");
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) yield content;
        }
    } catch (e) {
        yield "⚠️ Unable to connect to the AI service. Please try again later.";
    }
}

// 2. IMAGE GENERATION (Puter AI)
async function* fetchSafeImage(prompt) {
    if (!window.puter) return;
    
    const models = [
        'black-forest-labs/FLUX.1-schnell',
        'stabilityai/stable-diffusion-xl-base-1.0',
        null // Default model
    ];

    for (const model of models) {
        try {
            const options = { width: 412, height: 412 };
            if (model) options.model = model;
            
            const result = await window.puter.ai.txt2img(prompt, options);
            const imageUrl = result?.src || result;
            
            if (isValidImage(imageUrl)) {
                yield `![Generated Image](${imageUrl})`;
                return;
            }
        } catch (e) {
            console.warn(`Puter ${model || 'default'} failed...`);
        }
    }
}

function isValidImage(url) {
    return url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:'));
}

// 3. MAIN EXPORT
const fetchApi = (input, model, mode, responseTime, messages) => {
    const targetModel = resolveModel(model);
    if (mode === "image" || model === "image" || model === "flux") {
        return fetchSafeImage(input);
    }
    return fetchOpenRouterTextStream(targetModel, messages);
};

export const titleMaker = async (inputContent) => {
    for (const key of keys) {
        try {
            const client = createClient(key);
            const completion = await client.chat.send({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: "Act as a title maker. Create a concise title (max 30 chars). No quotes." },
                    { role: "user", content: String(inputContent) }
                ]
            });
            return completion.choices[0]?.message?.content?.replace(/["']/g, "") || "New Chat";
        } catch (error) {
            continue;
        }
    }
    return "New Chat";
};

export default fetchApi;