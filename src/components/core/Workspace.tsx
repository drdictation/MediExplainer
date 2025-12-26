import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { getRouteConfig } from '../../lib/landingCopy';
import { PDFUploader } from './PDFUploader';
import { PageCanvas } from '../canvas/PageCanvas';
import { Header } from './Header';
import { ExplanationPanel } from './ExplanationPanel';
import { Footer } from './Footer';
import { extractTextFromPDF } from '../../lib/explain/extractText';
import { generatePreview } from '../../lib/explain/preview';
import { generateExplanation } from '../../lib/explain/generateLLM';
import type { PreviewData, FullExplanation } from '../../lib/explain/types';
import { generateSummaryPDF } from '../../lib/exportSummary'; // Add this
import { loadAppState, clearAppState, saveAppState } from '../../lib/storage';
import { Loader2 } from 'lucide-react';

export function Workspace() {
    const location = useLocation();
    const routeConfig = getRouteConfig(location.pathname);

    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);

    // Core Logic State
    const [isProcessing, setIsProcessing] = useState(false);
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [fullExplanation, setFullExplanation] = useState<FullExplanation | null>(null);
    const [rawText, setRawText] = useState<string>('');
    const [scannedImages, setScannedImages] = useState<string[]>([]); // New State

    const [isPaid, setIsPaid] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (sessionId) {
                console.log('[Workspace] Session ID detected, verifying...', sessionId);
                try {
                    const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
                    const data = await res.json();

                    if (res.ok && data.verified) {
                        console.log('[Workspace] Payment verified by server.');
                        setIsPaid(true);

                        // Fire Google Ads Conversion
                        if (typeof window.gtag === 'function') {
                            window.gtag('event', 'conversion', {
                                'send_to': 'AW-17755885311/rtPjCMC9rNcbEP-d1ZJC',
                                'value': 19.99,
                                'currency': 'USD',
                                'transaction_id': sessionId
                            });
                        }

                        // Restore state
                        const { file: savedFile, fullExplanation: savedExplanation, images: savedImages } = await loadAppState() as any;

                        if (savedFile) {
                            console.log('[Workspace] Saved file found, restoring...');
                            await handleFileSelect(savedFile);
                            // If we have saved explanation, strict restore
                            if (savedExplanation) {
                                setFullExplanation(savedExplanation);
                            }
                            if (savedImages) {
                                setScannedImages(savedImages);
                            }
                        }
                        // Clear state after restoring
                        await clearAppState();
                        window.history.replaceState({}, '', window.location.pathname);
                    }
                } catch (err) {
                    console.error('[Workspace] Error verifying payment:', err);
                }
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to trigger Full Generation once Paid and Text is ready
    useEffect(() => {
        if (isPaid && (rawText || scannedImages.length > 0) && !fullExplanation && !isProcessing && previewData) {
            console.log('[Workspace] Paid & Ready. Generatng Full Explanation...');
            const runGen = async () => {
                setIsProcessing(true);
                try {
                    const expl = await generateExplanation({
                        text: rawText,
                        reportType: previewData?.reportType || 'general',
                        useLLM: true,
                        images: scannedImages // Pass images!
                    });
                    setFullExplanation(expl);
                } catch (e) {
                    console.error("Generation failed", e);
                } finally {
                    setIsProcessing(false);
                }
            };
            runGen();
        }
    }, [isPaid, rawText, fullExplanation, isProcessing, previewData, scannedImages]);


    const handleFileSelect = async (selectedFile: File) => {
        setIsProcessing(true);
        try {
            setFile(selectedFile);
            setFullExplanation(null); // Clear old explanation
            setScannedImages([]); // Clear old images

            const doc = await loadPDF(selectedFile);

            const loadedPages: pdfjsLib.PDFPageProxy[] = [];
            for (let i = 1; i <= doc.numPages; i++) {
                loadedPages.push(await doc.getPage(i));
            }
            setPages(loadedPages);

            // 1. Extract Text & Images
            const { fullText, images } = await extractTextFromPDF(doc);
            setRawText(fullText);
            if (images && images.length > 0) {
                setScannedImages(images); // Store images
            }

            // 2. Generate Preview
            // Pass the DOC object so preview can re-extract/verify if needed, 
            // OR just pass the extracted images if we refactor preview signature.
            // Current signature of preview is `generatePreview(file, pdf)`
            const preview = await generatePreview(doc);
            setPreviewData(preview);

            // Save state for potential reload after payment
            if (!isPaid) {
                // We can't save 'fullText' easily in IDB if it's huge, but file is saved.
                // We'll re-extract on reload.
                await saveAppState({ file: selectedFile, redactions: [], images: images }); // Legacy key, also save images
            }

        } catch (err) {
            console.error(err);
            alert('Failed to load PDF.');
            setFile(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUnlock = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/create-checkout-session', { method: 'POST' });
            const data = await res.json();
            if (data.url) {
                // Save state before redirect
                await saveAppState({
                    file: file,
                    // Store strict raw text? Maybe not needed if we have file.
                    metadata: { previewData }
                });
                window.location.href = data.url;
            } else {
                alert('Could not initiate checkout.');
            }
        } catch (e) {
            console.error(e);
            alert('Error starting checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExport = async () => {
        if (!fullExplanation || !file) return;

        try {
            const pdfBytes = await generateSummaryPDF(fullExplanation, file.name);
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Medical_Explanation_${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Export failed", e);
            alert("Failed to generate PDF summary.");
        }
    };

    // --- RENDER ---

    if (!file) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header isPaid={isPaid} hasFile={false} />
                <div className="flex-1 flex flex-col items-center justify-center p-4 gap-12">
                    <div className="text-center space-y-4 max-w-2xl mx-auto mt-8 sm:mt-16">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 tracking-tight leading-tight">
                            {routeConfig.h1}
                        </h1>
                        <p className="text-lg sm:text-lg text-gray-900 font-medium max-w-xl mx-auto border border-blue-100 bg-blue-50 p-4 rounded-lg">
                            {routeConfig.disclaimer}
                        </p>
                        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                            {routeConfig.subhead}
                        </p>

                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm text-sm text-gray-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {routeConfig.trustSignals}
                        </div>
                    </div>

                    <PDFUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} ctaText={routeConfig.ctaText} />

                    <div className="grid sm:grid-cols-3 gap-8 max-w-5xl w-full px-4 text-center">
                        {routeConfig.whyThisMatters.map((bullet, idx) => (
                            <div key={idx} className="space-y-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition-transform">
                                <div className="font-semibold text-gray-900 text-lg">{bullet.title}</div>
                                <p className="text-base text-gray-500 leading-relaxed">{bullet.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1" />
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            <Header
                isPaid={isPaid}
                hasFile={true}
                onExport={handleExport}
                file={file}
            />

            {/* Main Workspace: Split View */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* PDF Viewer (Left/Center) */}
                <div className="flex-1 overflow-y-auto bg-gray-200/50 p-4 sm:p-8 flex flex-col items-center gap-6 relative">
                    {/* Sticky Info Bar */}
                    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border rounded-full px-6 py-2 flex items-center justify-between shadow-sm w-full max-w-2xl mb-4">
                        <span className="font-medium text-gray-700 truncate max-w-[200px]">{file.name}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">{pages.length} Pages</span>
                            <button onClick={() => setShowResetConfirm(true)} className="text-xs text-red-500 font-bold hover:underline">
                                START OVER
                            </button>
                        </div>
                    </div>

                    {pages.map((page, index) => (
                        <div key={index} className="relative shadow-xl">
                            <PageCanvas
                                page={page}
                                pageIndex={index}
                                redactions={[]} // No visual redactions for now
                                onAddRedaction={() => { }} // Disabled
                                onRemoveRedaction={() => { }}
                                isPaid={isPaid}
                            />
                        </div>
                    ))}
                    <div className="h-20" />
                </div>

                {/* Explanation Panel (Right Sidebar) */}
                <div className="z-40 h-full shadow-2xl">
                    <ExplanationPanel
                        isPaid={isPaid}
                        previewData={previewData}
                        fullExplanation={fullExplanation}
                        onUnlock={handleUnlock}
                    />
                </div>
            </div>

            {/* Overlays */}
            {isProcessing && (
                <div className="fixed inset-0 bg-white/80 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Analyzing Document...</h3>
                        <p className="text-gray-500">Extracting medical terms and identifying sections.</p>
                    </div>
                </div>
            )}

            {showResetConfirm && (
                <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Start Over?</h3>
                        <p className="text-gray-600">This will clear the current analysis and return to the home screen.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={() => { setFile(null); setPages([]); setShowResetConfirm(false); }} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium">Yes, Start Over</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
