'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section id="home" className="min-h-screen pt-20 flex items-center relative overflow-hidden bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center -mx-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0"
                    >
                        <div className="max-w-lg">
                            <h1 className="text-5xl font-bold font-heading mb-6 leading-tight text-slate-900">
                                Smart, Secure <span className="text-blue-600">Loan Management</span> Made Simple
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                The all-in-one platform for effortless loan applications, document processing, and status tracking. Designed for speed, security, and transparency.
                            </p>
                            <div className="flex flex-wrap -mx-2">
                                <div className="w-full sm:w-auto px-2 mb-3 sm:mb-0">
                                    <Link href="/auth/register" className="inline-block w-full py-4 px-8 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl transition duration-200 text-center">
                                        Apply for a Loan
                                    </Link>
                                </div>
                                <div className="w-full sm:w-auto px-2">
                                    <a href="#about" className="inline-block w-full py-4 px-8 text-slate-900 font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl transition duration-200 text-center">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 px-4"
                    >
                        <div className="relative max-w-lg mx-auto">
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-100 rounded-3xl transform rotate-3 -z-10"></div>
                            <div className="bg-white p-8 rounded-3xl shadow-2xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="h-2 w-16 bg-blue-100 rounded-full"></div>
                                    <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                                </div>
                                <div className="space-y-6">
                                    <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
                                    <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
                                    <div className="h-12 w-full bg-blue-50 rounded-xl"></div>
                                    <div className="h-4 w-5/6 bg-slate-100 rounded-full"></div>
                                </div>
                                <div className="mt-10 flex items-center space-x-4">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-full"></div>
                                    <div>
                                        <div className="h-3 w-20 bg-slate-200 rounded-full mb-1"></div>
                                        <div className="h-2 w-32 bg-slate-100 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Features embedded within Hero/Home context for flow */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-24 pt-12 border-t border-slate-100"
                >
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-slate-600">A simplified workflow for modern financial management.</p>
                    </div>
                    <div className="flex flex-wrap -mx-4 justify-center">
                        {[
                            { title: 'Customer Onboarding', desc: 'Fast and secure registration.' },
                            { title: 'Online Application', desc: 'Apply directly from dashboard.' },
                            { title: 'Status Tracking', desc: 'Real-time updates.' },
                        ].map((feature, i) => (
                            <div key={feature.title} className="w-full md:w-1/3 px-4 mb-8">
                                <div className="bg-slate-50 p-6 rounded-2xl h-full border border-slate-100">
                                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
