import type { FullExplanation } from './types';

// REVISED SAFETY LOGIC: Claim-based, not vocabulary-based.
// We allow "cancer", "tumor", etc., but block diagnosis and treatment advice.

const DIAGNOSTIC_PATTERNS = [
    /you have/i,
    /you are diagnosed with/i,
    /this confirms/i,
    /we confirm/i,
    /evidence of (definite|certain)/i
];

const CERTAINTY_PATTERNS = [
    /definitely/i,
    /without (a )?doubt/i,
    /guaranteed/i,
    /100%/
];

const TREATMENT_PATTERNS = [
    /start (taking|using)/i,
    /stop (taking|using)/i,
    /prescribe/i,
    /surgery is required/i,
    /you need (chemotherapy|radiation)/i,
    /consult your doctor immediately/i // Alarmist
];

// Fallback message when a term cannot be safely explained
export const FALLBACK_MSG = "This term appears in your report, but explaining it safely requires discussion with your clinician.";

/**
 * Deterministic check for disallowed speech acts.
 * Returns true if the text is safe (no diagnosis/advice).
 */
export function isSafeText(text: string): boolean {
    if (!text) return true;

    // Check all banned patterns
    const allPatterns = [
        ...DIAGNOSTIC_PATTERNS,
        ...CERTAINTY_PATTERNS,
        ...TREATMENT_PATTERNS
    ];

    for (const pattern of allPatterns) {
        if (pattern.test(text)) {
            return false;
        }
    }
    return true;
}

/**
 * Sanitize the FullExplanation object.
 * Enforces safety on all fields.
 */
export function sanitizeExplanation(explanation: FullExplanation): FullExplanation {
    const sanitized = { ...explanation };

    // 1. Sanitize Summary
    if (!isSafeText(sanitized.summary)) {
        sanitized.summary = FALLBACK_MSG;
    }

    // 2. Sanitize Sections
    sanitized.sections = sanitized.sections.map(s => {
        if (!isSafeText(s.summary)) {
            return { ...s, summary: FALLBACK_MSG };
        }
        return s;
    });

    // 3. Sanitize Glossary
    sanitized.glossary = sanitized.glossary.map(t => {
        // If the definition contains unsafe claims, fallback.
        // We do NOT block words like "cancer" anymore.
        if (!isSafeText(t.definition)) {
            return { ...t, definition: FALLBACK_MSG };
        }
        return t;
    });

    // 4. Sanitize Questions (Context)
    sanitized.questions = sanitized.questions.map(q => {
        if (!isSafeText(q.context)) {
            return { ...q, context: "Context hidden for safety." };
        }
        return q;
    });

    // 5. Sanitize Disclaimer (ensure it's not empty, though usually static)
    if (!sanitized.disclaimer) {
        sanitized.disclaimer = "This explanation is for educational purposes only and does not constitute medical advice.";
    }

    return sanitized;
}
