
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Lock } from 'lucide-react';
import { Header } from '../core/Header';
import { Footer } from '../core/Footer';

export function PrivacyPolicy() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Helmet>
                <title>Privacy Policy | ExplainMyMedicalReport</title>
                <meta name="description" content="Our commitment to your privacy. We process files transiently and do not store your medical data." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Header isPaid={false} hasFile={false} />

            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 space-y-12">

                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
                    <p className="text-lg text-slate-600">Last updated: December 29, 2025</p>
                </section>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">

                    {/* Key Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">No Server Storage</h3>
                            </div>
                            <p className="text-sm text-blue-800">
                                Your medical reports are processed transiently. We do not save, store, or archive your uploaded files on our servers.
                            </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2 mb-2">
                                <Lock className="w-5 h-5 text-green-600" />
                                <h3 className="font-semibold text-green-900">Encrypted Processing</h3>
                            </div>
                            <p className="text-sm text-green-800">
                                Data sent to our AI partners for analysis is transmitted via secure, encrypted channels (HTTPS/TLS).
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3>1. How We Handle Your Data</h3>
                        <p>
                            ExplainMyMedicalReport operates on a "Privacy-First" architecture. When you upload a PDF or text:
                        </p>
                        <ul>
                            <li><strong>Extraction:</strong> Text extraction happens in your browser whenever possible.</li>
                            <li><strong>Analysis:</strong> To generate the explanation, the extracted text is sent to our AI provider (Google Gemini or OpenAI) securely.</li>
                            <li><strong>Deletion:</strong> Once the explanation is generated, the data is discarded. We do not maintain a database of user health records.</li>
                        </ul>

                        <h3>2. Analytics & Tracking</h3>
                        <p>
                            We use anonymized analytics (like Google Analytics) to improve our service.
                        </p>
                        <ul>
                            <li><strong>What we track:</strong> Page views, button clicks, broad error rates, and successful payment confirmations.</li>
                            <li><strong>What we DO NOT track:</strong> We do not track or record specific medical conditions, diagnosis contents, or personal health information (PHI) in our analytics system.</li>
                        </ul>

                        <h3>3. Payments</h3>
                        <p>
                            Payments are processed securely by Stripe. We never see or store your credit card information. Stripe provides us with a transaction confirmation code only.
                        </p>

                        <h3>4. Third-Party Services</h3>
                        <p>
                            We utilize the following trusted third-party services:
                        </p>
                        <ul>
                            <li><strong>Stripe:</strong> Payment processing.</li>
                            <li><strong>Google Gemini / OpenAI:</strong> Large Language Model for text analysis.</li>
                            <li><strong>Vercel:</strong> Web hosting and serverless functions.</li>
                        </ul>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
