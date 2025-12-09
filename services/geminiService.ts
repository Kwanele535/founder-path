import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Lesson, ToolTemplate } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Lesson Generation ---

const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    duration: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content']
      }
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIndex: { type: Type.INTEGER },
        },
        required: ['question', 'options', 'correctIndex']
      }
    }
  },
  required: ['title', 'duration', 'difficulty', 'sections', 'quiz']
};

export const generateLesson = async (topic: string): Promise<Lesson> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a comprehensive, engaging micro-learning lesson about "${topic}" for a startup founder. 
      The tone should be professional yet encouraging. 
      Include 3 distinct sections and 2 quiz questions at the end.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: lessonSchema,
        systemInstruction: "You are a world-class business educator and startup mentor like Y Combinator partners.",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    const data = JSON.parse(text);
    return {
      id: Date.now().toString(),
      topic,
      ...data
    } as Lesson;
  } catch (error) {
    console.error("Lesson generation failed", error);
    throw error;
  }
};

// --- Mentor Chat ---

export const createMentorChat = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are "FounderBot", a wise, experienced, and empathetic Silicon Valley mentor. 
      You have experience in product management, venture capital, and leadership.
      Keep answers concise (under 150 words) unless asked for details. 
      Be direct but supportive. Use markdown for formatting.`,
    }
  });
};

// --- Business Tool Generator ---

export const generateBusinessTool = async (template: ToolTemplate, inputs: Record<string, string>): Promise<string> => {
  let prompt = template.promptTemplate;
  for (const [key, value] of Object.entries(inputs)) {
    prompt = prompt.replace(`{{${key}}}`, value);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a specialized business analyst AI. Generate high-quality, actionable business documents.",
      }
    });
    return response.text || "Failed to generate tool output.";
  } catch (error) {
    console.error("Tool generation failed", error);
    return "Error generating content. Please try again.";
  }
};

// --- Daily Tip ---
export const getDailyTip = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Give me one short, high-impact tip for a startup founder today. Max 2 sentences.",
        });
        return response.text || "Focus on your users.";
    } catch (e) {
        return "Keep building.";
    }
}

// --- Book Summarizer ---

export const generateBookSummary = async (title: string, author: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a detailed "Founder's Edition" summary of the book "${title}" by ${author}. 
      Structure the response using Markdown.
      Include:
      1. A bold "Core Thesis" statement.
      2. "Top 5 Takeaways" for entrepreneurs.
      3. A "Chapter-by-Chapter" breakdown (summarize key chapters).
      4. "Actionable Tactics" that a founder can apply today.
      
      Make it feel like a high-quality reading experience (approx 1000 words).`,
      config: {
        systemInstruction: "You are an expert book synthesizer creating high-value summaries for busy executives.",
      }
    });
    return response.text || "Summary not available.";
  } catch (error) {
    console.error("Book summary failed", error);
    return "Unable to retrieve book summary at this time.";
  }
}