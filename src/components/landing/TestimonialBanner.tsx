import { Users, MessageSquareQuote } from 'lucide-react';

export function TestimonialBanner() {
    // Aspirational framing - not direct quotes, but outcomes/value statements
    const outcomes = [
        { text: "Understand what 'ground-glass opacity' actually means", icon: "📖" },
        { text: "Get questions your pulmonologist will appreciate", icon: "❓" },
        { text: "Learn why 95% of small nodules are benign", icon: "✅" },
        { text: "Prepare for your appointment with confidence", icon: "💪" },
    ];

    return (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">
                    Join Patients Preparing for Their Appointments
                </h3>
            </div>

            {/* Social proof counter */}
            <p className="text-center text-sm text-slate-600 mb-6">
                <span className="font-semibold text-blue-700">100+</span> reports explained this month
            </p>

            {/* Outcomes grid */}
            <div className="grid sm:grid-cols-2 gap-3">
                {outcomes.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-50 shadow-sm"
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm text-slate-700 font-medium">{item.text}</span>
                    </div>
                ))}
            </div>

            {/* Aspirational CTA */}
            <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/60 px-4 py-2 rounded-full">
                    <MessageSquareQuote className="w-4 h-4 text-blue-500" />
                    <span>Educational explanations designed for patient-doctor conversations</span>
                </div>
            </div>
        </section>
    );
}
