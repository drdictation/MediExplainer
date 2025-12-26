import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-gray-100 w-full animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
                <p className="mb-2">
                    <span className="font-semibold text-gray-700">MediExplainer</span> — Understand your medical reports in plain English.
                </p>
                <p className="text-xs text-gray-400">
                    This tool provides educational explanations only. It does not provide medical advice, diagnosis, or treatment recommendations.
                </p>
            </div>
        </footer>
    );
}
