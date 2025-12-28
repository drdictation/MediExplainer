import { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, X } from 'lucide-react';

interface Props {
    onClose: () => void;
    onEmailClick: () => void;
    onDownloadClick: () => void;
}

export function SuccessOverlay({ onClose, onEmailClick, onDownloadClick }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [countdown, setCountdown] = useState(10);

    // Animate in
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Auto-dismiss countdown
    useEffect(() => {
        if (countdown <= 0) {
            onClose();
            return;
        }
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'
                }`}
            onClick={handleClose}
        >
            <div
                className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Success Icon with Animation */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Successful! 🎉
                    </h2>
                    <p className="text-gray-600">
                        Your full medical report explanation is ready.
                    </p>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                    <button
                        onClick={() => { onEmailClick(); handleClose(); }}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Mail className="w-5 h-5" />
                        Email This Explanation to Me
                    </button>

                    <button
                        onClick={() => { onDownloadClick(); handleClose(); }}
                        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 font-semibold rounded-xl transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Download PDF
                    </button>
                </div>

                {/* Continue link */}
                <button
                    onClick={handleClose}
                    className="w-full mt-6 text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    Continue to Results ({countdown}s)
                </button>

                {/* Trust badge */}
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        ✓ Secure Payment via Stripe • 🔒 Your data is private
                    </p>
                </div>
            </div>
        </div>
    );
}
