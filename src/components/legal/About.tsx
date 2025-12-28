
import { Helmet } from 'react-helmet-async';
import { Heart, Activity, Brain } from 'lucide-react';
import { Header } from '../core/Header';
import { Footer } from '../core/Footer';

export function About() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Helmet>
                <title>About Us | ExplainMyMedicalReport</title>
                <meta name="description" content="Our mission is to make medical reports accessible and understandable for everyone." />
            </Helmet>

            <Header isPaid={false} hasFile={false} />

            <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 space-y-12">

                <section className="text-center space-y-6">
                    <h1 className="text-4xl font-extrabold text-slate-900">Demystifying Medical Jargon.</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        We believe you shouldn't need a medical degree to understand what your own body is doing.
                    </p>
                </section>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-12">

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">The Problem</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Every day, millions of patients receive lab results, radiology reports, and discharge summaries written in complex medical language.
                            Typically, patients have to wait days or weeks for a follow-up appointment to navigate this anxiety-inducing information.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Instant Clarity</h3>
                            <p className="text-sm text-slate-500">No more late-night Googling. Get instant definitions in context.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900">AI Powered</h3>
                            <p className="text-sm text-slate-500">Using advanced LLMs to break down complex sentences into plain English.</p>
                        </div>
                        <div className="space-y-3">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <Heart className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="font-semibold text-slate-900">Empathy First</h3>
                            <p className="text-sm text-slate-500">Designed to reduce anxiety, not increase it.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">Our Promise</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We are committed to privacy and accuracy. We use state-of-the-art AI, but we always remind users that **AI is a tool, not a doctor.**
                            Our goal is to arm you with better questions to ask your healthcare provider, not to replace them.
                        </p>
                    </div>

                </div>

            </main>

            <Footer />
        </div>
    );
}
