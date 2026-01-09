'use client';

const HowItWorks = () => {
    const steps = [
        {
            number: '01',
            title: 'Search providers',
            description: 'Browse our marketplace to find the best lending companies and loan products for your needs.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            )
        },
        {
            number: '02',
            title: 'Compare options',
            description: 'Evaluate interest rates, repayment terms, and requirements from multiple top-rated lenders.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            number: '03',
            title: 'Verify details',
            description: 'Submit your requirements and documents for quick verification through our secure platform.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            number: '04',
            title: 'Receive funds',
            description: 'Once approved, your funds are deposited directly into your bank account within 24 hours.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <section id="how-it-works" className="py-32 bg-slate-900 overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-600/5 blur-3xl rounded-full -translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Process</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                        How the Platform <span className="text-blue-500">Works.</span>
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative group p-8 rounded-[2.5rem] bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-2">
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xl shadow-blue-600/5">
                                    {step.icon}
                                </div>
                                <span className="text-5xl font-black text-slate-700/50 group-hover:text-blue-600/20 transition-colors duration-300 select-none">
                                    {step.number}
                                </span>
                            </div>
                            <h4 className="text-xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">{step.title}</h4>
                            <p className="text-slate-400 leading-relaxed text-sm font-medium">
                                {step.description}
                            </p>
                            
                            {/* Connector line for large screens */}
                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-blue-600/20 to-transparent -ml-8 -z-10"></div>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Mobile/Tablet CTA */}
                <div className="mt-20 text-center">
                    <p className="text-slate-400 mb-8 font-medium">Ready to get started on your application?</p>
                    <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition shadow-2xl shadow-blue-600/30">
                        Get Your Loan Now
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
