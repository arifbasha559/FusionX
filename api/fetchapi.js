// src/api/fetchapi.js
import { OpenRouter } from "@openrouter/sdk";

const client = new OpenRouter({
    apiKey: process.env.REACT_APP_OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'My Chat App',
    },
});

const resolveModel = (inputModel) => {
    const modelMap = {
        "openai": "openai/gpt-oss-20b:free",
        "mistral": "mistralai/mistral-small-3.1-24b-instruct:free",
        "deepseek": "deepseek/deepseek-r1:free",
        "google": "google/gemini-2.0-flash-lite-preview-02-05:free",
        "llama": "meta-llama/llama-3-8b-instruct:free",
        "image": "bytedance-seed/seedream-4.5",
         "Arcee": "arcee-ai/trinity-large-preview:free",
        "Z.AI": "z-ai/glm-4.5-air:free",
        "Nemotron": "nvidia/nemotron-3-nano-30b-a3b:free",
         "dolphin": "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        "image": "flux"
    };
    return modelMap[inputModel] || inputModel;
};

// 1. TEXT STREAM
async function* fetchOpenRouterTextStream(model, messages) {
    try {
        const stream = await client.chat.send({
            model: model,
            messages: messages,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) yield content;
        }
    } catch (error) {
        console.error("Text Stream Error:", error);
        yield "⚠️ Error: Failed to generate text.";
    }
}

// 2. IMAGE GENERATION (Fixed for Base64 Return)
async function* fetchSafeImage(prompt) {
    let imageUrl = "";

    // --- ATTEMPT 1: Puter (Flux) ---
    if (window.puter) {
        try {
            console.log("Attempt 1: Puter (Flux)...");
            const result = await window.puter.ai.txt2img(prompt, {
                model: 'black-forest-labs/FLUX.1-schnell',
                width: 512,  // <--- REDUCED SIZE (Default is usually 1024)
                height: 512
            });
            imageUrl = result?.src || result;
            if (isValidImage(imageUrl)) {
                yield `![Generated Image](${imageUrl})`;
                return;
            }
        } catch (e) {
            console.warn("Puter Flux failed, trying SDXL...", e);
        }

        // --- ATTEMPT 2: Puter (Stable Diffusion XL) ---
        // SDXL is older but very stable/reliable
        try {
            console.log("Attempt 2: Puter (SDXL)...");
            const result = await window.puter.ai.txt2img(prompt, {
                model: 'stabilityai/stable-diffusion-xl-base-1.0',
                width: 512,  // <--- REDUCED SIZE (Default is usually 1024)
                height: 512
            });
            imageUrl = result?.src || result;
            if (isValidImage(imageUrl)) {
                yield `![Generated Image](${imageUrl})`;
                return;
            }
        } catch (e) {
            console.warn("Puter SDXL failed, switching to Pollinations...", e);
        }
        try {
            console.log("Attempt 3: Puter (SDXL)...");
            const result = await window.puter.ai.txt2img(prompt, {
                width: 512,  // <--- REDUCED SIZE (Default is usually 1024)
                height: 512
            });
            imageUrl = result?.src || result;
            if (isValidImage(imageUrl)) {
                yield `![Generated Image](${imageUrl})`;
                return;
            }
        } catch (e) {
            console.warn("Puter SDXL failed, switching to Pollinations...", e);
        }
    }


}

// Helper to check if URL looks valid
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
    try {
        const completion = await client.chat.send({
            model: "openai/gpt-4o-mini",
            messages: [
                { role: "system", content: "Act as a title maker. Create a concise title (max 30 chars). No quotes." },
                { role: "user", content: typeof inputContent === 'string' ? inputContent : JSON.stringify(inputContent) }
            ]
        });
        return completion.choices[0]?.message?.content?.replace(/["']/g, "") || "New Chat";
    } catch (error) {
        return "New Chat";
    }
};

export default fetchApi;