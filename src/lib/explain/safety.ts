import type { FullExplanation } from './types';

// MVP SAFETY SPEC: Claim-based Blocking Only
// Behavior: Drop offending sentences. Never block whole output. Never show "Definition unavailable".

// 1. Diagnostic Claims (You have...)
const DIAGNOSTIC_CLAIMS = [
    /\b(you|your)\b.*\b(have|has|need|must|should|require|start|stop)\b/i,
    /\bthis (confirms|indicates|proves|means)\b/i
];

// 2. Prognosis / Survival
const PROGNOSIS_CLAIMS = [
    /\bprognosis\b/i,
    /\bsurvival\b/i,
    /\blife expectancy\b/i,
    /\bterminal\b/i,
    /\bcure\b/i
];

/**
 * Deterministic check for disallowed speech acts.
 * Returns true if the text is safe (no diagnosis/prognosis/treatment).
 */
export function isSafeText(text: string): boolean {
    if (!text) return true;

    // Check all banned patterns
    const allPatterns = [
        ...DIAGNOSTIC_CLAIMS,
        ...PROGNOSIS_CLAIMS
    ];

    for (const pattern of allPatterns) {
        if (pattern.test(text)) {
            return false;
        }
    }
    return true;
}

/**
 * Helper to process text: Split into sentences, filter unsafe ones, rejoin.
 * If all sentences are dropped, return a minimal safe fallback.
 */
function cleanText(text: string): string {
    if (!text) return text;

    // Simple sentence splitter (matches periods, exclamation, question marks)
    // We treat newlines as separators too.
    const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];

    const safeSentences = sentences.filter(s => isSafeText(s));

    if (safeSentences.length === 0 && text.trim().length > 0) {
        // Fallback only if EVERYTHING was unsafe.
        return "This term is mentioned in the report.";
    }

    return safeSentences.join("").trim();
}

/**
 * Sanitize the FullExplanation object.
 * Enforces safety on all fields by dropping unsafe sentences.
 */
export function sanitizeExplanation(explanation: FullExplanation): FullExplanation {
    const sanitized = { ...explanation };

    // 1. Sanitize Summary
    sanitized.summary = cleanText(sanitized.summary);

    // 2. Sanitize Sections
    sanitized.sections = sanitized.sections.map(s => {
        return { ...s, summary: cleanText(s.summary) };
    });

    // 3. Sanitize Glossary
    sanitized.glossary = sanitized.glossary.map(t => {
        const cleanedDef = cleanText(t.definition);
        return { ...t, definition: cleanedDef };
    });

    // 4. Sanitize Questions (Context)
    sanitized.questions = sanitized.questions.map(q => {
        return { ...q, context: cleanText(q.context) };
    });

    // 5. Sanitize Disclaimer
    if (!sanitized.disclaimer) {
        sanitized.disclaimer = "This explanation is for educational purposes only and does not constitute medical advice.";
    }

    return sanitized;
}
