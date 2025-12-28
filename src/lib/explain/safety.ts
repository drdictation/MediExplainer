import type { FullExplanation } from './types';

// MVP SAFETY SPEC: Claim-based Blocking Only
// We allow "cancer", "tumor", etc.
// We block strict diagnosis ("You have") and prognosis ("survival").

const DIAGNOSTIC_CLAIMS = [
    /you have/i,
    /you need/i,
    /you should/i,
    /start (taking|treatment)/i,
    /stop (taking|treatment)/i,
    /your diagnosis is/i
];

const PROGNOSIS_CLAIMS = [
    /prognosis/i,
    /survival rate/i,
    /life expectancy/i,
    /terminal (illness|cancer)/i,
    /cure/i
];

// If the Emergency Brake triggers (rare), we use this neutral educational fallback.
// We avoid "Unavailable" to reduce user anxiety.
export const FALLBACK_MSG = "This term is discussed in the report. For a specific interpretation of how it applies to you, please consult your clinician.";

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

    // 5. Sanitize Disclaimer
    if (!sanitized.disclaimer) {
        sanitized.disclaimer = "This explanation is for educational purposes only and does not constitute medical advice.";
    }

    return sanitized;
}
