
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import type { RouteConfig } from '../../lib/landingCopy';
import { PDFUploader } from '../core/PDFUploader';
import { Header } from '../core/Header';
import { Footer } from '../core/Footer';
import { TrustBar } from '../core/TrustBar';
import { HowDataProtected } from './HowDataProtected';
import { TestimonialBanner } from './TestimonialBanner';
import { AlertCircle, HelpCircle, FileText, ShieldCheck, ArrowRight, BookOpen, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackOnce } from '../../lib/analytics';

interface LandingPageTemplateProps {
    config: RouteConfig;
    onFileSelect: (file: File) => void;
    isProcessing?: boolean;
}

export function LandingPageTemplate({ config, onFileSelect, isProcessing }: LandingPageTemplateProps) {
    // Analytics: Track Page View
    useEffect(() => {
        trackOnce(`view_${config.path}`, 'view_landing_page', {
            page_name: config.path.replace('/', '') || 'home',
            page_path: config.path
        });
    }, [config.path]);

    // Schema Generator
    const generateSchema = () => {
        const schema = [
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": `${window.location.origin}/`
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": config.h1,
                        "item": `${window.location.origin}${config.path}`
                    }
                ]
            }
        ];

        if (config.faq && config.faq.length > 0) {
            schema.push({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": config.faq.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            } as any);
        }

        return JSON.stringify(schema);
    };

    const hasExtendedContent = !!config.definition;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
            <Helmet>
                <script type="application/ld+json">{generateSchema()}</script>
                <title>{config.metaTitle}</title>
                <meta name="description" content={config.metaDescription} />
                <link rel="canonical" href={`${window.location.origin}${config.path === '/' ? '' : config.path}`} />
                <meta property="og:title" content={config.metaTitle} />
                <meta property="og:description" content={config.metaDescription} />
                <meta property="og:url" content={`${window.location.origin}${config.path}`} />
            </Helmet>

            <Header isPaid={false} hasFile={false} />

            {/* NEW: Trust Bar - Aggressive Privacy Messaging */}
            <TrustBar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">

                {/* 1. H1 & Hook (Hero) */}
                <section className="text-center space-y-6">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {config.h1}
                    </h1>

                    {/* Ads Hook Subhead - The "Why it matters" differentiation */}
                    <p className="text-xl sm:text-2xl text-blue-900 font-bold max-w-3xl mx-auto leading-snug">
                        {config.subhead}
                    </p>

                    {/* Context Paragraph */}
                    {config.summary && (
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            {config.summary}
                        </p>
                    )}

                    {/* Trust Signals - Moved closer to CTA */}
                    <div className="flex justify-center pt-2 pb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 rounded-full border border-green-200 text-xs sm:text-sm text-green-800 font-medium">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            {config.trustBadge || config.trustSignals || "Private & Educational Only"}
                        </div>
                    </div>
                </section>

                {/* CTA - Primary Action */}
                <section className="scroll-mt-20 -mt-8" id="upload">
                    {/* Intro Offer Banner */}
                    {(config.offerBanner || true) && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-t-2xl max-w-3xl mx-auto text-center shadow-lg">
                            <div className="flex items-center justify-center gap-2 flex-wrap font-bold">
                                {config.offerBanner ? (
                                    <span>{config.offerBanner}</span>
                                ) : (
                                    <>
                                        <span className="text-sm">🎉 Launch Offer:</span>
                                        <span className="text-white/80 line-through text-sm">$19.99</span>
                                        <span className="text-xl">$9.99</span>
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Limited Time</span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="bg-white rounded-b-2xl shadow-xl border border-slate-200 border-t-0 overflow-hidden max-w-3xl mx-auto">
                        <div className="p-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-100" />
                        <div className="p-6 sm:p-8 text-center space-y-6">
                            <h2 className="text-lg font-semibold text-slate-900 hidden sm:block">
                                Upload your report to get a full explanation
                            </h2>
                            <PDFUploader onFileSelect={onFileSelect} isProcessing={isProcessing} ctaText={config.ctaText} />

                            {/* Hero Microcopy */}
                            {config.heroMicrocopy ? (
                                <div className="space-y-3 pt-2">
                                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                                        {config.heroMicrocopy}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center justify-center gap-2">
                                        <span>📁 PDF or photo accepted</span>
                                        <span>•</span>
                                        <span>🔒 Secure Private Processing</span>
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 mt-2">
                                    Free preview generated instantly. Full explanation available for purchase.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* NEW: How Your Data is Protected */}
                <HowDataProtected />

                {/* NEW: Testimonial/Social Proof Banner */}
                <TestimonialBanner />

                {/* NEW: Value Preview Grid (What You'll Get) */}
                {config.previewGrid && (
                    <section className="max-w-4xl mx-auto">
                        <div className="grid sm:grid-cols-3 gap-6">
                            {config.previewGrid.map((item, idx) => {
                                const Icon = item.icon === 'file' ? FileText : item.icon === 'book' ? BookOpen : HelpCircle;
                                return (
                                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {hasExtendedContent && (
                    <>
                        {/* 3. What the term means */}
                        <section className="prose prose-blue max-w-none bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                                <FileText className="w-6 h-6 text-blue-600" />
                                What does this mean?
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: config.definition || '' }} />
                        </section>

                        {/* 4. Why it appears (Context) */}
                        <section className="prose prose-blue max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900">Why does this appear in reports?</h2>
                            <div dangerouslySetInnerHTML={{ __html: config.whyItAppears || '' }} />
                        </section>

                        {/* 5. What it does NOT mean */}
                        <section className="bg-amber-50 p-6 sm:p-8 rounded-2xl border border-amber-100 prose prose-amber max-w-none">
                            <h2 className="flex items-center gap-3 text-2xl font-bold text-amber-900 m-0 mb-4">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                                What this does NOT automatically mean
                            </h2>
                            <div className="text-amber-900" dangerouslySetInnerHTML={{ __html: config.whatItDoesNotMean || '' }} />
                        </section>

                        {/* 6. Report Wording */}
                        <section className="prose prose-blue max-w-none">
                            <h2 className="text-2xl font-bold text-slate-900">Report wording that changes the meaning</h2>
                            <div dangerouslySetInnerHTML={{ __html: config.reportWording || '' }} />
                        </section>

                        {/* 7. Questions to ask doctor */}
                        <section className="bg-indigo-50 p-6 sm:p-8 rounded-2xl border border-indigo-100 relative overflow-hidden">
                            {/* Header */}
                            <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-3">
                                <HelpCircle className="w-6 h-6 text-indigo-600" />
                                Questions to ask your doctor
                            </h2>

                            {config.questionsTeaser ? (
                                // Format: New Teaser (Visual/Blurred)
                                <div className="space-y-4">
                                    {/* Visible Questions */}
                                    {config.questionsTeaser.visible.map((q, i) => (
                                        <div key={`v-${i}`} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm text-indigo-900 border border-indigo-50">
                                            <div className="min-w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">
                                                {i + 1}
                                            </div>
                                            <span className="font-medium">{q}</span>
                                        </div>
                                    ))}

                                    {/* Blurred Questions Container */}
                                    <div className="relative">
                                        {/* The Content to Blur */}
                                        <div className="space-y-4 filter blur-sm opacity-60 select-none pointer-events-none" aria-hidden="true">
                                            {config.questionsTeaser.blurred.map((q, i) => (
                                                <div key={`b-${i}`} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm text-indigo-900">
                                                    <div className="min-w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">
                                                        {config.questionsTeaser!.visible.length + i + 1}
                                                    </div>
                                                    <span>{q}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Overlay Check/Lock */}
                                        <div className="absolute inset-0 z-10 flex items-center justify-center">
                                            <button
                                                onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                                                className="group flex flex-col items-center gap-3 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-indigo-100 hover:scale-105 transition-transform"
                                            >
                                                <div className="p-3 bg-amber-100 rounded-full text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                                    <Lock className="w-6 h-6" />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <div className="font-bold text-slate-900">
                                                        {config.questionsTeaser.unlockCta}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Included in Full Explanation ($9.99)
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Legacy Format
                                <ul className="space-y-3">
                                    {config.questions?.map((q, i) => (
                                        <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm text-indigo-900">
                                            <div className="min-w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">
                                                {i + 1}
                                            </div>
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </>
                )}

                {!hasExtendedContent && (
                    // Fallback for existing pages (Why This Matters grid)
                    <div className="grid sm:grid-cols-3 gap-8">
                        {config.whyThisMatters.map((bullet, idx) => (
                            <div key={idx} className="space-y-2 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <div className="font-semibold text-slate-900 text-lg">{bullet.title}</div>
                                <p className="text-base text-slate-500 leading-relaxed">{bullet.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* 8. Second CTA */}
                <section className="text-center py-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Ready to understand your full report?</h2>
                    <button
                        onClick={() => document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-200"
                    >
                        Upload Report to Start
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-slate-500 text-sm mt-4">{config.disclaimer}</p>
                </section>

                {/* 9. Privacy & Safety */}
                <section className="border-t border-slate-200 pt-12 text-center text-slate-500">
                    <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Privacy & Safety</h3>
                    <p className="max-w-2xl mx-auto text-sm leading-relaxed">
                        We use secure, private processing. Your medical data is not stored permanently.
                        This content is for educational purposes only and does not constitute medical advice, diagnosis, or treatment.
                        Always consult with your healthcare provider for interpretation of your specific results.
                    </p>
                </section>

                {/* 10. Related Topics */}
                {config.relatedTopics && config.relatedTopics.length > 0 && (
                    <section className="border-t border-slate-200 pt-12">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Related Topics</h3>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {config.relatedTopics.map((topic, i) => (
                                <Link
                                    key={i}
                                    to={topic.path}
                                    className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-slate-700 font-medium text-sm flex items-center justify-between group"
                                >
                                    {topic.title}
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* FAQ Schema Visual Render (Optional, usually strict bottom of page) */}
                {config.faq && config.faq.length > 0 && (
                    <section className="border-t border-slate-200 pt-12">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {config.faq.map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-100">
                                    <h4 className="font-semibold text-slate-900 mb-2">{item.question}</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>

            <Footer />
        </div>
    );
}
