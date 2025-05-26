import { GoogleGenerativeAI } from '@google/generative-ai';

declare global {
  interface ImportMeta {
    env: {
      VITE_GEMINI_API_KEY: string;
    }
  }
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

export const generateStory = async (
  prompt: string,
  style?: string,
  length: 'short' | 'medium' | 'long' = 'medium'
) => {
  const model = getGeminiModel();
  
  const lengthWords = {
    short: 200,
    medium: 400,
    long: 800,
  };

  const stylePrompt = style ? `Write in ${style} style.` : '';
  const fullPrompt = `
    Write a creative story based on this prompt: "${prompt}"
    ${stylePrompt}
    Make it approximately ${lengthWords[length]} words long.
    Include vivid descriptions, character development, and engaging dialogue.
    Structure the story with a clear beginning, middle, and end.
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
}; 