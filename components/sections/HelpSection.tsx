'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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

export default function HelpSection() {
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
        <section id="help" className="min-h-screen flex items-center bg-slate-50 py-20">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto flex flex-col h-[700px]"
                >
                    <div className="text-center mb-10">
                        <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">Support</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-4">AI Help Assistant</h2>
                        <p className="text-slate-600 mt-2">Get instant answers to your questions.</p>
                    </div>

                    <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            {messages.map((m, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${m.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                            }`}
                                    >
                                        {m.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-6 bg-slate-50 border-t border-slate-100 flex space-x-3">
                            <input
                                type="text"
                                className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm"
                                placeholder="Ask me something..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 transform hover:-translate-y-1 active:translate-y-0"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-2xl text-sm text-blue-800 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Try asking "How do I apply for a loan?"
                        </div>
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 flex items-center shadow-sm">
                            <svg className="w-5 h-5 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             Want a human? <a href="#contact" className="ml-1 text-blue-600 font-bold hover:underline">Contact Us</a>.
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
