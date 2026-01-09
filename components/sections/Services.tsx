'use client';

import Image from 'next/image';
import Link from 'next/link';

const Services = () => {
    const benefits = [
        '100% Digital application process',
        'No hidden fees or charges',
        'Competitive and transparent rates',
        'Secure 256-bit data encryption',
        'Personalized loan recommendations'
    ];

    return (
        <section id="services" className="py-32 bg-slate-50 dark:bg-slate-800/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left: Image */}
                    <div className="flex-1 relative order-2 lg:order-1">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-600/10 border-8 border-white dark:border-slate-800 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Image 
                                src="/images/mobile-banking.png"
                                alt="Digital Loan Management"
                                width={600}
                                height={600}
                                className="w-full h-auto"
                            />
                        </div>
                        {/* Decorative blob */}
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl z-0"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl z-0"></div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 order-1 lg:order-2">
                        <h2 className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Our Services</h2>
                        <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                            Digital Lending <span className="text-blue-600">Reimagined.</span>
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                            Experience the future of finance with our state-of-the-art loan management system. 
                            We've simplified every step to give you the most seamless experience possible.
                        </p>

                        <ul className="space-y-6 mb-12">
                            {benefits.map((benefit, idx) => (
                                <li key={idx} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-black text-lg">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-6">
                            <Link 
                                href="/auth/register"
                                className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-xl shadow-blue-600/20"
                            >
                                Start Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
