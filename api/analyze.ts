import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini
// NOTE: Vercel functions will read process.env automatically
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, mode } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        // Prompt Engineering based on Mode
        let systemInstruction = "";
        let prompt = "";

        if (mode === 'preview') {
            // Preview Mode: Fast, minimal token usage. Just finding structure.
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
                Do NOT define the other detectedTerms, just list them.
            `;
            prompt = `Analyze this text structure: \n\n${text.substring(0, 15000)}`; // Limit input for speed/cost if needed
        } else {
            // Full Mode: Deep explanation
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
                1. No medical advice/diagnosis. "The report states X", not "You have X".
                2. Explain terms simply.
                3. Be reassuring but neutral.
            `;
            prompt = `Explain this full medical report: \n\n${text}`;
        }

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: systemInstruction + "\n\n" + prompt }] }]
        });

        const response = result.response;
        const jsonString = response.text();
        const data = JSON.parse(jsonString);

        return res.status(200).json(data);

    } catch (err: any) {
        console.error("Gemini Analysis Failed:", err);
        return res.status(500).json({ error: err.message || 'Analysis failed' });
    }
}
