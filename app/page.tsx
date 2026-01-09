'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import Lenders from '@/components/sections/Lenders';
import Services from '@/components/sections/Services';
import Stats from '@/components/sections/Stats';
import HowItWorks from '@/components/sections/HowItWorks';
import Trust from '@/components/sections/Trust';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';
import FloatingChatWidget from '@/components/FloatingChatWidget';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loanType, setLoanType] = useState('All');

    return (
        <div className="min-h-screen bg-white transition-colors duration-300">
            <Navbar />
            
            <main>
                <Hero 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    loanType={loanType}
                    setLoanType={setLoanType}
                />
                <Features />
                <Lenders searchQuery={searchQuery} loanType={loanType} />
                <Services />
                <Stats />
                <HowItWorks />
                <Trust />
                <FAQ />
            </main>

            <Footer />
            <FloatingChatWidget />
        </div>
    );
}
