
import { Helmet } from 'react-helmet-async';
import { AlertTriangle } from 'lucide-react';
import { Header } from '../core/Header';
import { Footer } from '../core/Footer';

export function TermsOfService() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Helmet>
                <title>Terms of Service | ExplainMyMedicalReport</title>
                <meta name="description" content="Terms and conditions for using ExplainMyMedicalReport. Educational use only." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <Header isPaid={false} hasFile={false} />

            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 space-y-12">

                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900">Terms of Service</h1>
                    <p className="text-lg text-slate-600">Last updated: December 29, 2025</p>
                </section>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">

                    {/* CRITICAL DISCLAIMER */}
                    <div className="p-6 bg-red-50 rounded-xl border border-red-100 flex gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-900 mb-2">NOT MEDICAL ADVICE</h3>
                            <p className="text-sm text-red-800 leading-relaxed">
                                ExplainMyMedicalReport is an educational tool powered by Artificial Intelligence.
                                It is <strong>NOT</strong> a substitute for professional medical advice, diagnosis, or treatment.
                                Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                            </p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <h3>1. Educational Purpose Only</h3>
                        <p>
                            By using this service, you acknowledge that the content provided is for checking terminology and understanding report structure only. It is not a diagnostic tool.
                        </p>

                        <h3>2. Limitations of AI</h3>
                        <p>
                            This service uses Large Language Models (AI) to interpret text. AI can make mistakes ("hallucinations").
                            You agree to verify all information provided by this specific tool with the original document and your healthcare provider.
                            The creators of this tool accept no liability for errors or omissions in the explanations provided.
                        </p>

                        <h3>3. User Responsibilities</h3>
                        <ul>
                            <li>You represent that you have the right to upload the documents you submit.</li>
                            <li>You understand that you are responsible for maintaining the confidentiality of your own personal health information.</li>
                            <li>You agree not to use this service for any unlawful purpose.</li>
                        </ul>

                        <h3>4. Refund Policy</h3>
                        <p>
                            Due to the nature of the digital service (immediate consumption of server resources), refunds are generally not provided once a report has been successfully analyzed.
                            However, if the analysis fails or is completely unintelligible, please contact support for a resolution.
                        </p>

                        <h3>5. Changes to Terms</h3>
                        <p>
                            We reserve the right to modify these terms at any time. Continued use of the service constitutes agreement to the new terms.
                        </p>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
