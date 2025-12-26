import { useState } from 'react';
import type { PreviewData, FullExplanation } from '../../lib/explain/types';
import { Lock, FileText, BookOpen, HelpCircle, Activity } from 'lucide-react';

interface Props {
    isPaid: boolean;
    previewData: PreviewData | null;
    fullExplanation: FullExplanation | null;
    onUnlock: () => void;
}

export function ExplanationPanel({ isPaid, previewData, fullExplanation, onUnlock }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'glossary' | 'questions'>('overview');

    if (!previewData && !fullExplanation) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500 text-center">
                <Activity className="w-12 h-12 mb-4 animate-pulse text-blue-500" />
                <h3 className="text-lg font-medium">Analyzing Report...</h3>
                <p className="text-sm">Identifying medical terms and sections</p>
            </div>
        );
    }

    const reportType = fullExplanation?.reportType || previewData?.reportType || 'general';
    const reportTypeLabel = reportType.charAt(0).toUpperCase() + reportType.slice(1) + ' Report';

    const renderTabs = () => (
        <div className="flex border-b border-gray-200">
            {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'sections', label: 'Sections', icon: BookOpen },
                { id: 'glossary', label: 'KV Terms', icon: Activity },
                { id: 'questions', label: 'Ask Doc', icon: HelpCircle },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2
                        ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </div>
    );

    const renderLockedContent = () => (
        <div className="relative">
            {/* Filter Blur Overlay */}
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100">
                    <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Full Explanation</h3>
                    <p className="text-gray-600 mb-6 text-sm">
                        Get plain-language summaries, defined terms, and questions to ask your doctor.
                    </p>
                    <button
                        onClick={onUnlock}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
                    >
                        Unlock for $19.99
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                        One-time payment. Secure processing.
                    </p>
                </div>
            </div>

            {/* Fake Content Background */}
            <div className="space-y-6 opacity-30 pointer-events-none p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="space-y-4 pt-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-24"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPreview = () => (
        <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4" />
                    Detected Content
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                    <li>{previewData?.detectedSections.length || 0} Report Sections Identified</li>
                    <li>{previewData?.detectedTermsCount || 0} Medical Terms Found</li>
                </ul>
            </div>

            {previewData?.previewTerm && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Free Preview Example
                    </div>
                    <div className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h5 className="font-bold text-gray-900 text-lg">{previewData.previewTerm.term}</h5>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                                    {previewData.previewTerm.category}
                                </span>
                            </div>
                        </div>
                        <p className="mt-2 text-gray-600 leading-relaxed">
                            {previewData.previewTerm.definition}
                        </p>
                    </div>
                </div>
            )}

            {renderLockedContent()}
        </div>
    );

    const renderFullContent = () => {
        if (!fullExplanation) return null;

        return (
            <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="prose prose-blue max-w-none">
                            <h3 className="text-xl font-bold text-gray-900">Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{fullExplanation.summary}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'sections' && (
                    <div className="space-y-6">
                        {fullExplanation.sections.map((section, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                                    {section.originalTitle}
                                </h4>
                                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {section.summary}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'glossary' && (
                    <div className="space-y-4">
                        {fullExplanation.glossary.map((term, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-gray-900">{term.term}</span>
                                    <span className="text-xs text-gray-400 capitalize">{term.category}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{term.definition}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800 mb-4">
                            These questions are suggested to help you advocate for yourself. They are not medical advice.
                        </div>
                        {fullExplanation.questions.map((q, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                <h5 className="font-bold text-blue-700 mb-1">"{q.question}"</h5>
                                <p className="text-xs text-gray-500 italic">Context: {q.context}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl w-full max-w-md md:w-[450px]">
            {/* Header with Safety Disclaimer */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {reportTypeLabel}
                    </span>
                    <span className="text-xs text-gray-400">AI Explainer</span>
                </div>
                <p className="text-xs text-gray-500 leading-tight">
                    This tool explains plain language only. <span className="font-semibold text-gray-700">It does not provide medical advice or diagnosis.</span>
                </p>
            </div>

            {/* Content */}
            {isPaid ? (
                <>
                    {renderTabs()}
                    {renderFullContent()}
                </>
            ) : (
                renderPreview()
            )}
        </div>
    );
}
