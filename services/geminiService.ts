import { GoogleGenAI, Type } from "@google/genai";
import { EssayAnalysisResult, MockReadingTest, MockListeningTest, MockSpeakingTest, SpeakingFeedback } from "../types";

// Initialize Gemini Client
// NOTE: In a real production build, ensure API_KEY is set in environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Generates a random IELTS Writing Task 2 topic.
 */
export const generateIeltsTopic = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: "Generate one random IELTS Writing Task 2 topic. Return ONLY the topic text, nothing else.",
    });
    return response.text || "Technology in Education: Good or Bad?";
  } catch (error) {
    console.error("Gemini API Error (Topic):", error);
    throw error;
  }
};

/**
 * Analyzes an essay using structured JSON output.
 */
export const analyzeEssay = async (topic: string, essay: string): Promise<EssayAnalysisResult> => {
  try {
    const prompt = `
      Act as an expert IELTS examiner. Analyze the following essay based on the topic: "${topic}".
      Essay: "${essay}"
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            band: {
              type: Type.STRING,
              description: "A score from 0 to 9 (e.g. 6.5)",
            },
            feedback: {
              type: Type.STRING,
              description: "A concise summary of strengths and weaknesses (max 40 words)",
            },
            corrected: {
              type: Type.STRING,
              description: "One specific grammar or vocabulary tip to improve this essay",
            },
          },
          required: ["band", "feedback", "corrected"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as EssayAnalysisResult;
  } catch (error) {
    console.error("Gemini API Error (Analysis):", error);
    throw error;
  }
};

/**
 * Generates a Mock Reading Test (Passage + 10 Questions)
 */
export const generateMockReadingTest = async (): Promise<MockReadingTest> => {
  try {
    const prompt = `
      Generate a realistic IELTS Reading section.
      1. Write an academic passage (approx 500-600 words) on a random scientific or historical topic.
      2. Create 10 challenging multiple-choice questions based on the passage.
      
      Return JSON format.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            passage: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" }
                },
                required: ["id", "text", "options", "correctIndex"]
              }
            }
          },
          required: ["title", "passage", "questions"]
        }
      }
    });

    return JSON.parse(response.text!) as MockReadingTest;
  } catch (error) {
    console.error("Gemini API Error (Reading Mock):", error);
    throw error;
  }
};

/**
 * Generates a Mock Listening Test Script + Questions
 */
export const generateMockListeningTest = async (): Promise<MockListeningTest> => {
  try {
    const prompt = `
      Generate a realistic IELTS Listening Section 1 or 2.
      1. Write a natural dialogue script (approx 400 words) between two people (e.g., booking a hotel, student enquiry).
      2. Create 10 multiple-choice questions based on specific details in the script.
      
      Return JSON format.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING, description: "Short description of the context" },
            script: { type: Type.STRING, description: "The full dialogue text" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER }
                },
                required: ["id", "text", "options", "correctIndex"]
              }
            }
          },
          required: ["scenario", "script", "questions"]
        }
      }
    });

    return JSON.parse(response.text!) as MockListeningTest;
  } catch (error) {
    console.error("Gemini API Error (Listening Mock):", error);
    throw error;
  }
};

/**
 * Generates Speaking Interview Questions (Part 1 & 3 Style)
 */
export const generateMockSpeakingTest = async (): Promise<MockSpeakingTest> => {
  try {
    const prompt = `
      Generate 5 IELTS Speaking Interview questions.
      - Start with 2 simple "Introduction/Warm-up" questions (Part 1).
      - Follow with 3 "Discussion/Abstract" questions (Part 3).
      - Ensure the questions flow logically around a single theme (e.g., Travel, Technology, Family).
      - Return ONLY the list of question strings.
      
      Return JSON format.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["questions"]
        }
      }
    });

    return JSON.parse(response.text!) as MockSpeakingTest;
  } catch (error) {
    console.error("Gemini API Error (Speaking Mock):", error);
    throw error;
  }
};

/**
 * Evaluates the Speaking Transcript
 */
export const evaluateSpeakingPerformance = async (transcript: { question: string, answer: string }[]): Promise<SpeakingFeedback> => {
  try {
    const prompt = `
      Act as an IELTS Speaking Examiner. Evaluate the following Q&A session transcript:
      ${JSON.stringify(transcript)}

      Provide a Band Score and specific feedback on Fluency, Vocabulary, Grammar, and Pronunciation (based on text evidence).
      
      Return JSON format.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            band: { type: Type.STRING, description: "0-9 Score" },
            fluency: { type: Type.STRING, description: "Feedback on length and flow" },
            vocabulary: { type: Type.STRING, description: "Feedback on word choice" },
            grammar: { type: Type.STRING, description: "Feedback on sentence structure" },
            pronunciation: { type: Type.STRING, description: "General pronunciation tips based on the flow (theoretical)" }
          },
          required: ["band", "fluency", "vocabulary", "grammar", "pronunciation"]
        }
      }
    });

    return JSON.parse(response.text!) as SpeakingFeedback;
  } catch (error) {
    console.error("Gemini API Error (Speaking Eval):", error);
    throw error;
  }
};