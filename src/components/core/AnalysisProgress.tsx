import { CheckCircle, Loader2, Circle } from 'lucide-react';

export type AnalysisStep = 'uploading' | 'extracting' | 'identifying' | 'generating' | 'complete';

interface Props {
    currentStep: AnalysisStep;
    isFullGeneration?: boolean; // If true, show "Generating Full Explanation"
}

const STEPS = [
    { id: 'uploading', label: 'Uploading Document', duration: 'Just a moment...' },
    { id: 'extracting', label: 'Extracting Text', duration: 'Reading your report...' },
    { id: 'identifying', label: 'Identifying Medical Terms', duration: 'Finding key terminology...' },
    { id: 'generating', label: 'Generating Explanation', duration: 'Creating your summary...' },
];

const STEP_ORDER: AnalysisStep[] = ['uploading', 'extracting', 'identifying', 'generating', 'complete'];

export function AnalysisProgress({ currentStep, isFullGeneration }: Props) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    // Calculate progress percentage
    const progress = currentStep === 'complete'
        ? 100
        : Math.min(95, ((currentIndex + 0.5) / (STEPS.length)) * 100);

    return (
        <div className="fixed inset-0 bg-white/95 z-[60] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {isFullGeneration ? 'Generating Full Explanation' : 'Analyzing Your Report'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {STEPS.find(s => s.id === currentStep)?.duration || 'Please wait...'}
                    </p>
                </div>

                {/* Step List */}
                <div className="space-y-3 mb-8">
                    {STEPS.map((step) => {
                        const stepIndex = STEP_ORDER.indexOf(step.id as AnalysisStep);
                        const isComplete = currentIndex > stepIndex;
                        const isCurrent = currentStep === step.id;

                        return (
                            <div
                                key={step.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${isCurrent
                                    ? 'bg-blue-50 border border-blue-200'
                                    : isComplete
                                        ? 'bg-green-50/50'
                                        : 'bg-gray-50'
                                    }`}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    {isComplete ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : isCurrent ? (
                                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300" />
                                    )}
                                </div>

                                {/* Label */}
                                <span className={`font-medium text-sm ${isCurrent
                                    ? 'text-blue-700'
                                    : isComplete
                                        ? 'text-green-700'
                                        : 'text-gray-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400">Processing...</span>
                        <span className="text-xs font-medium text-blue-600">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Privacy Note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    🔒 Your document is processed securely
                </p>
            </div>
        </div>
    );
}
