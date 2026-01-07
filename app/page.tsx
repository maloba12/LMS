import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ContactSection from '@/components/sections/ContactSection';
import FloatingChatWidget from '@/components/FloatingChatWidget';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main>
                <HeroSection />
                <AboutSection />
                <ContactSection />
            </main>

            <FloatingChatWidget />

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100 bg-white relative z-10">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">© 2025 Loan Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
