import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { FullExplanation } from './explain/types';

export async function generateSummaryPDF(explanation: FullExplanation, _originalFileName: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let y = height - 50;
    const margin = 50;
    const fontSize = 12;
    const lineHeight = 16;

    const drawText = (text: string, options: { size?: number, font?: any, color?: any } = {}) => {
        if (y < margin) {
            page = pdfDoc.addPage();
            y = height - 50;
        }
        page.drawText(text, {
            x: margin,
            y,
            size: options.size || fontSize,
            font: options.font || font,
            color: options.color || rgb(0, 0, 0),
            maxWidth: width - (margin * 2),
            lineHeight: lineHeight,
        });
        // Estimate height usage (naive)
        const lines = text.split('\n').length; // very naive, assumes no wrapping for now or exact wrapping handled by PDFLib if maxWidth set? 
        // PDFLib breaks lines if maxWidth is set? No, it doesn't auto-wrap text strings unless we use a helper. 
        // For MVP, we will rely on a simple breakdown or just let it clip (bad).
        // Let's assume shorter text or manual wrapping for now.
        y -= (lines * lineHeight) + 10;
    };

    // Helper for wrapping text
    const drawWrappedText = (text: string, size = fontSize, f = font) => {
        const maxWidth = width - (margin * 2);
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = f.widthOfTextAtSize(testLine, size);
            if (testWidth > maxWidth && line.length > 0) {
                if (y < margin + 20) {
                    page = pdfDoc.addPage();
                    y = height - 50;
                }
                page.drawText(line, { x: margin, y, size, font: f });
                y -= lineHeight;
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        if (line.length > 0) {
            if (y < margin + 20) {
                page = pdfDoc.addPage();
                y = height - 50;
            }
            page.drawText(line, { x: margin, y, size, font: f });
            y -= lineHeight;
        }
        y -= 10; // Paragraph gap
    };

    // Title
    drawText('Medical Report Explanation', { size: 24, font: boldFont, color: rgb(0, 0.3, 0.6) });
    y -= 20;

    // Disclaimer (Top)
    drawText(explanation.disclaimer, { size: 10, color: rgb(0.5, 0.5, 0.5) });
    y -= 20;

    // Report Type
    drawText(`Report Type: ${explanation.reportType.toUpperCase()}`, { size: 14, font: boldFont });
    y -= 20;

    // Summary
    drawText('Summary', { size: 16, font: boldFont });
    drawWrappedText(explanation.summary);

    // Sections
    drawText('Detailed Sections', { size: 16, font: boldFont });
    for (const section of explanation.sections) {
        drawText(section.originalTitle, { size: 14, font: boldFont });
        drawWrappedText(section.summary);
        y -= 10;
    }

    // Glossary
    if (explanation.glossary.length > 0) {
        drawText('Key Terms', { size: 16, font: boldFont });
        for (const term of explanation.glossary) {
            drawWrappedText(`${term.term}: ${term.definition}`, 11);
        }
    }

    // Questions
    if (explanation.questions.length > 0) {
        drawText('Questions to Ask Your Clinician', { size: 16, font: boldFont });
        for (const q of explanation.questions) {
            drawWrappedText(`• ${q.question} (${q.context})`);
        }
    }

    // Disclaimer (Bottom)
    y -= 20;
    drawText(explanation.disclaimer, { size: 8, color: rgb(0.5, 0.5, 0.5) });

    return pdfDoc.save();
}
