import { GoogleGenAI } from "@google/genai";
import type { Request, Response } from "express";

let cachedClient: GoogleGenAI | null = null;

export function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "La clave GEMINI_API_KEY no está configurada. Por favor configúrala en Settings > Secrets en AI Studio."
    );
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });
  }
  return cachedClient;
}

export async function generateJsonFromPrompt(
  prompt: string,
  temperature = 0.2
): Promise<Record<string, unknown>> {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature,
    },
  });
  const text = response.text || "{}";
  return JSON.parse(text);
}

export function jsonEndpoint(
  buildPrompt: (body: Record<string, unknown>) => { prompt: string; temperature?: number },
  errorMessage: string
) {
  return async (req: Request, res: Response) => {
    try {
      const { prompt, temperature } = buildPrompt(req.body);
      const data = await generateJsonFromPrompt(prompt, temperature);
      res.json(data);
    } catch (error: any) {
      console.error(errorMessage, error);
      res.status(500).json({ error: error.message || errorMessage });
    }
  };
}
