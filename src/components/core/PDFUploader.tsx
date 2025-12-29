import { useState, useCallback } from 'react';
import { convertImageToPDF } from '../../lib/pdf-engine';
import { Camera, FileWarning, Loader2, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import { track } from '../../lib/analytics';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface PDFUploaderProps {
    onFileSelect: (file: File) => void;
    isProcessing?: boolean;
    ctaText?: string;
}

export function PDFUploader({ onFileSelect, isProcessing = false, ctaText = 'Select PDF to Redact' }: PDFUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const validateFile = (file: File): string | null => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            return 'Please upload a valid PDF or Image (JPG/PNG).';
        }
        if (file.size > MAX_SIZE_BYTES) {
            return `File size exceeds ${MAX_SIZE_MB}MB limit.`;
        }
        return null;
    };

    const handleFile = async (file: File) => {
        const errorMsg = validateFile(file);
        if (errorMsg) {
            setError(errorMsg);
            return;
        }
        setError(null);

        // If it's an image, convert to PDF first
        if (file.type.startsWith('image/')) {
            setIsConverting(true);
            try {
                const pdfFile = await convertImageToPDF(file);
                onFileSelect(pdfFile);
            } catch (err: any) {
                console.error('Image conversion failed:', err);
                setError('Failed to process image. Please try a PDF.');
            } finally {
                setIsConverting(false);
            }
        } else {
            onFileSelect(file);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (isProcessing || isConverting) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [isProcessing, isConverting]);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!isProcessing && !isConverting) {
            setIsDragging(true);
        }
    }, [isProcessing, isConverting]);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const isBusy = isProcessing || isConverting;

    return (
        <div className="w-full max-w-xl mx-auto space-y-4">
            <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 sm:p-12 transition-all duration-200 ease-in-out text-center cursor-pointer",
                    isDragging ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50",
                    isBusy && "opacity-50 cursor-not-allowed pointer-events-none",
                    error && "border-red-300 bg-red-50/30"
                )}
            >
                <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={onInputChange}
                    onClick={() => track('click_upload_cta', { source: 'uploader_dropzone' })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isBusy}
                    capture="environment" // Triggers camera on mobile
                />

                <div className="flex flex-col items-center gap-4">
                    {/* Trust Badge */}
                    <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100 flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium text-green-700">Private Processing • No Data Stored</span>
                    </div>

                    <div className={cn(
                        "p-4 rounded-full transition-colors",
                        error ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
                    )}>
                        {isBusy ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : error ? (
                            <FileWarning className="w-8 h-8" />
                        ) : (
                            <div className="relative">
                                <Upload className="w-8 h-8" />
                                <Camera className="w-4 h-4 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {isConverting ? 'Processing Image...' : isProcessing ? 'Analyzing Document...' : ctaText}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            {error || "Upload PDF or Take a Clear Photo"}
                        </p>
                    </div>

                    {!error && !isBusy && (
                        <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-md">
                            💡 Tip: Ensure good lighting if taking a photo
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
