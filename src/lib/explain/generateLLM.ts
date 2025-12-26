import type { FullExplanation } from './types';
import { generateLocalExplanation } from './fallback';
import { sanitizeExplanation } from './safety';
import { analyzeText } from '../gemini';

export interface GenerateOptions {
    text: string;
    reportType: string;
    useLLM: boolean;
    images?: string[];
}

// System Prompt for Backend Reference (to be used in api/explain.TS)
export const SYSTEM_PROMPT = `
You are a medical literacy assistant. Your goal is to explain medical terms and report structures in plain English.
STRICT RULES:
1. DO NOT diagnose or provide medical advice.
2. DO NOT use "You have" or "You should".
3. DO NOT interpret specific values as "normal" or "abnormal" unless the text explicitly states "High" or "Low".
4. Output STRICT JSON only.
5. Tone: Neutral, educational, calm.
`;

// (Checking types)
export async function generateExplanation(options: GenerateOptions): Promise<FullExplanation> {
    if (!options.useLLM) {
        console.log('Generating local explanation (Explicit Local Mode)...');
        return generateLocalExplanation(options.text);
    }

    try {
        console.log("Requesting Gemini Full Explanation (Client-Side)...");
        // Pass images if available
        const data = await analyzeText(options.text, 'full', options.images);
        return sanitizeExplanation(data);

    } catch (err) {
        console.warn("LLM Generation failed, falling back to local.", err);
        return sanitizeExplanation(generateLocalExplanation(options.text));
    }
}
