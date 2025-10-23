import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateStory = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a master storyteller for children. Your stories are short, engaging, and have a positive message. Keep them under 200 words and format them with paragraphs.",
                temperature: 0.8,
                topP: 0.9,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating story:", error);
        throw new Error("Failed to generate the story. Please try again.");
    }
};

export const generateSpeech = async (text) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Read this story in a cheerful and engaging voice for a child: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
            return base64Audio;
        } else {
            throw new Error("No audio data received from API.");
        }
    } catch (error) {
        console.error("Error generating speech:", error);
        throw new Error("Failed to generate audio for the story.");
    }
};

export const generateImage = async (storyText) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{
                    text: `Generate a vibrant 3D cartoon-style illustration for a children's story, like a modern animated movie. The style should be playful and colorful. The story is about: "${storyText}"`,
                }, ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("No image data received from API.");

    } catch (error) {
        console.error("Error generating image:", error);
        throw new Error("Failed to create a magical illustration for the story.");
    }
};