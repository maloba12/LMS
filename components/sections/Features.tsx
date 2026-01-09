'use client';

import Image from 'next/image';

const Features = () => {
    const features = [
        {
            title: 'Fast loan approval',
            description: 'Get your loan approved within minutes, not days. Our automated system ensures rapid processing.',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            image: null
        },
        {
            title: 'Secure user data',
            description: 'Your financial and personal information is protected with bank-grade encryption and security protocols.',
            icon: (
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            image: '/images/secure-shield.png'
        },
        {
            title: 'Flexible repayment',
            description: 'Choose from various repayment plans tailored to your financial situation and goals.',
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            image: null
        },
        {
            title: 'Real-time tracking',
            description: 'Stay updated on your loan application and status with real-time notifications and tracking.',
            icon: (
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            image: null
        }
    ];

    return (
        <section id="features" className="py-32 bg-slate-50 dark:bg-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Features</h2>
                    <p className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Everything you need for <span className="text-blue-600">Smart Lending.</span>
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        We've built a platform that prioritizes speed, security, and flexibility for all your financial needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div 
                            key={idx} 
                            className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-800 transform hover:-translate-y-2"
                        >
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-300">
                                <div className="group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                                {feature.description}
                            </p>
                            
                            {feature.image && (
                                <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 overflow-hidden">
                                    <Image 
                                        src={feature.image}
                                        alt={feature.title}
                                        width={200}
                                        height={200}
                                        className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500 rounded-xl"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
