import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { saveAppState } from '../../lib/storage';
import type { Redaction } from '../../types';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    file: File | null;
    redactions: Redaction[];
}

export function PaywallModal({ isOpen, onClose, file, redactions }: PaywallModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Unlock Full Medical Explanation?</h2>
                    <p className="text-gray-600 text-lg">
                        Get plain-language summaries, defined medical terms, and questions to ask your doctor.
                        Stop googling and start understanding.
                    </p>
                    <p className="text-sm text-gray-500 pt-2 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Secure Processing: Files are processed securely. We don't sell your data.
                    </p>
                </div>

                <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg text-center font-medium">
                    Note: This tool is for educational purposes only. It is not medical advice.
                </div>

                <button
                    onClick={async () => {
                        setIsLoading(true);
                        try {
                            if (file) {
                                console.log('[PaywallModal] File present, saving state...');
                                await saveAppState({ file, redactions });
                            } else {
                                console.warn('[PaywallModal] No file prop present, skipping save state');
                            }

                            const response = await fetch('/api/create-checkout-session', {
                                method: 'POST',
                            });
                            const { url, error } = await response.json();
                            if (url) {
                                window.location.href = url;
                            } else {
                                throw new Error(error || 'Failed to create checkout session');
                            }
                        } catch (err: any) {
                            console.error(err);
                            alert(err.message || 'Payment service unavailable. Please try again later.');
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Unlock Explanation ($19.99)
                </button>
            </div>
        </div>
    );
}
