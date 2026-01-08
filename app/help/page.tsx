'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface Message {
    text: string;
    sender: 'ai' | 'user';
}

const FAQ_RESPONSES: Record<string, string> = {
    'how to apply': 'Applying for a loan is easy! First, ensure you have uploaded your Payslip in the "Upload Payslip" section of your dashboard. Then, head over to "Apply for a Loan", fill in the amount and purpose, and submit.',
    'apply for a loan': 'Applying for a loan is easy! First, ensure you have uploaded your Payslip in the "Upload Payslip" section of your dashboard. Then, head over to "Apply for a Loan", fill in the amount and purpose, and submit.',
    'how to upload a payslip': 'To upload your Payslip, log in to your dashboard and look for the "Upload Payslip" button. We support PDF, JPG, and PNG documents up to 5MB.',
    'upload payslip': 'To upload your Payslip, log in to your dashboard and look for the "Upload Payslip" button. We support PDF, JPG, and PNG documents up to 5MB.',
    'how to check loan status': 'You can track your application in real-time on your Customer Dashboard. The status will update from PENDING to APPROVED or REJECTED once a system admin reviews it.',
    'check status': 'You can track your application in real-time on your Customer Dashboard. The status will update from PENDING to APPROVED or REJECTED once a system admin reviews it.',
    'login issues': 'If you are having trouble logging in, please check your credentials. If the problem persists, ensure your account is registered. For further help, use our Contact Support page.',
    'access issues': 'If you are having trouble logging in, please check your credentials. If the problem persists, ensure your account is registered. For further help, use our Contact Support page.',
    'hello': 'Hello! I am your LMS Assistant. I can help you with questions about loan applications, Payslip uploads, and status tracking. How can I assist you?',
    'hi': 'Hi! I am your LMS Assistant. I can help you with questions about loan applications, Payslip uploads, and status tracking. How can I assist you?',
    'help': 'I can assist you with: \n1. How to apply for a loan\n2. How to upload a Payslip\n3. Checking loan status\n4. Login and access issues.',
};

export default function HelpPage() {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I'm your LMS Assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
        setInput('');

        // AI Response logic
        setTimeout(() => {
            const lowerMessage = userMessage.toLowerCase();
            let response = "I'm sorry, I don't quite understand that yet. You can ask about applying for loans, uploading documents, or checking your application status.";

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
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-4xl w-full mx-auto py-10 px-4 flex flex-col">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">AI Help Assistant</h1>

                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[500px]">
                        {messages.map((m, idx) => (
                            <div
                                key={idx}
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-2xl ${m.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-100 flex space-x-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="Ask me something..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
                        <strong>Pro Tip:</strong> Try asking "How do I apply for a loan?" or "Where do I upload my Payslip?"
                    </div>
                    <div className="p-4 bg-slate-100 rounded-xl text-sm text-slate-800">
                        <strong>Need a human?</strong> Visit our <a href="/contact" className="text-blue-600 font-bold hover:underline">Contact Page</a>.
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-slate-400 text-xs">
                © 2025 Loan Management System. AI experimental module.
            </footer>
        </div>
    );
}
