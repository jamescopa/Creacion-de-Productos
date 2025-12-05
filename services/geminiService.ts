import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductContent = async (
  productName: string,
  category: string,
  keywords: string
): Promise<{ description: string; tags: string[] }> => {
  try {
    const prompt = `
      Act as an expert e-commerce copywriter. 
      Write a persuasive, SEO-friendly product description (max 60 words) for a product named "${productName}" in the category "${category}".
      Additional context/keywords: ${keywords}.
      Also provide 3-5 relevant hashtag keywords.
      
      Return the response in JSON format with the following schema:
      {
        "description": "The product description text",
        "tags": ["tag1", "tag2", "tag3"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
