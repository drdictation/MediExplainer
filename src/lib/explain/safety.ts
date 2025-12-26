import type { FullExplanation } from './types';

const BANNED_PHRASES = [
    /you have/i,
    /you suffer from/i,
    /you are diagnosed with/i,
    /i recommend/i,
    /you should/i,
    /you must/i,
    /urgent/i,
    /emergency/i,
    /life-threatening/i,
    /cancer/i, // Context-dependent, but flagging for review. Actually, preventing "you have cancer" is key.
    /tumor/i,
    /malignancy/i
];

const SAFE_REPLACEMENT = "[Content Hidden: Potential medical advice or diagnosis detected. Please consult your clinician.]";

function isSafeText(text: string): boolean {
    for (const regex of BANNED_PHRASES) {
        if (regex.test(text)) return false;
    }
    return true;
}

export function sanitizeExplanation(explanation: FullExplanation): FullExplanation {
    const sanitized = { ...explanation };

    // 1. Sanitize Summary
    if (!isSafeText(sanitized.summary)) {
        sanitized.summary = SAFE_REPLACEMENT;
    }

    // 2. Sanitize Sections
    sanitized.sections = sanitized.sections.map(s => {
        if (!isSafeText(s.summary)) {
            return { ...s, summary: SAFE_REPLACEMENT };
        }
        return s;
    });

    // 3. Sanitize Glossary (definitions usually safe, but check)
    sanitized.glossary = sanitized.glossary.map(t => {
        if (!isSafeText(t.definition)) {
            return { ...t, definition: "Definition unavailable." };
        }
        return t;
    });

    // 4. Sanitize Questions (Context)
    sanitized.questions = sanitized.questions.map(q => {
        if (!isSafeText(q.context)) {
            return { ...q, context: "Context hidden." };
        }
        return q;
    });

    return sanitized;
}
