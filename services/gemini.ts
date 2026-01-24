
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getRecommendedItems(query: string, menu: MenuItem[]): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the following cafe menu items: ${JSON.stringify(menu.map(m => ({ id: m.id, name: m.name, desc: m.description })))}. 
                 The user is asking: "${query}". 
                 Recommend the IDs of the top 3 most relevant items from the menu as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function getSmartDescription(itemName: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Write a short, appetizing, one-sentence description for a cafe item called "${itemName}". Keep it under 15 words.`,
        });
        return response.text || "";
    } catch (e) {
        return "A delicious treat from our kitchen.";
    }
}
