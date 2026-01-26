import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Utility function
export async function getGeminiResponse(userMessage) {
  try {

    
    const prompt = `
You are a helpful assistant.

RULES:
- ALWAYS respond in valid Markdown
- Use proper headings
- Use bullet points or numbered lists
- Preserve line breaks
- Use fenced code blocks for code

User message:
${userMessage}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    });

    return response.text;

  } catch (error) {
    console.error("Gemini error:", error);
    throw error;
  }
}

export default getGeminiResponse;
