import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const enhanceStatusText = async (text: string, tone: 'funny' | 'poetic' | 'excited'): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return text;
  }

  try {
    const prompt = `Rewrite the following social media status update to be ${tone}. Keep it concise and use emojis.
    Original text: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return text;
  }
};

export const suggestReply = async (postContent: string): Promise<string[]> => {
  if (!apiKey) return ["Cool!", "Love this!", "Amazing!"];

  try {
    const prompt = `Suggest 3 short, friendly, and distinct replies to this friend's status update. Return only the replies separated by pipelines (|).
    Status: "${postContent}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text || "";
    return text.split('|').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    return ["Nice!", "Wow!", "Great photo!"];
  }
};
