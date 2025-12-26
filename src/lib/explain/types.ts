import type { ReportType } from './reportType';
import type { TermDefinition } from './terms';
import type { Section } from './segment';

export type { ReportType, TermDefinition, Section };


export interface ExplanationSection {
    originalTitle: string;
    summary: string; // Plain language summary
    // originalContent is implicitly available via mapping or we can store it
}

export interface QuestionPrompt {
    question: string;
    context: string; // Why ask this?
}

export interface FullExplanation {
    reportType: ReportType;
    summary: string; // Overall summary
    sections: ExplanationSection[];
    glossary: TermDefinition[];
    questions: QuestionPrompt[];
    disclaimer: string;
}

export interface PreviewData {
    reportType: ReportType;
    detectedSections: string[];
    detectedTermsCount: number;
    previewTerm: TermDefinition | null;
    isLocked: boolean;
}
