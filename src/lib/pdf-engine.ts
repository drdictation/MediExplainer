import * as pdfjsLib from 'pdfjs-dist';

// Define the worker source.
// For Vite, we can usually just point to the CDN or a local copy.
// Using CDN for simplicity in MVP, but for "Offline" claim we should ideal bundle it.
// However, the import approach with ?url is safer for Vite.
import workerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PDFPageInfo {
    pageNumber: number;
    width: number;
    height: number;
    viewport: pdfjsLib.PageViewport;
}

export async function loadPDF(file: File): Promise<pdfjsLib.PDFDocumentProxy> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    return loadingTask.promise;
}

export async function renderPageToCanvas(
    page: pdfjsLib.PDFPageProxy,
    canvas: HTMLCanvasElement,
    scale = 2.0
): Promise<void> {
    const viewport = page.getViewport({ scale });

    // Set dimensions
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext as any).promise;
}

export async function extractTextFromPage(page: pdfjsLib.PDFPageProxy): Promise<string> {
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
}

export async function renderPageToImage(page: pdfjsLib.PDFPageProxy, scale = 1.5): Promise<string> {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context not found');

    const renderContext = {
        canvasContext: context,
        viewport,
    };
    await page.render(renderContext as any).promise;

    // Convert to Base64 (remove 'data:image/jpeg;base64,' prefix for Gemini)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    return dataUrl.split(',')[1];
}

import { PDFDocument } from 'pdf-lib';

/**
 * Converts an image file (PNG/JPG) to a single-page PDF File.
 */
export async function convertImageToPDF(imageFile: File): Promise<File> {
    const pdfDoc = await PDFDocument.create();
    const imageBytes = await imageFile.arrayBuffer();

    let image;
    if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(imageBytes);
    } else if (imageFile.type === 'image/png') {
        image = await pdfDoc.embedPng(imageBytes);
    } else {
        throw new Error('Unsupported image format. Please upload JPG or PNG.');
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
    });

    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes as any], imageFile.name.split('.')[0] + '.pdf', {
        type: 'application/pdf',
        lastModified: Date.now(),
    });
}
