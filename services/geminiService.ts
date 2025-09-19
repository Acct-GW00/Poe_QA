
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { SYSTEM_PROMPT } from '../constants';
import { QuizQuestion } from '../types';


if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export function createChatSession(systemInstruction: string): Chat {
    const model = 'gemini-2.5-flash';
    return ai.chats.create({
        model: model,
        config: {
            systemInstruction: systemInstruction,
        }
    });
}

export async function generateQuizQuestions(): Promise<QuizQuestion[]> {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `請根據我提供的「國內出差旅費」制度內容，產生 10 道不重複的選擇題來測驗使用者。每道題目必須包含以下內容：
1.  'question': 問題的文字。
2.  'options': 一個包含四個選項的字串陣列。
3.  'answer': 正確答案的文字，此答案必須是 'options' 陣列中的其中一個。
4.  'explanation': 對於正確答案的簡短說明。

請確保問題涵蓋制度的不同面向，例如住宿、交通、膳食、雜費等。請以繁體中文回答，並嚴格遵循指定的 JSON 格式。`;

        const response = await ai.models.generateContent({
            model: model,
            contents: `${SYSTEM_PROMPT}\n\n${prompt}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            answer: { type: Type.STRING },
                            explanation: { type: Type.STRING }
                        },
                        required: ["question", "options", "answer", "explanation"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const questions = JSON.parse(jsonString);

        if (!Array.isArray(questions) || questions.length === 0 || !questions[0].question) {
            throw new Error("AI 未能成功產生有效的題目格式。");
        }
        
        return questions;

    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw new Error("無法產生測驗題目，請稍後再試。");
    }
}
