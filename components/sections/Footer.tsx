'use client';

import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-slate-900 pt-24 pb-12 overflow-hidden relative">
            {/* Background accent */}
            <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-blue-600/10 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="inline-block mb-8">
                            <span className="text-3xl font-black tracking-tighter text-white">
                                Smart<span className="text-blue-500">Loan</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                            Zambia's leading marketplace for registered financial solutions. Fully compliant with PACRA and ZRA regulations to provide you with secure and transparent lending.
                        </p>
                        <div className="flex gap-4">
                            {['fb', 'tw', 'ig', 'li'].map(social => (
                                <button key={social} className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <span className="font-bold uppercase text-[10px]">{social}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Marketplace', href: '/marketplace' },
                                { name: 'Lenders', href: '#lenders' },
                                { name: 'How it Works', href: '#how-it-works' },
                                { name: 'Eligibility', href: '/marketplace' }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-blue-400 text-sm font-bold transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Company</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact', href: '/contact' },
                                { name: 'Blog', href: '/blog' },
                                { name: 'Careers', href: '/careers' }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-blue-400 text-sm font-bold transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Legal</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Legal', href: '/legal' },
                                { name: 'Terms & Conditions', href: '/terms' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Cookie Policy', href: '/cookies' },
                                { name: 'Licenses', href: '/licenses' }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-blue-400 text-sm font-bold transition-colors">{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        © 2026 SmartLoan Zambia. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        <span>Language:</span>
                        <select className="bg-transparent text-slate-300 outline-none cursor-pointer hover:text-blue-400 transition-colors">
                            <option>English (ZM)</option>
                            <option>Bemba</option>
                            <option>Nyanja</option>
                        </select>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
