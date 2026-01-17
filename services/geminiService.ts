
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Servicio de IA para Ceres - Ser Mujer.
 * Utiliza Google Gemini para análisis de laboratorio y recomendaciones de salud.
 */

// Initialize the Gemini API client using the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Analyze medical exams using Gemini 3 Pro for complex reasoning
export const analyzeExam = async (imageData: string, prompt: string) => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData,
      },
    };
    
    const textPart = {
      text: prompt || "Analiza detalladamente este resultado de laboratorio médico. Explica los valores encontrados, su significado en el contexto de un embarazo y destaca cualquier anomalía que deba ser consultada con el especialista Ceres."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "Eres un asistente médico experto de Ceres. Tu labor es interpretar exámenes de laboratorio para mujeres embarazadas. Proporciona explicaciones claras, empáticas y profesionales. Siempre recomienda validar los resultados con su gineco-obstetra.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error al analizar el examen:", error);
    return "Lo sentimos, no pudimos procesar el análisis en este momento. Por favor, asegúrese de que la imagen sea nítida.";
  }
};

// Generate health tips using Gemini 3 Flash for quick text tasks
export const getHealthTips = async (healthData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Proporciona 3 recomendaciones de salud basadas en estos datos: ${JSON.stringify(healthData)}.`,
      config: {
        systemInstruction: "Genera consejos breves y saludables para el bienestar materno.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error al obtener consejos de salud:", error);
    return "Continúe con su hidratación y asista a sus controles prenatales programados.";
  }
};
