export type ReportType = 'lab' | 'imaging' | 'discharge' | 'general';

export interface ReportTypeResult {
    type: ReportType;
    confidence: number;
    reason: string;
}

const KEYWORDS = {
    lab: ['reference range', 'range', 'units', 'analyte', 'flag', 'mmol/L', 'mg/dL', 'specimen', 'collection date'],
    imaging: ['exam:', 'technique:', 'findings:', 'impression:', 'contrast', 'mri', 'ct', 'ultrasound', 'x-ray'],
    discharge: ['discharge summary', 'discharge diagnosis', 'hospital course', 'discharge medications', 'patient instructions', 'follow-up'],
};

export function detectReportType(text: string): ReportTypeResult {
    const lowerText = text.toLowerCase();

    // Simple frequency count
    let scores = {
        lab: 0,
        imaging: 0,
        discharge: 0
    };

    // Check Lab
    KEYWORDS.lab.forEach(w => {
        if (lowerText.includes(w)) scores.lab++;
    });

    // Check Imaging
    KEYWORDS.imaging.forEach(w => {
        if (lowerText.includes(w)) scores.imaging++;
    });

    // Check Discharge
    KEYWORDS.discharge.forEach(w => {
        if (lowerText.includes(w)) scores.discharge++;
    });

    // Normalize by length? No, raw count is fine for MVP heuristics.

    // Find max
    let maxScore = 0;
    let bestType: ReportType = 'general';

    if (scores.lab > maxScore) { maxScore = scores.lab; bestType = 'lab'; }
    if (scores.imaging > maxScore) { maxScore = scores.imaging; bestType = 'imaging'; }
    if (scores.discharge > maxScore) { maxScore = scores.discharge; bestType = 'discharge'; }

    // Tie-breaking or threshold
    if (maxScore < 2) {
        return { type: 'general', confidence: 0.1, reason: 'Insufficient keywords' };
    }

    return {
        type: bestType,
        confidence: maxScore > 5 ? 0.9 : 0.6,
        reason: `Matched ${maxScore} keywords for ${bestType}`
    };
}
