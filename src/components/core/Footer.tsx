import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="mt-12 py-8 border-t border-gray-100 w-full animate-fade-in">
            <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <Link to="/redact-bank-statement" className="hover:text-gray-900 transition-colors">
                    Redact Bank Statement
                </Link>
                <Link to="/redact-id" className="hover:text-gray-900 transition-colors">
                    Redact ID Document
                </Link>
                <Link to="/redact-visa" className="hover:text-gray-900 transition-colors">
                    Redact Visa
                </Link>
                <Link to="/redact-rental-application" className="hover:text-gray-900 transition-colors">
                    Redact Rental Application
                </Link>
            </div>
        </footer>
    );
}
