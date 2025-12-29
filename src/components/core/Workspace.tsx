import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { getRouteConfig } from '../../lib/landingCopy';
import { PageCanvas } from '../canvas/PageCanvas';
import { Header } from './Header';
import { ConsoleOverlay } from '../debug/ConsoleOverlay';
import { ExplanationPanel } from './ExplanationPanel';
import { extractTextFromPDF } from '../../lib/explain/extractText';
import { generatePreview } from '../../lib/explain/preview';
import { generateExplanation } from '../../lib/explain/generateLLM';
import type { PreviewData, FullExplanation } from '../../lib/explain/types';
import { generateSummaryPDF } from '../../lib/exportSummary';
import { loadAppState, clearAppState, saveAppState } from '../../lib/storage';
import { Loader2 } from 'lucide-react';
import { AnalysisProgress, type AnalysisStep } from './AnalysisProgress';
import { SuccessOverlay } from './SuccessOverlay';
import { EmailModal } from '../modals/EmailModal';
import { LandingPageTemplate } from '../landing/LandingPageTemplate';
import { track, trackOnce } from '../../lib/analytics';

export function Workspace() {
    const location = useLocation();
    const routeConfig = getRouteConfig(location.pathname);

    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);

    // Core Logic State
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false); // New: explicit restoration state
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [fullExplanation, setFullExplanation] = useState<FullExplanation | null>(null);
    const [rawText, setRawText] = useState<string>('');
    const [scannedImages, setScannedImages] = useState<string[]>([]); // New State

    const [isPaid, setIsPaid] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [analysisStep, setAnalysisStep] = useState<AnalysisStep | null>(null);
    const [isFullGenMode, setIsFullGenMode] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);


    useEffect(() => {
        const init = async () => {
            const params = new URLSearchParams(window.location.search);
            const sessionId = params.get('session_id');

            if (sessionId) {
                console.log('[Workspace] Session ID detected, verifying...', sessionId);
                setIsRestoring(true); // Start restoration UI
                try {
                    const res = await fetch(`/api/verify-payment?session_id=${sessionId}`);
                    const data = await res.json();

                    if (res.ok && data.verified) {
                        console.log('[Workspace] Payment verified by server.');
                        setIsPaid(true);

                        setIsPaid(true);

                        // Fire Google Ads Conversion + Analytics
                        track('purchase_completed', {
                            transaction_id: sessionId,
                            value: 19.99,
                            currency: 'USD',
                            page_path: window.location.pathname
                        });

                        // Restore state
                        const restored = await loadAppState() as any;
                        const savedFile = restored.file;
                        let savedExplanation = restored.fullExplanation;
                        let savedImages = restored.images;
                        let savedText = restored.rawText;
                        let savedPreview = restored.previewData;

                        if (savedFile) {
                            console.log('[Workspace] Saved file found. Restoring...');
                            setFile(savedFile);

                            // 1. Load PDF Pages (Required for UI)
                            const doc = await loadPDF(savedFile);
                            const loadedPages: pdfjsLib.PDFPageProxy[] = [];
                            for (let i = 1; i <= doc.numPages; i++) {
                                loadedPages.push(await doc.getPage(i));
                            }
                            setPages(loadedPages);

                            // 2. Restore or Regenerate Data
                            // For scanned docs: images matter, not text
                            // For text PDFs: text matters
                            // Only re-extract if we have NEITHER

                            const hasText = savedText !== undefined && savedText !== null;
                            const hasImages = savedImages && savedImages.length > 0;

                            if (!hasText && !hasImages) {
                                console.log('[Workspace] Missing saved text AND images. Re-extracting...');
                                const { fullText, images } = await extractTextFromPDF(doc);
                                savedText = fullText;
                                savedImages = images;
                            }

                            // Set states
                            setRawText(savedText || '');
                            if (savedImages && savedImages.length > 0) {
                                setScannedImages(savedImages);
                            }

                            if (!savedPreview) {
                                console.log('[Workspace] Missing saved preview. Re-generating...');
                                savedPreview = await generatePreview(doc);
                            }
                            setPreviewData(savedPreview);

                            if (savedExplanation) {
                                setFullExplanation(savedExplanation);
                                trackOnce(`unlock_restored_${sessionId}`, 'full_report_unlocked', {
                                    file_size_kb: savedFile.size / 1024
                                });
                            }
                        }

                        // Clear state after restoring
                        await clearAppState();
                        window.history.replaceState({}, '', window.location.pathname);

                        // Show success overlay
                        setShowSuccessOverlay(true);
                    }
                } catch (err) {
                    console.error('[Workspace] Error verifying payment:', err);
                } finally {
                    setIsRestoring(false); // Done restoring
                }
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Effect to trigger Full Generation once Paid and Text is ready
    useEffect(() => {
        if (isPaid && (rawText || scannedImages.length > 0) && !fullExplanation && !isProcessing && previewData) {
            console.log('[Workspace] Paid & Ready. Generating Full Explanation...');
            const runGen = async () => {
                setIsProcessing(true);
                setIsFullGenMode(true);
                setAnalysisStep('generating');
                try {
                    const expl = await generateExplanation({
                        text: rawText,
                        reportType: previewData?.reportType || 'general',
                        useLLM: true,
                        images: scannedImages
                    });
                    setFullExplanation(expl);
                    setAnalysisStep('complete');
                    track('full_report_unlocked', {
                        file_type: 'pdf', // Assuming PDF
                        source: 'generated_fresh'
                    });
                } catch (e) {
                    console.error("Generation failed", e);
                } finally {
                    setIsProcessing(false);
                    setIsFullGenMode(false);
                    setAnalysisStep(null);
                }
            };
            runGen();
        }
    }, [isPaid, rawText, fullExplanation, isProcessing, previewData, scannedImages]);


    const handleFileSelect = async (selectedFile: File) => {
        // Track Start
        track('upload_started', {
            file_name: selectedFile.name,
            file_size_kb: Math.round(selectedFile.size / 1024),
            file_type: selectedFile.type
        });

        setIsProcessing(true);
        setIsFullGenMode(false);
        setAnalysisStep('uploading');
        try {
            setFile(selectedFile);
            setFullExplanation(null);
            setScannedImages([]);

            // Step 1: Upload/Load PDF
            const doc = await loadPDF(selectedFile);

            const loadedPages: pdfjsLib.PDFPageProxy[] = [];
            for (let i = 1; i <= doc.numPages; i++) {
                loadedPages.push(await doc.getPage(i));
            }
            setPages(loadedPages);

            // Step 2: Extract Text & Images
            setAnalysisStep('extracting');
            const { fullText, images } = await extractTextFromPDF(doc);
            setRawText(fullText);
            if (images && images.length > 0) {
                setScannedImages(images);
            }

            // Step 3: Identify Terms
            setAnalysisStep('identifying');
            const preview = await generatePreview(doc);
            setPreviewData(preview);

            track('preview_rendered', {
                page_count: doc.numPages
            });
            track('paywall_shown', {
                source: 'post_upload_preview'
            });

            // Done - save state
            setAnalysisStep('complete');
            saveAppState({
                file: selectedFile,
                rawText: fullText,
                previewData: preview,
                images: images,
                metadata: {
                    lastUpload: Date.now()
                }
            });

            track('upload_completed', {
                file_name: selectedFile.name,
                page_count: pages.length
            });

        } catch (err) {
            console.error(err);
            alert('Failed to load PDF.');
            setFile(null);
        } finally {
            setIsProcessing(false);
            setAnalysisStep(null);
        }
    };

    const handleUnlock = async () => {
        track('purchase_initiated', {
            source: 'unlock_button'
        });
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

    if (!file && !isRestoring) {
        return (
            <LandingPageTemplate
                config={routeConfig}
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
            />
        );
    }


    if (isRestoring || !file) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="text-xl font-semibold text-gray-700">Restoring your session...</div>
                <p className="text-gray-500">Retrieving your document and analysis results.</p>
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
                isDemoMode={false}
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
                        onEmailClick={() => setShowEmailModal(true)}
                    />
                </div>
            </div>

            {/* Overlays */}
            {isProcessing && analysisStep && (
                <AnalysisProgress
                    currentStep={analysisStep}
                    isFullGeneration={isFullGenMode}
                />
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

            {/* Success Overlay - Post Payment */}
            {showSuccessOverlay && (
                <SuccessOverlay
                    onClose={() => setShowSuccessOverlay(false)}
                    onEmailClick={() => setShowEmailModal(true)}
                    onDownloadClick={handleExport}
                />
            )}

            {/* Email Modal */}
            <EmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                explanationData={fullExplanation}
                fileName={file?.name || 'Medical Report'}
            />
            {/* Debug Console for Mobile */}
            {import.meta.env.DEV && <ConsoleOverlay />}
        </div>
    );
}
