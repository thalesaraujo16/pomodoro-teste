
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Always initialize with named parameter and direct process.env.API_KEY access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudyTip = async (taskDescription?: string): Promise<string> => {
  try {
    // Calling generateContent directly with the model name as per guidelines
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Forneça uma dica rápida e motivadora de estudo ou resolução de questões em português. ${
        taskDescription ? `O foco atual é: ${taskDescription}` : ""
      }. Seja breve (máximo 2 frases).`,
    });
    // Use .text property directly (not as a method)
    return response.text || "Continue focado! Cada questão resolvida é um passo rumo ao seu objetivo.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o foco e a consistência nos estudos!";
  }
};
