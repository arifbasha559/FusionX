// src/api/fetchapi.js

// 1. Unified POST Function (Best for 'openai', 'mistral', 'deepseek', etc.)
// This supports conversation history (messages array)
async function fetchAdvancedResponse(model, responseTime, messages,input) {
    // The main endpoint for POST requests is usually just the root or specific to compatibility
    const API_URL = "https://text.pollinations.ai/";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: model, // Pass the model name here
                reasoning_effort: responseTime,
                messages: messages
            }),
        });

        if (!res.ok) {
            if (res.status === 429) {
                try {
                    const API_URL_429 = `https://text.pollinations.ai/${encodeURIComponent(input)}?model=openai`;

                    const res = await fetch(API_URL_429, {
                        method: "GET",
                    });

                    if (!res.ok) {
                        return fallbackApi(input);
                    }

                    // GET endpoint returns raw text, NOT JSON
                    const text = await res.text();
                    if (!text || text.trim() === "") return "⚠️ Empty response.";

                    return text;
                } catch (error) {
                    console.error("❌ Pollinations GET Error after 429:", error);
                    return "⚠️ Connection failed after rate limit.";
                }
            }
            if (res.status >= 500 ) return "⚠️ Pollinations server is currently unavailable.";
            return `❌ API Error ${res.status}: ${res.statusText}`;
        }

        // POST requests to Pollinations usually return the text directly, 
        // OR sometimes OpenAI format depending on the specific endpoint configuration.
        // Let's try to detect if it's JSON or Text.
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const json = await res.json();
            // Handle OpenAI-like format
            if (json.choices && json.choices.length > 0) {
                return json.choices[0].message.content;
            }
            return JSON.stringify(json); // Fallback
        } else {
            // Plain text response
            return await res.text();
        }

    } catch (error) {
        console.error("❌ Pollinations POST Error:", error);
        return "⚠️ Unable to connect to Pollinations API.";
    }
}

// 2. Simple GET Function (Legacy or simple prompts)
async function fetchSimpleResponse(input, model) {
    // Note: GET requests often don't support history/context
    const API_URL = `https://text.pollinations.ai/${encodeURIComponent(input)}?model=${encodeURIComponent(model)}`;

    try {
        const res = await fetch(API_URL, {
            method: "GET",
        });

        if (!res.ok || res.status != 200) {
            return fallbackApi(input);
        }

        // GET endpoint returns raw text, NOT JSON
        const text = await res.text();
        if (!text || text.trim() === "") return "⚠️ Empty response.";

        return text;

    } catch (error) {
        console.error("❌ Pollinations GET Error:", error);
        return fallbackApi(input);
    }
}

async function fetchDeepseekResponse(input, model) {
    const API_URL = `https://text.pollinations.ai/${encodeURIComponent(input)}?model=${encodeURIComponent(model)}`;

    try {
        const res = await fetch(API_URL, {
            method: "GET",
        });

        if (!res.ok || res.status != 200) {
            return `❌ Error ${res.status}: ${res.statusText}`;
        }

        // 1. Get the raw response as text first (do not use res.json() immediately)
        const rawText = await res.text();

        // 2. Try to parse it as JSON
        try {
            const data = JSON.parse(rawText);

            // Case A: It is a JSON object (like your first example)
            // Check for 'reasoning_content' first, then 'content'
            if (data.reasoning_content) {
                return data.reasoning_content;
            } else if (data.content) {
                return data.content;
            } else {
                // If it's JSON but unexpected structure, return the whole thing
                return rawText;
            }

        } catch (e) {
            // Case B: It is NOT JSON (like your second example)
            // The API just returned the answer directly as a string
            return rawText;
        }

    } catch (error) {
        console.error("❌ Pollinations GET Error:", error);
        return fallbackApi(input);
    }
}

// 3. Image Generation Function
async function fetchPollinationsImageResponse(prompt) {
    // Corrected URL: 'image' not 'iamge'
    // We add a random seed to ensure a new image is generated if the prompt is same
    const seed = Math.floor(Math.random() * 10000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?nologo=true&seed=${seed}`;

    // We don't need to fetch() the image data itself unless we want to download it.
    // For a chat, we just want to display it.
    // We return it as a Markdown Image syntax so ReactMarkdown renders it.

    return `![Generated Image](${imageUrl})`;
}


const fetchApi = (input, model, mode, responseTime, messages) => {
    console.log("fetchApi called", { input, model, mode, responseTime });

    if (mode === "image") {
        return fetchPollinationsImageResponse(input);
    }
    else if (mode === "text" && model === "deepseek") {
        return fetchDeepseekResponse(input, model);
    }
    else if (mode === "text" && model !== "openai") {
        return fetchSimpleResponse(input, model);
    }
    return fetchAdvancedResponse(model, responseTime, messages, input);
};
// https://text.pollinations.ai/python?system="Act as a title maker (20 letter)"
export const titleMaker = async (input) => {
    const API_URL = `https://text.pollinations.ai/${encodeURIComponent(input)}?system="Act as a title maker (20 letter)"`;

    try {
        const res = await fetch(API_URL, {
            method: "GET",
        });

        if (!res.ok || res.status != 200) {
            return input.content.slice(0, 30);
        }

        // 1. Get the raw response as text first (do not use res.json() immediately)
        const rawText = await res.text();
        console.log("titleMaker rawText:", rawText);
        // 2. Try to parse it as JSON

        return rawText;

    } catch (error) {
        console.error("❌ Pollinations Title Creation Failed:", error);
        return "⚠️ Connection failed.";
    }
}
const fallbackApi = async (input) => {
    console.log("Fallback API called for input:", input);
    const API_URL = `https://text.pollinations.ai/${encodeURIComponent(input)}`;
    try {
        const res = await fetch(API_URL, {
            method: "GET",
        });
        if (!res.ok) {
            return `❌ Error ${res.status}: ${res.error}`;
        }
        const text = await res.text();
        return text;
    } catch (error) {
        console.error("❌ Pollinations GET Error:", error);
        return "⚠️ Connection failed.";
    }
};
export default fetchApi;