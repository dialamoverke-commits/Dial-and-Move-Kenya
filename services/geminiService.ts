
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedArticle } from '../types';

// IMPORTANT: This check is for the local dev environment.
// In a real deployment, the API key would be set as an environment variable.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateContent = async (topic: string): Promise<GeneratedArticle[]> => {
    const model = 'gemini-2.5-flash';

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.NUMBER },
                theme: { type: Type.STRING, description: "A short, catchy theme for the content set, e.g., 'Hassle-Free Office Moves'." },
                googleBusinessProfile: { type: Type.STRING, description: "A concise post (100-150 words) for a Google Business Profile update." },
                websiteArticle: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "An SEO-friendly title for a website blog post." },
                        body: { type: Type.STRING, description: "A longer-form article (300-400 words) for the website, optimized for SEO." },
                    },
                    required: ["title", "body"],
                },
                socialMediaPost: { type: Type.STRING, description: "A short, punchy post for Facebook or Instagram, rich with emojis and hashtags." },
                scores: {
                    type: Type.OBJECT,
                    properties: {
                        virality: { type: Type.NUMBER, description: "Score (0-100) for potential to go viral." },
                        localization: { type: Type.NUMBER, description: "Score (0-100) for relevance to the Kenyan audience." },
                        seo: { type: Type.NUMBER, description: "Score (0-100) for search engine optimization strength." },
                        ctaClarity: { type: Type.NUMBER, description: "Score (0-100) for the clarity and effectiveness of the call to action." },
                    },
                    required: ["virality", "localization", "seo", "ctaClarity"],
                },
                overallScore: { type: Type.NUMBER, description: "The calculated average of the four scores." },
            },
            required: ["id", "theme", "googleBusinessProfile", "websiteArticle", "socialMediaPost", "scores", "overallScore"],
        },
    };

    const prompt = `
        You are a world-class digital marketing expert specializing in creating viral, localized content for service-based businesses in Kenya.
        
        Your task is to generate 10 unique, viral, and localized marketing content sets for a moving company in Kenya called 'Dial and Move Kenya'.

        The target audience is individuals and businesses in major Kenyan cities like Nairobi, Mombasa, and Kisumu.
        
        Focus the content around the theme: "${topic}".

        Each of the 10 content sets must be tailored for three different platforms: Google Business Profile, a company website blog, and social media (Facebook/Instagram).

        **Crucial Requirements for ALL content:**
        1.  **ALWAYS** include the call to action with phone numbers: "Get a Moving Quote-0726148038 / 0729588291".
        2.  Use a generous amount of relevant emojis (like 🚚📦🇰🇪✨) to make the content engaging.
        3.  Include popular and relevant Kenyan hashtags (e.g., #MoversInNairobi, #KenyaMoves, #DialAndMoveKE, #HamaSalama, #MovingDayKenya, #Githurai, #Westlands).
        4.  The tone must be professional yet friendly and relatable to a Kenyan audience. You can use local phrases where appropriate (e.g., 'hama bila stress', 'hakuna matata moving').

        For each of the 10 content sets, you MUST provide:
        - A unique ID from 1 to 10.
        - A short, catchy 'theme'.
        - Content for 'googleBusinessProfile', 'websiteArticle' (with 'title' and 'body'), and 'socialMediaPost'.
        - Your expert evaluation 'scores' (0-100) for 'virality', 'localization', 'seo', and 'ctaClarity'.
        - A calculated 'overallScore' which is the average of the four scores.

        Return the final output as a valid JSON array that strictly adheres to the provided schema. Do not include any other text or explanation outside of the JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.8,
            },
        });

        const jsonString = response.text.trim();
        const generatedData = JSON.parse(jsonString);

        if (!Array.isArray(generatedData)) {
            throw new Error("API did not return a valid array.");
        }
        
        return generatedData as GeneratedArticle[];

    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to generate articles. The model may be experiencing high traffic. Please try again later.");
    }
};
