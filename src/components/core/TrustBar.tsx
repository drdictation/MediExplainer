import { Shield, Trash2, UserX, Clock } from 'lucide-react';

interface TrustBarProps {
    variant?: 'banner' | 'inline';
}

export function TrustBar({ variant = 'banner' }: TrustBarProps) {
    const items = [
        { icon: Shield, text: 'Bank-Level Encryption' },
        { icon: Trash2, text: 'Deleted After Processing' },
        { icon: UserX, text: 'No Account Required' },
        { icon: Clock, text: 'Instant Results' },
    ];

    if (variant === 'inline') {
        return (
            <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-slate-600">
                {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                        <item.icon className="w-4 h-4 text-green-600" />
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                            <item.icon className="w-4 h-4" />
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
