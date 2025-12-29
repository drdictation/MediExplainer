import { useState, useEffect, useRef } from 'react';
import { X, Trash2, Bug } from 'lucide-react';

interface LogEntry {
    type: 'log' | 'warn' | 'error';
    message: string;
    timestamp: string;
}

export function ConsoleOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Safe binding to avoid infinite loops if console is used inside render
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const addLog = (type: 'log' | 'warn' | 'error', args: any[]) => {
            const message = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');

            setLogs(prev => [...prev.slice(-49), { // Keep last 50 logs
                type,
                message,
                timestamp: new Date().toLocaleTimeString()
            }]);
        };

        console.log = (...args) => {
            originalLog(...args);
            addLog('log', args);
        };

        console.warn = (...args) => {
            originalWarn(...args);
            addLog('warn', args);
        };

        console.error = (...args) => {
            originalError(...args);
            addLog('error', args);
        };

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (isOpen && bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isOpen]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-[9999] bg-black/80 text-white p-3 rounded-full shadow-lg hover:bg-black transition-all"
            >
                <Bug className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="fixed inset-x-0 bottom-0 h-[50vh] bg-black/90 text-green-400 font-mono text-xs z-[9999] flex flex-col shadow-2xl border-t border-gray-700">
            <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-800">
                <span className="font-bold text-gray-400">Debug Console</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLogs([])}
                        className="p-1 hover:text-white"
                        title="Clear logs"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:text-white"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {logs.length === 0 && (
                    <div className="text-gray-600 italic">No logs yet...</div>
                )}
                {logs.map((log, i) => (
                    <div key={i} className={`
                        break-words border-l-2 pl-2
                        ${log.type === 'error' ? 'border-red-500 text-red-400' : ''}
                        ${log.type === 'warn' ? 'border-yellow-500 text-yellow-400' : 'border-transparent'}
                    `}>
                        <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                        {log.message}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
