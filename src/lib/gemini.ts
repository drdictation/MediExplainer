import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini Client-Side (Local Dev Only)
// @ts-ignore
const LOCAL_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : '');

export async function analyzeText(text: string, mode: 'preview' | 'full') {
    // 1. PRODUCTION / VERCEL MODE: Use Server-Side API to protect key
    if (import.meta.env.PROD || !LOCAL_KEY) {
        console.log(`[Gemini Service] Running in ${import.meta.env.PROD ? 'PRODUCTION' : 'NO_KEY'} mode. Delegating to /api/analyze...`);
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, mode })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Server Analysis Failed');
            }
            return await res.json();
        } catch (err) {
            console.error("[Gemini Service] API Error:", err);
            throw err;
        }
    }

    // 2. LOCAL DEV MODE: Client-Side Call (if key exists)
    console.log(`[Gemini Service] Running in LOCAL mode via Browser.`);
    const genAI = new GoogleGenerativeAI(LOCAL_KEY);

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite", // User requested specific version
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        let systemInstruction = "";
        let prompt = "";

        if (mode === 'preview') {
            systemInstruction = `
                You are a medical document analyzer. 
                Goal: Identify the report type, finding header sections, and list ALL medical terms found.
                Strict JSON Output format:
                {
                    "reportType": "lab" | "imaging" | "discharge" | "general",
                    "detectedSections": ["Section Name 1", "Section Name 2"],
                    "detectedTerms": [
                        { "term": "Term1", "category": "lab" | "imaging" | "condition" | "medication" | "other" },
                        { "term": "Term2", "category": "..." }
                    ],
                     "previewTerm": { "term": "Term1", "definition": "Simple 1 sentence definition", "category": "..." }
                }
                Select ONE term as "previewTerm" to give a definition for.
            `;
            prompt = `Analyze this text structure: \n\n${text.substring(0, 15000)}`;
        } else {
            systemInstruction = `
                You are a medical literacy assistant. Explain this report to a patient in plain English.
                Output JSON:
                {
                    "reportType": "string",
                    "summary": "2-3 sentence overall summary of findings",
                    "sections": [
                        { "originalTitle": "Findings", "summary": "Plain language explanation of this section..." }
                    ],
                    "glossary": [
                        { "term": "Term", "definition": "Definition", "category": "category" }
                    ],
                    "questions": [
                         { "question": "Question to ask doctor?", "context": "Why ask this?" }
                    ],
                    "disclaimer": "Standard medical disclaimer."
                }
                RULES:
                1. No medical advice/diagnosis.
                2. Explain terms simply.
            `;
            prompt = `Explain this full medical report: \n\n${text}`;
        }

        console.log("[Gemini Service] Sending request to Google...");
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + prompt }] }]
        });

        const response = result.response;
        console.log("[Gemini Service] Received response.");
        const jsonString = response.text();
        return JSON.parse(jsonString);

    } catch (err: any) {
        console.error("[Gemini Service] Local Error:", err);
        throw err;
    }
}
