'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState('home');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/#home', id: 'home' },
        { name: 'Services', href: '/#services', id: 'services' },
        { name: 'How It Works', href: '/#how-it-works', id: 'how-it-works' },
        { name: 'Trust', href: '/#trust', id: 'trust' },
        { name: 'Contact', href: '/contact', id: 'contact' },
    ];

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Handle scroll spy to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = navLinks.map(link => document.getElementById(link.id));
            
            for (const section of sections) {
                if (!section) continue;
                const rect = section.getBoundingClientRect();
                if (rect.top >= -100 && rect.top <= 300) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
        if (!href.includes('#')) return;
        
        const [path, targetId] = href.split('#');
        
        // If we are on the same page (or path is empty/root and we are on root)
        if (pathname === path || (path === '/' && pathname === '/') || path === '') {
            const elem = document.getElementById(targetId);
            if (elem) {
                e.preventDefault();
                elem.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer group">
                            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                Smart<span className="text-blue-600">Loan</span>
                            </span>
                        </Link>
                        <div className="hidden md:ml-12 md:flex md:space-x-10">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleScrollClick(e, link.href)}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-bold transition-all duration-200 ${
                                        activeSection === link.id
                                            ? 'text-blue-600'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>
                        <Link
                            href="/auth/login"
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-bold transition"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/register"
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Apply for a Loan
                        </Link>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
