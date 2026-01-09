'use client';

import Image from 'next/image';
import Link from 'next/link';

interface LendersProps {
    searchQuery: string;
    loanType: string;
}

const Lenders = ({ searchQuery, loanType }: LendersProps) => {
    const lenders = [
        {
            name: 'Zanaco (Zambia National Commercial Bank)',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ZN&backgroundColor=2563eb',
            rating: 4.8,
            reviews: 1250,
            types: ['Business', 'Personal', 'Salary'],
            minRate: '18%',
            speed: '24h'
        },
        {
            name: 'Atlas Mara Zambia',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=059669',
            rating: 4.7,
            reviews: 920,
            types: ['Business', 'Salary', 'Emergency'],
            minRate: '21%',
            speed: '48h'
        },
        {
            name: 'Izwe Loans Zambia',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=IL&backgroundColor=7c3aed',
            rating: 4.6,
            reviews: 3100,
            types: ['Salary', 'SME', 'Civil Servant'],
            minRate: '25%',
            speed: '12h'
        },
        {
            name: 'Bayport Financial Services',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=BP&backgroundColor=ea580c',
            rating: 4.5,
            reviews: 5400,
            types: ['Salary', 'Government', 'Personal'],
            minRate: '22%',
            speed: '24h'
        },
        {
            name: 'FINCA Zambia',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=FZ&backgroundColor=db2777',
            rating: 4.4,
            reviews: 1800,
            types: ['Microfinance', 'Business', 'Emergency'],
            minRate: '28%',
            speed: '24h'
        },
        {
            name: 'Madison Finance',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MF&backgroundColor=1d4ed8',
            rating: 4.7,
            reviews: 750,
            types: ['Business', 'SME', 'Personal'],
            minRate: '23%',
            speed: '48h'
        }
    ];

    const filteredLenders = lenders.filter(lender => {
        const matchesSearch = lender.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             lender.types.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = loanType === 'All' || lender.types.some(t => t.toLowerCase() === loanType.toLowerCase());
        return matchesSearch && matchesType;
    });

    return (
        <section id="lenders" className="py-32 relative overflow-hidden bg-white dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Lending Partners</h2>
                        <p className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Explore our <span className="text-blue-600">Premium Lenders.</span>
                        </p>
                    </div>
                    <Link 
                        href="/marketplace"
                        className="group flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                    >
                        View all 50+ lenders
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredLenders.length > 0 ? (
                        filteredLenders.map((lender, idx) => (
                            <div 
                                key={idx}
                                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden relative shadow-lg">
                                        <img src={lender.logo} alt={lender.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full">
                                            <span className="text-yellow-500">★</span>
                                            <span className="text-slate-900 dark:text-yellow-500 font-bold text-sm">{lender.rating}</span>
                                            <span className="text-slate-400 text-xs font-bold">({lender.reviews})</span>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase tracking-tighter">PACRA/ZRA Reg</span>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors h-16 line-clamp-2">
                                    {lender.name}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-8 h-12">
                                    {lender.types.slice(0, 3).map(type => (
                                        <span key={type} className="px-3 py-1 text-xs font-bold bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full">
                                            {type}
                                        </span>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50 dark:border-slate-700 mb-8">
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Starting From</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">{lender.minRate} p.a.</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Approval Time</p>
                                        <p className="text-xl font-black text-blue-600">{lender.speed}</p>
                                    </div>
                                </div>

                                <Link 
                                    href={`/marketplace/lender/${idx}`}
                                    className="block w-full text-center py-4 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform active:scale-95"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No companies found</h3>
                            <p className="text-slate-500">Try adjusting your search or filters to find what you're looking for.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Lenders;
