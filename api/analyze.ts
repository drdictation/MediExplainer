import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// Initialize Gemini
// NOTE: Vercel functions will read process.env automatically
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text, mode, images } = req.body;

    if (!text && (!images || images.length === 0)) {
        return res.status(400).json({ error: 'No text or images provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Helper to try generation with fallback models
    async function generateWithFallback(systemInstruction: string, prompt: string, imageParts?: any[]) {
        const modelsToTry = ["gemini-2.5-flash-lite", "gemini-2.0-flash-lite-preview-02-05", "gemini-1.5-flash"];

        let lastError;
        for (const modelName of modelsToTry) {
            try {
                console.log(`[API] Attempting analysis with model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: { responseMimeType: "application/json" }
                });

                const parts: any[] = [{ text: systemInstruction + "\n\n" + prompt }];
                if (imageParts && imageParts.length > 0) {
                    console.log(`[API] Attaching ${imageParts.length} images to request...`);
                    parts.push(...imageParts);
                }

                const result = await model.generateContent({
                    contents: [{ role: "user", parts }]
                });

                return result.response.text();
            } catch (err: any) {
                console.warn(`[API] Model ${modelName} failed:`, err.message);
                lastError = err;
                if (err.message && (err.message.includes("API_KEY") || err.message.includes("403"))) {
                    throw err;
                }
            }
        }
        throw lastError || new Error("All models failed");
    }

    try {
        // Prepare Images if any
        let imageParts: any[] = [];
        if (images && Array.isArray(images)) {
            imageParts = images.map(b64 => ({
                inlineData: {
                    data: b64,
                    mimeType: "image/jpeg"
                }
            }));
        }

        // Prompt Engineering based on Mode
        let systemInstruction = "";
        let prompt = "";

        if (mode === 'preview') {
            systemInstruction = `
                You are a medical document analyzer. 
                Goal: Identify the report type, finding header sections, and list ALL medical terms found.
                ${images?.length ? "NOTE: This is a SCANNED DOCUMENT (Images). Use OCR to read the text." : ""}
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
            prompt = images?.length ? "Analyze these scanned document images:" : `Analyze this text structure: \n\n${text.substring(0, 15000)}`;
        } else {
            systemInstruction = `
                You are a medical literacy assistant. Explain this report to a patient in plain English.
                ${images?.length ? "NOTE: This is a SCANNED DOCUMENT (Images). Use OCR to read the text." : ""}
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
            `;
            prompt = images?.length ? "Explain this full medical report (from images):" : `Explain this full medical report: \n\n${text}`;
        }

        const jsonString = await generateWithFallback(systemInstruction, prompt, imageParts);
        const data = JSON.parse(jsonString);

        return res.status(200).json(data);

    } catch (err: any) {
        console.error("Gemini Analysis Failed:", err);
        return res.status(500).json({ error: err.message || 'Analysis failed' });
    }
}
