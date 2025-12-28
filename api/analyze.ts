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

        // PHASES IMPLEMENTATION

        // Common Generative Model
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite", // Use fast model for extraction/definition
            generationConfig: { responseMimeType: "application/json" }
        });

        if (mode === 'preview') {
            const systemInstruction = `
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
            const prompt = images?.length ? "Analyze these scanned document images:" : `Analyze this text structure: \n\n${text.substring(0, 15000)}`;

            const jsonString = await generateWithFallback(systemInstruction, prompt, imageParts);
            return res.status(200).json(JSON.parse(jsonString));
        }

        // --- FULL ANALYSIS PIPELINE ---

        // PHASE 1: EXTRACTION
        // Extract structure and terms without definitions
        console.log("[API] Phase 1: Extraction");
        const phase1System = `
            You are a medical literacy assistant. Analyze this report structure.
            Output JSON:
            {
                "reportType": "lab" | "imaging" | "pathology" | "general",
                "summary": "2-3 sentence overall summary of findings",
                "sections": [
                    { "originalTitle": "Findings", "summary": "Plain language explanation of this section..." }
                ],
                "termCandidates": [
                    { "term": "Exact Term", "section": "Section Name", "context": "Snippet of surrounding text" }
                ],
                "disclaimer": "Standard medical disclaimer."
            }
            RULES:
            1. No medical advice/diagnosis. "The report states X", not "You have X".
            2. Do NOT define terms yet. Just list them in 'termCandidates'.
            3. Do NOT generate questions.
        `;
        const phase1Prompt = images?.length ? "Analyze this full medical report (from images):" : `Analyze this full medical report: \n\n${text}`;

        // Call Model for Phase 1
        const phase1Parts: any[] = [{ text: phase1System + "\n\n" + phase1Prompt }];
        if (imageParts && imageParts.length > 0) phase1Parts.push(...imageParts);

        // Direct call for Phase 1
        const phase1Result = await model.generateContent({ contents: [{ role: "user", parts: phase1Parts }] });
        const phase1Data = JSON.parse(phase1Result.response.text());

        // PHASE 2 & 3: DEFINITION & SAFETY (Batched)
        console.log(`[API] Phase 2: Defining ${phase1Data.termCandidates?.length || 0} terms...`);

        let finalGlossary = [];

        if (phase1Data.termCandidates && phase1Data.termCandidates.length > 0) {
            // Prepare term list for definition
            const uniqueTerms = Array.from(new Set(phase1Data.termCandidates.map((t: any) => t.term)));
            const termsToDefine = uniqueTerms.slice(0, 15); // Batch limit safety

            const phase2System = `
                You are a medical definition engine. Define these terms for a patient.
                
                CORE RULE: THE ATTRIBUTION RULE
                You must NEVER sound like you are diagnosing the user.
                Allowed frames: "The report states...", "This term means...", "In medical context, this describes..."
                Forbidden frames: "You have...", "This confirms...", "Your diagnosis is...", "You need..."

                OTHER RULES:
                1. Educational, neutral tone.
                2. NEVER refuse to define a term. If broad/vague, explain the general meaning.
                3. Rewrite inference verbs ("suggests") to attribution ("report uses language associated with...").
                4. NO TREATMENT ADVICE (drugs, surgery).
                5. Output JSON:
                [
                    { 
                        "term": "Term", 
                        "definition": "Definition...", 
                        "safetyCheck": { "allowed": boolean, "rewrite": string | null } 
                    }
                ]
                If a definition contains diagnostic claims ("You have cancer"), set "allowed": false and provide a NEUTRAL attribution rewrite.
            `;
            const phase2Prompt = `Define these terms: ${JSON.stringify(termsToDefine)}`;

            const phase2Result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: phase2System + "\n\n" + phase2Prompt }] }] });
            const phase2Data = JSON.parse(phase2Result.response.text());

            // Process Phase 2 Results (Phase 4 Enforcement)
            finalGlossary = phase2Data.map((item: any) => {
                let definition = item.definition;

                // Phase 3 Check (LLM Self-Correction) applied in prompt
                if (item.safetyCheck && !item.safetyCheck.allowed) {
                    if (item.safetyCheck.rewrite) {
                        definition = item.safetyCheck.rewrite;
                    }
                    // If no rewrite provided, we fallback to original definition 
                    // We DO NOT block.
                }

                // Phase 4: Deterministic Enforcement (Server-Side using regex)
                // Block ONLY direct diagnosis/prognosis claims.
                const UNSAFE_REGEX = [/you have/i, /you are diagnosed/i, /start taking/i, /prognosis/i, /survival rate/i];
                if (UNSAFE_REGEX.some(r => r.test(definition))) {
                    // Last resort safe fallback
                    definition = "This term is discussed in the report. For a specific interpretation of how it applies to you, please consult your clinician.";
                }

                return {
                    term: item.term,
                    definition: definition,
                    category: "medical"
                };
            });
        }

        // HARDCODED QUESTIONS (Safety)
        const getQuestions = (type: string) => {
            const base = [
                { question: "What is the next step?", context: "To understand the care plan." },
                { question: "Are there lifestyle changes recommended?", context: "For general health." }
            ];

            const specific: Record<string, any[]> = {
                "imaging": [
                    { question: "What additional information is usually needed to interpret this finding?", context: "Imaging often requires clinical correlation." },
                    { question: "Is follow-up imaging standard for this result?", context: "To track changes over time." },
                    { question: "Which specialists are usually involved in assessing this finding?", context: "To understand the care team." }
                ],
                "pathology": [
                    { question: "What does this specific terminology imply about the cells?", context: "Pathology describes cellular changes." },
                    { question: "How does this report influence treatment decisions?", context: "Pathology often guides therapy." },
                    { question: "Is further testing on this sample possible?", context: "Molecular tests are sometimes run." }
                ],
                "lab": [
                    { question: "What factors can cause this result to be out of range?", context: "Many things affect labs." },
                    { question: "Is this a temporary or chronic finding?", context: "To understand duration." },
                    { question: "When should this test be repeated?", context: "To monitor trends." }
                ]
            };

            const typeKey = type?.toLowerCase() || "general";

            if (typeKey.includes("image") || typeKey.includes("scan") || typeKey.includes("ray") || typeKey.includes("mri") || typeKey.includes("ct")) return specific["imaging"];
            if (typeKey.includes("path") || typeKey.includes("biopsy") || typeKey.includes("tissue")) return specific["pathology"];
            if (typeKey.includes("lab") || typeKey.includes("blood") || typeKey.includes("urine")) return specific["lab"];

            return specific["imaging"] || base;
        };

        const safeQuestions = getQuestions(phase1Data.reportType);

        // Assemble Final Response
        const responseData = {
            reportType: phase1Data.reportType,
            summary: phase1Data.summary,
            sections: phase1Data.sections,
            glossary: finalGlossary,
            questions: safeQuestions,
            disclaimer: phase1Data.disclaimer || "Standard medical disclaimer."
        };

        return res.status(200).json(responseData);

    } catch (err: any) {
        console.error("Gemini Analysis Failed:", err);
        return res.status(500).json({ error: err.message || 'Analysis failed' });
    }
}
