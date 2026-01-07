import { Upload, Cpu, Trash2, ArrowRight } from 'lucide-react';

export function HowDataProtected() {
    const steps = [
        {
            icon: Upload,
            title: 'Upload',
            subtitle: 'Encrypted in transit',
            description: 'Your report is securely transmitted using bank-level TLS encryption.',
            color: 'blue',
        },
        {
            icon: Cpu,
            title: 'Process',
            subtitle: 'AI reads text only',
            description: 'We extract text for analysis. No images or metadata are stored.',
            color: 'indigo',
        },
        {
            icon: Trash2,
            title: 'Delete',
            subtitle: 'Auto-erased',
            description: 'Your data is permanently deleted immediately after processing.',
            color: 'emerald',
        },
    ];

    const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
        blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
        indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-100' },
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    };

    return (
        <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                🔐 How Your Data is Protected
            </h3>
            <p className="text-sm text-slate-500 text-center mb-8 max-w-xl mx-auto">
                We don't see it. We don't keep it. We can't share it.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2">
                {steps.map((step, idx) => {
                    const colors = colorMap[step.color];
                    return (
                        <div key={idx} className="flex items-center gap-2 sm:gap-4">
                            <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 sm:p-5 text-center w-full sm:w-44 transition-transform hover:scale-105`}>
                                <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                                    <step.icon className={`w-6 h-6 ${colors.icon}`} />
                                </div>
                                <div className="font-bold text-slate-900 text-lg">{step.title}</div>
                                <div className={`text-xs font-medium ${colors.icon} mb-2`}>{step.subtitle}</div>
                                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                            </div>
                            {idx < steps.length - 1 && (
                                <ArrowRight className="hidden sm:block w-5 h-5 text-slate-300 flex-shrink-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Extra reassurance */}
            <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                    No human ever sees your report. Processing completes in seconds via secure AI, then all data is permanently purged.
                </p>
            </div>
        </section>
    );
}
