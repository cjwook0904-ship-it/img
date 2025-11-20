import { GoogleGenAI, Modality } from "@google/genai";
import { AspectRatio } from "../types";

// Initialize the client with the environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImageFromPrompt = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    const generatedImage = response.generatedImages?.[0];

    if (!generatedImage || !generatedImage.image || !generatedImage.image.imageBytes) {
      throw new Error("No image data returned from the API.");
    }

    const base64ImageBytes: string = generatedImage.image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return imageUrl;
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image");
  }
};

export const editImage = async (
  base64Data: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    
    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes: string = part.inlineData.data;
      // The API returns raw bytes, assume PNG/JPEG based on input or default. 
      // Usually flash-image returns standard image formats. 
      // We'll construct a PNG data URL for safety as it's common for GenAI outputs.
      const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
      return imageUrl;
    }

    throw new Error("No image data returned from the editing model.");
  } catch (error: any) {
    console.error("Gemini Image Editing Error:", error);
    throw new Error(error.message || "Failed to edit image");
  }
};
