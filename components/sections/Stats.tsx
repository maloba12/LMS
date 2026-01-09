'use client';

import Image from 'next/image';

const Stats = () => {
    const stats = [
        { label: 'Active Users', value: '150K+', description: 'Trusting SmartLoan' },
        { label: 'Loans Approved', value: 'K5.2B+', description: 'Financial fuel' },
        { label: 'Lending Partners', value: '50+', description: 'Leading institutions' },
        { label: 'Customer Rating', value: '4.9/5', description: 'Exceptional service' }
    ];

    return (
        <section className="py-40 bg-slate-900 overflow-hidden relative min-h-[60vh] flex items-center">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/loan8.jpg"
                    alt="Growth background"
                    fill
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/40"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Content */}
                    <div className="relative z-10">
                        <h2 className="text-blue-400 font-black tracking-widest uppercase text-sm mb-4">Our Growth</h2>
                        <h3 className="text-4xl lg:text-7xl font-black text-white mb-12 tracking-tighter leading-tight">
                            Powering financial <br /><span className="text-blue-500">Freedom for Millions.</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="group p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                                    <p className="text-5xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {stat.value}
                                    </p>
                                    <p className="text-lg font-black text-white mb-1">{stat.label}</p>
                                    <p className="text-slate-400 text-sm font-medium">{stat.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Graphic */}
                    <div className="relative hidden lg:block">
                        <div className="relative z-10 transform hover:scale-105 transition-transform duration-700 bg-white/5 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 shadow-2xl">
                            <Image 
                                src="/images/graph-growth.png"
                                alt="Financial Growth Graph"
                                width={600}
                                height={600}
                                className="w-full h-auto drop-shadow-3xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
