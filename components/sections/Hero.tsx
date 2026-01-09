'use client';

import Image from 'next/image';
import Link from 'next/link';
interface HeroProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    loanType: string;
    setLoanType: (val: string) => void;
}

const Hero = ({ searchQuery, setSearchQuery, loanType, setLoanType }: HeroProps) => {
    const categories = [
        { name: 'Business', icon: '💼' },
        { name: 'Student', icon: '🎓' },
        { name: 'Salary', icon: '💵' },
        { name: 'Emergency', icon: '🚨' },
    ];

    const handleSearch = () => {
        const lendersSection = document.getElementById('lenders');
        if (lendersSection) {
            lendersSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-slate-900">
            {/* Background image for right section */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full z-0">
                <Image
                    src="/images/loan14.jpg"
                    alt="Financial background"
                    fill
                    className="object-cover opacity-60 lg:opacity-100"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent lg:hidden"></div>
                <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-900 to-transparent hidden lg:block"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center">
                    {/* Left content */}
                    <div className="w-full lg:w-3/5 text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 text-blue-400 text-sm font-bold mb-8 border border-blue-500/20">
                            <span className="relative flex h-2 w-2 mr-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Trusted by 10,000+ happy borrowers
                        </div>
                        
                        <h1 className="text-5xl lg:text-8xl font-black text-white leading-[1.05] mb-8 tracking-tighter">
                            Personalized Loans for <span className="text-blue-500">Your Future.</span>
                        </h1>
                        
                        <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            Apply for loans with competitive interest rates and flexible repayment plans. 
                            Our marketplace connects you with top-rated lending companies instantly.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 lg:justify-start">
                            <Link 
                                href="/auth/register"
                                className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-600/40 transform hover:-translate-y-1 active:translate-y-0 text-lg"
                            >
                                Apply for a Loan
                            </Link>
                            <Link 
                                href="/marketplace"
                                className="w-full sm:w-auto px-10 py-5 bg-slate-800/80 backdrop-blur-md text-white font-black rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700 text-lg"
                            >
                                Check Eligibility
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto lg:mx-0 p-2 bg-white/10 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/10">
                            <div className="flex flex-col md:flex-row items-stretch gap-2">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search providers or loan types..."
                                        className="block w-full pl-14 pr-4 py-5 rounded-[1.8rem] bg-slate-900/50 border-transparent focus:border-blue-500 focus:bg-slate-900/80 focus:ring-4 focus:ring-blue-500/20 text-white transition-all outline-none placeholder:text-slate-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        className="px-6 py-5 rounded-[1.8rem] bg-slate-900/50 text-slate-300 font-bold border-transparent focus:ring-4 focus:ring-blue-500/20 outline-none cursor-pointer hover:bg-slate-900/80 transition-all appearance-none pr-10 relative"
                                        value={loanType}
                                        onChange={(e) => setLoanType(e.target.value)}
                                    >
                                        <option>All Types</option>
                                        <option>Business</option>
                                        <option>Student</option>
                                        <option>Salary</option>
                                        <option>Emergency</option>
                                    </select>
                                    <button 
                                        onClick={handleSearch}
                                        className="px-8 py-5 bg-blue-600 text-white font-black rounded-[1.8rem] hover:bg-blue-700 transition shadow-xl shadow-blue-600/30"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8">
                            {categories.map((cat) => (
                                <button 
                                    key={cat.name}
                                    onClick={() => {
                                        setLoanType(cat.name);
                                        handleSearch();
                                    }}
                                    className={`inline-flex items-center px-5 py-2.5 rounded-xl border transition-all font-bold text-sm ${
                                        loanType === cat.name 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="mr-2">{cat.icon}</span>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
