
import { GoogleGenAI, Type } from "@google/genai";

// Fixed: Initialize GoogleGenAI with API key from environment variable directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeExam = async (imageData: string, prompt: string) => {
  // Fixed: Use ai.models.generateContent to query GenAI with model and prompt
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageData,
          },
        },
        { text: `Como experto médico amable, analiza este examen de laboratorio de una madre gestante. Explica los valores de forma sencilla, destaca lo que esté normal y señala si algo requiere atención inmediata. Responde en español y mantén un tono tranquilizador pero profesional. Prompt adicional del usuario: ${prompt}` },
      ],
    },
  });
  // Fixed: Use .text property to access generated content
  return response.text;
};

export const getHealthTips = async (healthData: any) => {
  // Fixed: Use ai.models.generateContent to query GenAI with model and prompt
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Basado en estos datos de salud de una mujer embarazada: ${JSON.stringify(healthData)}, proporciona 3 consejos personalizados y amables para su bienestar hoy.`,
  });
  // Fixed: Use .text property to access generated content
  return response.text;
};
