import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib';
import type { FullExplanation } from './explain/types';

// Brand colors
const BRAND_BLUE = rgb(0.12, 0.38, 0.71);
const HEADER_BLUE = rgb(0.15, 0.45, 0.82);
const LIGHT_GRAY = rgb(0.6, 0.6, 0.6);
const DARK_GRAY = rgb(0.2, 0.2, 0.2);
const SECTION_BG = rgb(0.97, 0.97, 0.97);

export async function generateSummaryPDF(explanation: FullExplanation, _originalFileName: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const contentWidth = width - (margin * 2);
    let y = height - 50;
    const lineHeight = 16;
    let pageNumber = 1;

    // Helper: Add new page if needed
    const checkPageBreak = (requiredSpace: number = 80) => {
        if (y < margin + requiredSpace) {
            drawFooter(page, pageNumber);
            pageNumber++;
            page = pdfDoc.addPage();
            y = height - 50;
            return true;
        }
        return false;
    };

    // Helper: Draw footer on page
    const drawFooter = (pg: PDFPage, pgNum: number) => {
        const footer = `Page ${pgNum} • Generated ${new Date().toLocaleDateString()} • ExplainMyMedicalReport.com`;
        pg.drawText(footer, {
            x: margin,
            y: 25,
            size: 8,
            font: font,
            color: LIGHT_GRAY,
        });

        // Disclaimer line
        const disclaimer = 'This document is for educational purposes only. Not medical advice.';
        pg.drawText(disclaimer, {
            x: margin,
            y: 15,
            size: 7,
            font: font,
            color: LIGHT_GRAY,
        });
    };

    // Helper: Text wrapping
    const drawWrappedText = (text: string, size: number = 11, f: PDFFont = font, color = DARK_GRAY, indent: number = 0) => {
        const maxWidth = contentWidth - indent;
        const words = text.split(' ');
        let line = '';

        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = f.widthOfTextAtSize(testLine, size);
            if (testWidth > maxWidth && line.length > 0) {
                checkPageBreak(lineHeight);
                page.drawText(line.trim(), { x: margin + indent, y, size, font: f, color });
                y -= lineHeight;
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        if (line.length > 0) {
            checkPageBreak(lineHeight);
            page.drawText(line.trim(), { x: margin + indent, y, size, font: f, color });
            y -= lineHeight;
        }
        y -= 6; // Paragraph gap
    };

    // Helper: Section Header
    const drawSectionHeader = (title: string, icon: string = '') => {
        checkPageBreak(60);
        y -= 10;

        // Draw background bar
        page.drawRectangle({
            x: margin - 5,
            y: y - 8,
            width: contentWidth + 10,
            height: 28,
            color: SECTION_BG,
        });

        const headerText = icon ? `${icon}  ${title}` : title;
        page.drawText(headerText.toUpperCase(), {
            x: margin,
            y,
            size: 12,
            font: boldFont,
            color: BRAND_BLUE,
        });
        y -= 30;
    };

    // Helper: Divider line
    const drawDivider = () => {
        y -= 5;
        page.drawLine({
            start: { x: margin, y },
            end: { x: width - margin, y },
            thickness: 0.5,
            color: rgb(0.85, 0.85, 0.85),
        });
        y -= 15;
    };

    // ==================== PDF CONTENT ====================

    // HEADER SECTION
    page.drawRectangle({
        x: 0,
        y: height - 80,
        width: width,
        height: 80,
        color: HEADER_BLUE,
    });

    page.drawText('EXPLAINMYMEDICALREPORT', {
        x: margin,
        y: height - 45,
        size: 18,
        font: boldFont,
        color: rgb(1, 1, 1),
    });

    page.drawText('Your Medical Report Explained in Plain English', {
        x: margin,
        y: height - 65,
        size: 11,
        font: font,
        color: rgb(0.9, 0.9, 0.95),
    });

    y = height - 110;

    // Report Type Badge
    const reportTypeBadge = `Report Type: ${explanation.reportType.toUpperCase()}`;
    page.drawRectangle({
        x: margin,
        y: y - 5,
        width: font.widthOfTextAtSize(reportTypeBadge, 10) + 16,
        height: 20,
        color: rgb(0.9, 0.95, 1),
    });
    page.drawText(reportTypeBadge, {
        x: margin + 8,
        y,
        size: 10,
        font: boldFont,
        color: BRAND_BLUE,
    });
    y -= 35;

    // DISCLAIMER (Top)
    page.drawText('⚠️  ' + explanation.disclaimer, {
        x: margin,
        y,
        size: 9,
        font: font,
        color: LIGHT_GRAY,
        maxWidth: contentWidth,
    });
    y -= 30;

    drawDivider();

    // SUMMARY SECTION
    drawSectionHeader('Summary', '📋');
    drawWrappedText(explanation.summary, 11, font, DARK_GRAY);

    drawDivider();

    // DETAILED SECTIONS
    drawSectionHeader('Detailed Section Breakdown', '📖');
    for (const section of explanation.sections) {
        checkPageBreak(60);

        // Section title with arrow
        page.drawText(`▸ ${section.originalTitle}`, {
            x: margin,
            y,
            size: 11,
            font: boldFont,
            color: DARK_GRAY,
        });
        y -= 18;

        drawWrappedText(section.summary, 10, font, rgb(0.35, 0.35, 0.35), 15);
        y -= 8;
    }

    drawDivider();

    // GLOSSARY
    if (explanation.glossary.length > 0) {
        drawSectionHeader('Key Medical Terms', '🔬');
        for (const term of explanation.glossary) {
            checkPageBreak(40);

            page.drawText(`• ${term.term}`, {
                x: margin,
                y,
                size: 10,
                font: boldFont,
                color: DARK_GRAY,
            });

            // Category tag
            const categoryTag = `[${term.category}]`;
            page.drawText(categoryTag, {
                x: margin + font.widthOfTextAtSize(`• ${term.term}  `, 10),
                y,
                size: 8,
                font: font,
                color: LIGHT_GRAY,
            });
            y -= 14;

            drawWrappedText(term.definition, 9, font, rgb(0.4, 0.4, 0.4), 15);
            y -= 4;
        }
        drawDivider();
    }

    // QUESTIONS FOR DOCTOR
    if (explanation.questions.length > 0) {
        drawSectionHeader('Questions for Your Clinician', '❓');
        page.drawText('These suggested questions can help you discuss your results with your doctor.', {
            x: margin,
            y,
            size: 9,
            font: font,
            color: LIGHT_GRAY,
        });
        y -= 20;

        for (let i = 0; i < explanation.questions.length; i++) {
            checkPageBreak(50);
            const q = explanation.questions[i];

            page.drawText(`${i + 1}. "${q.question}"`, {
                x: margin,
                y,
                size: 10,
                font: boldFont,
                color: BRAND_BLUE,
            });
            y -= 14;

            drawWrappedText(`Context: ${q.context}`, 9, font, LIGHT_GRAY, 15);
            y -= 6;
        }
    }

    // Final footer on last page
    drawFooter(page, pageNumber);

    return pdfDoc.save();
}
