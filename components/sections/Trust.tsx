'use client';

const Trust = () => {
    const points = [
        {
            title: 'Data Privacy',
            description: 'Your data is strictly confidential and never shared with unauthorized third parties.',
            icon: '🔒'
        },
        {
            title: 'Secure System',
            description: 'Military-grade encryption for all transactions and communications.',
            icon: '🛡️'
        },
        {
            title: 'No Hidden Fees',
            description: 'What you see is what you get. We pride ourselves on total transparency.',
            icon: '💎'
        },
        {
            title: 'Verified Partners',
            description: 'We only work with licensed and reputable financial institutions.',
            icon: '🤝'
        }
    ];

    return (
        <section id="trust" className="py-32 bg-white dark:bg-slate-900 border-b border-slate-50 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-20 items-center">
                    <div className="lg:w-1/2">
                        <h2 className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Safety First</h2>
                        <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1]">
                            Your trust is our <span className="text-blue-600">Greatest Asset.</span>
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-bold">
                            Money matters are built on trust. That's why we've implemented the highest security standards to protect your journey.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-12">
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-slate-900 dark:text-white mb-1">99.9%</span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Secure transactions</span>
                            </div>
                            <div className="h-10 w-px bg-slate-100 dark:bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-black text-slate-900 dark:text-white mb-1">ISO</span>
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Certified Secure</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {points.map((point, idx) => (
                            <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                                <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform duration-300 inline-block">{point.icon}</div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">{point.title}</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Trust;
