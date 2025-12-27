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
        "openai": "openai/gpt-4o-mini",
        "mistral": "mistralai/mistral-7b-instruct:free",
        "deepseek": "deepseek/deepseek-r1:free",
        "google": "google/gemini-2.0-flash-lite-preview-02-05:free",
        "llama": "meta-llama/llama-3-8b-instruct:free",
        "image": "bytedance-seed/seedream-4.5",
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
async function* fetchPuterImage(prompt) {
    try {
        if (!window.puter) {
            yield "⚠️ Error: Puter.js not loaded.";
            return;
        }

        console.log("Generating image...");
        
        // 1. Call Puter
        const result = await window.puter.ai.txt2img(prompt, { 
            model: 'black-forest-labs/FLUX.1-schnell',
            width: 512,  // <--- REDUCED SIZE (Default is usually 1024)
            height: 512
        });
        
        // 2. ROBUST URL EXTRACTION
        let imageUrl = "";

        if (typeof result === 'string') {
            // Case A: Puter returned the raw Base64 string directly
            imageUrl = result;
        } else if (result && result.src) {
            // Case B: Puter returned an <img> element
            imageUrl = result.src;
        } else if (result && typeof result === 'object') {
            // Case C: Puter returned a Blob or other object (fallback)
            console.log("Unknown Puter response type:", result);
            try {
                imageUrl = URL.createObjectURL(result);
            } catch (e) {
                imageUrl = ""; 
            }
        }

        // 3. Validation
        if (!imageUrl || !imageUrl.startsWith('data:')) {
            console.error("Failed to extract image URL. Raw result:", result);
            yield "⚠️ Error: Puter returned an unexpected format.";
            return;
        }

        // 4. Yield Markdown
        yield `![Generated Image](${imageUrl})`;

    } catch (error) {
        console.error("Puter Image Error:", error);
        yield `⚠️ Error: ${error.message}`;
    }
}

// 3. MAIN EXPORT
const fetchApi = (input, model, mode, responseTime, messages) => {
    const targetModel = resolveModel(model);

    if (mode === "image" || model === "image" || model === "flux") {
        return fetchPuterImage(input);
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