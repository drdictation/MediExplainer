import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import { loadPDF } from '../../lib/pdf-engine';
import { findSuggestions } from '../../lib/auto-suggest';
import { exportRedactedPDF } from '../../lib/export';
import { getRouteConfig } from '../../lib/landingCopy';
import type { Redaction } from '../../types';
import { PDFUploader } from './PDFUploader';
import { PageCanvas } from '../canvas/PageCanvas';
import { Header } from './Header';
import { Loader2 } from 'lucide-react';

export function Workspace() {
    const location = useLocation();
    const routeConfig = getRouteConfig(location.pathname);

    const [file, setFile] = useState<File | null>(null);
    const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);

    const [redactions, setRedactions] = useState<Redaction[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('success') === 'true') {
            setIsPaid(true);
        }
    }, []);

    const handleFileSelect = async (selectedFile: File) => {
        setIsProcessing(true);
        try {
            setFile(selectedFile);
            const doc = await loadPDF(selectedFile);

            const loadedPages: pdfjsLib.PDFPageProxy[] = [];
            for (let i = 1; i <= doc.numPages; i++) {
                loadedPages.push(await doc.getPage(i));
            }
            setPages(loadedPages);

            runAutoSuggest(loadedPages);

        } catch (err) {
            console.error(err);
            alert('Failed to load PDF.');
            setFile(null);
        } finally {
            setIsProcessing(false);
        }
    };

    const runAutoSuggest = async (loadedPages: pdfjsLib.PDFPageProxy[]) => {
        const newRedactions: Redaction[] = [];

        for (let i = 0; i < loadedPages.length; i++) {
            const suggestions = await findSuggestions(loadedPages[i], i);
            newRedactions.push(...suggestions);
        }

        if (newRedactions.length > 0) {
            setRedactions(prev => [...prev, ...newRedactions]);
        }
    };

    const handleExport = async () => {
        if (!isPaid) return; // Security check: Prevent export for unpaid users
        if (!file || exporting) return;
        setExporting(true);
        try {
            const pdfBytes = await exportRedactedPDF(file, redactions, isPaid);

            const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `redacted-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert('Export failed.');
        } finally {
            setExporting(false);
        }
    };

    const addRedaction = (r: Redaction) => {
        setRedactions(prev => [...prev, r]);
    };

    const removeRedaction = (id: string) => {
        setRedactions(prev => prev.filter(r => r.id !== id));
    };

    if (!file) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header isPaid={isPaid} hasFile={false} />
                <div className="flex-1 flex flex-col items-center justify-center p-4 gap-12">
                    <div className="text-center space-y-4 max-w-2xl mx-auto mt-8 sm:mt-16">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            {routeConfig.h1}
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto leading-relaxed">
                            {routeConfig.subhead}
                        </p>

                        <p className="text-lg sm:text-lg font-medium text-gray-600 max-w-xl mx-auto leading-relaxed">
                            Designed for careful, manual redaction when accuracy matters.
                        </p>

                        <p className="text-sm text-gray-500">
                            You download a PDF file. Pages behave like images.
                        </p>
                    </div>

                    <PDFUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />

                    <div className="grid sm:grid-cols-4 gap-6 max-w-5xl w-full px-4 text-center">
                        {routeConfig.bullets.map((bullet, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="font-semibold text-gray-900">{bullet.title || 'Feature'}</div>
                                <p className="text-sm text-gray-500">{bullet.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1" /> {/* Spacer */}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100/50 relative">
            <Header
                isPaid={isPaid}
                hasFile={true}
                onExport={handleExport}
                file={file}
                redactions={redactions}
            />

            <div className="sticky top-16 z-40 bg-white/90 backdrop-blur border-b px-4 py-2 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{file.name}</span>
                    <span className="text-gray-300">|</span>
                    <span>{pages.length} Pages</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500">Limits: up to 10 pages, 10MB</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1"
                    >
                        Reset
                    </button>
                    {showResetConfirm && (
                        <div className="fixed inset-0 z-[70] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full space-y-4">
                                <h3 className="text-lg font-bold text-gray-900">Clear all redactions?</h3>
                                <p className="text-gray-600">This will remove all redaction boxes and return to the upload screen.</p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setShowResetConfirm(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRedactions([]);
                                            setFile(null);
                                            setPages([]);
                                            setShowResetConfirm(false);
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center gap-8">
                {pages.map((page, index) => (
                    <div key={index} className="relative w-full">
                        <div className="absolute -left-8 sm:-left-12 top-0 text-xs text-gray-400 font-mono hidden sm:block">
                            Page {index + 1}
                        </div>

                        <div className="flex justify-center">
                            <PageCanvas
                                page={page}
                                pageIndex={index}
                                redactions={redactions}
                                onAddRedaction={addRedaction}
                                onRemoveRedaction={removeRedaction}
                                isPaid={isPaid}
                            />
                        </div>
                    </div>
                ))}

                <div className="h-20" /> {/* Spacer */}
            </div>

            {exporting && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900">Flattening Document</h3>
                            <p className="text-gray-500">Converting to secure images...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
