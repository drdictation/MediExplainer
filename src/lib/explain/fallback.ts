import { detectReportType } from './reportType';
import { segmentText } from './segment';
import { findTerms } from './terms';
import type { FullExplanation } from './types';

const SAFE_DISCLAIMER = "This explanation was generated using a local medical dictionary. It explains terms found in your report but does not interpret the specific clinical context. Always consult your clinician.";

export function generateLocalExplanation(text: string): FullExplanation {
    const reportTypeResult = detectReportType(text);
    const sections = segmentText(text);
    const terms = findTerms(text);

    // Local summary is just a placeholder or extracted first sentence
    const overallSummary = "The report contains findings related to: " +
        sections.map(s => s.title).slice(0, 3).join(', ') +
        (sections.length > 3 ? '...' : '.');

    // Questions: Generic neutral questions
    const questions = [
        { question: "What do these results mean for my overall health?", context: "General inquiry" },
        { question: "Are any values outside the normal range significant?", context: "Lab results context" },
        { question: "Do I need any follow-up testing?", context: "Next steps" }
    ];

    return {
        reportType: reportTypeResult.type,
        summary: overallSummary,
        sections: sections.map(s => ({
            originalTitle: s.title,
            summary: `(Section contains ${s.content.length} characters). Contains terms: ${findTerms(s.content).map(t => t.term).join(', ') || 'None detected.'}`
        })),
        glossary: terms, // Full list
        questions: questions,
        disclaimer: SAFE_DISCLAIMER
    };
}
