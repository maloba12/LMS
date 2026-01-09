'use client';

import { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How long does the loan approval process take?",
            answer: "Most applications are processed within 15-30 minutes. Once approved, funds are typically disbursed to your bank account within 24 hours."
        },
        {
            question: "What documents do I need to apply?",
            answer: "You typically need a valid ID, proof of income (like a payslip or bank statement), and a bank account in your name. Requirements may vary by lender."
        },
        {
            question: "Does checking my eligibility affect my credit score?",
            answer: "No, checking your initial eligibility on SmartLoan uses a 'soft pull' which does not impact your credit score at all."
        },
        {
            question: "Can I repay my loan earlier than scheduled?",
            answer: "Yes! Most of our lending partners allow for early repayment without any additional penalties. In fact, it might save you on interest."
        }
    ];

    return (
        <section className="py-32 bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Support</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Common Questions.
                    </h3>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div 
                            key={idx}
                            className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                                openIndex === idx 
                                ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' 
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800'
                            }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full px-8 py-8 flex items-center justify-between text-left"
                            >
                                <span className={`text-xl font-black transition-colors ${
                                    openIndex === idx ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'
                                }`}>
                                    {faq.question}
                                </span>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    openIndex === idx ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                }`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            
                            <div className={`px-8 transition-all duration-300 ease-in-out ${
                                openIndex === idx ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'
                            }`}>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
