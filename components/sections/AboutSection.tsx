'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
    return (
        <section id="about" className="min-h-screen flex items-center bg-slate-50 py-20">
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-4xl font-bold mb-12 text-slate-900 text-center">About Our System</h2>

                    <div className="prose prose-slate max-w-none space-y-8 text-lg text-slate-600 leading-relaxed mb-12">
                        <p>
                            The Loan Management System (LMS) is a modern, web-based platform designed to bridge the gap between financial needs and efficient management. Our mission is to provide a transparent, secure, and fast environment for both borrowers and administrators.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose mb-12">
                        <motion.div 
                            initial={{ x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <h3 className="font-bold text-xl mb-4 text-blue-600 flex items-center">
                                <span className="p-2 bg-blue-100 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </span>
                                For Customers
                            </h3>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Quick and easy registration</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Online document submission</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Simple application process</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Real-time status tracking</li>
                            </ul>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ x: 30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
                        >
                            <h3 className="font-bold text-xl mb-4 text-indigo-600 flex items-center">
                                <span className="p-2 bg-indigo-100 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </span>
                                For Administrators
                            </h3>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>Centralized user management</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>Dashboard for loan reviews</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>One-click approve/reject</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>Detailed customer profiles</li>
                            </ul>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="bg-blue-600 text-white p-10 rounded-3xl text-center shadow-lg"
                    >
                        <p className="text-xl italic font-medium">
                            "Transparency and speed are not just features; they are our foundational principles."
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
