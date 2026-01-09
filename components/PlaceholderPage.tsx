'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/sections/Footer';

interface PlaceholderProps {
    title: string;
}

export default function PlaceholderPage({ title }: PlaceholderProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="max-w-3xl">
                    <h1 className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-tight">
                        {title}
                    </h1>
                    <div className="w-20 h-2 bg-blue-600 mb-12 rounded-full"></div>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-12">
                        We are currently crafting a premium experience for our <span className="text-blue-600 dark:text-blue-400">{title}</span> page. 
                        As part of our commitment to transparency and excellence, we are updating this section with real Zambian regulatory details and comprehensive information.
                    </p>
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="flex h-3 w-3 rounded-full bg-blue-600 animate-pulse"></span>
                            Coming Soon
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Full registration details, policies, and career opportunities will be available here shortly. 
                            Thank you for your patience as we build Zambia's leading digital loan marketplace.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
