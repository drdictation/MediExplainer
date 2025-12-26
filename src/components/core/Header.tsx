import { ShieldCheck, Download } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PaywallModal } from '../modals/PaywallModal';

import type { Redaction } from '../../types';

interface HeaderProps {
    onExport?: () => void;
    isPaid?: boolean;
    hasFile?: boolean;
    file?: File | null;
    redactions?: Redaction[];
}

export function Header({ onExport, isPaid, hasFile, file, redactions }: HeaderProps) {
    const [showPaywall, setShowPaywall] = useState(false);

    // Status text logic
    const statusText = isPaid
        ? "Full Access · Session Active"
        : "Preview Mode · Unlock for full explanation";

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">MediExplainer</h1>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-sm text-gray-500">
                            {isPaid ? (
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                    {statusText}
                                </span>
                            ) : (
                                <span>{statusText}</span>
                            )}
                        </div>

                        {/* CTA Rules: 
                            - Unpaid: "Get Full Explanation" -> Opens Paywall
                            - Paid: "Download Summary" -> Calls export
                        */}
                        {!isPaid ? (
                            <button
                                onClick={() => setShowPaywall(true)}
                                className="px-4 py-2 rounded-lg font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                            >
                                Get Full Explanation
                            </button>
                        ) : (
                            // Only show Export PDF if file is loaded
                            hasFile && (
                                <button
                                    onClick={onExport}
                                    className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Download Summary</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </header>

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                file={file || null}
                redactions={redactions || []}
            />
        </>
    );
}
