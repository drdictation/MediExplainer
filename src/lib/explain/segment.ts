export interface Section {
    title: string;
    content: string;
}

const SECTION_HEADERS = [
    'findings',
    'impression',
    'conclusion',
    'interpretation',
    'technique',
    'exam',
    'history',
    'clinical indication',
    'result',
    'reference range',
    'comments',
    'plan',
    'assessment',
    'diagnosis',
    'discharge diagnoses',
    'hospital course',
];

export function segmentText(text: string): Section[] {
    const lines = text.split('\n');
    const sections: Section[] = [];
    let currentTitle = 'Introduction';
    let currentContent: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const lower = trimmed.toLowerCase();

        // Detect Header (Simple: "Title:")
        let isHeader = false;
        for (const header of SECTION_HEADERS) {
            if (lower.startsWith(header + ':') || lower === header) {
                // Save previous
                if (currentContent.length > 0) {
                    sections.push({
                        title: currentTitle,
                        content: currentContent.join('\n')
                    });
                }

                // Start new
                currentTitle = header.charAt(0).toUpperCase() + header.slice(1); // capitalize
                // If line was "Findings: The lungs...", keep content. If just "Findings:", empty.
                const contentPart = trimmed.substring(header.length + (lower.endsWith(':') ? 1 : 0)).trim();
                currentContent = contentPart ? [contentPart] : [];
                isHeader = true;
                break;
            }
        }

        if (!isHeader) {
            currentContent.push(line);
        }
    }

    // Push last section
    if (currentContent.length > 0) {
        sections.push({
            title: currentTitle,
            content: currentContent.join('\n')
        });
    }

    // Filter out empty or extremely short sections
    return sections.filter(s => s.content.length > 10);
}
