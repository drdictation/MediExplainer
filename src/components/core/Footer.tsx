
export function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-gray-100 w-full animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 space-y-4">
                <p>
                    <span className="font-semibold text-gray-700">ExplainMyMedicalReport</span> — Understand your medical reports in plain English.
                </p>
                <div className="flex justify-center gap-6 text-xs text-gray-400">
                    <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
                    <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
                    <a href="/terms" className="hover:text-blue-600 transition-colors">Terms</a>
                </div>
                <p className="text-xs text-gray-400">
                    This tool provides educational explanations only. It does not provide medical advice, diagnosis, or treatment recommendations.
                </p>
            </div>
        </footer>
    );
}
