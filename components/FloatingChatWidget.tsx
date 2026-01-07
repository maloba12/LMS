'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    text: string;
    sender: 'ai' | 'user';
}

const FAQ_RESPONSES: Record<string, string> = {
    'how to apply': 'Applying for a loan is easy! First, ensure you have uploaded your CV in the "Upload CV" section of your dashboard. Then, head over to "Apply for a Loan", fill in the amount and purpose, and submit.',
    'apply for a loan': 'Applying for a loan is easy! First, ensure you have uploaded your CV in the "Upload CV" section of your dashboard. Then, head over to "Apply for a Loan", fill in the amount and purpose, and submit.',
    'how to upload a cv': 'To upload your CV, log in to your dashboard and look for the "Upload CV" button. We support PDF and Word documents up to 5MB.',
    'upload cv': 'To upload your CV, log in to your dashboard and look for the "Upload CV" button. We support PDF and Word documents up to 5MB.',
    'how to check loan status': 'You can track your application in real-time on your Customer Dashboard. The status will update from PENDING to APPROVED or REJECTED once a system admin reviews it.',
    'check status': 'You can track your application in real-time on your Customer Dashboard. The status will update from PENDING to APPROVED or REJECTED once a system admin reviews it.',
    'login issues': 'If you are having trouble logging in, please check your credentials. If the problem persists, ensure your account is registered. For further help, use our Contact Support page.',
    'access issues': 'If you are having trouble logging in, please check your credentials. If the problem persists, ensure your account is registered. For further help, use our Contact Support page.',
    'hello': 'Hello! I am your LMS Assistant. I can help you with questions about loan applications, CV uploads, and status tracking. How can I assist you?',
    'hi': 'Hi! I am your LMS Assistant. I can help you with questions about loan applications, CV uploads, and status tracking. How can I assist you?',
    'help': 'I can assist you with: \n1. How to apply for a loan\n2. How to upload a CV\n3. Checking loan status\n4. Login and access issues.',
};

export default function FloatingChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! Need help with your loan application?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInput('');

        // AI Response logic
        setTimeout(() => {
            const lowerMessage = userMessage.toLowerCase();
            let response = "I apologize, but I don't have the answer to that specific question right now. However, our support team would be happy to assist you! Please reach out to our customer care at support@lms-example.com or call +1 (555) 000-0000 for immediate assistance.";

            for (const [key, val] of Object.entries(FAQ_RESPONSES)) {
                if (lowerMessage.includes(key)) {
                    response = val;
                    break;
                }
            }

            setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
        }, 600);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white w-[350px] h-[500px] mb-4 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                            <h3 className="font-bold flex items-center">
                                <span className="p-1.5 bg-white/20 rounded-lg mr-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </span>
                                LMS Assistant
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-3">
                            {messages.map((m, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 text-sm rounded-2xl ${
                                            m.sender === 'user'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="Type a message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                layoutId="chat-button"
                className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
                    isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-blue-600 text-white hover:scale-105 hover:bg-blue-700'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </motion.button>
        </div>
    );
}
