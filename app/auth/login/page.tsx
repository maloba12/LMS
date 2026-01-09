'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                return;
            }

            // Redirect based on role
            if (data.role === 'admin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/customer');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 overflow-hidden">
            {/* Left Column: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 bg-white z-10 relative">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-12">
                        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black group-hover:bg-blue-700 transition-colors">S</div>
                            <span className="text-2xl font-black tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">
                                Smart<span className="text-blue-600">Loan</span>
                            </span>
                        </Link>
                        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome back</h2>
                        <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white text-slate-900 font-medium transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                                <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white text-slate-900 font-medium transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-600/20 text-base font-black text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all transform active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="font-black text-blue-600 hover:text-blue-700 transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer disclaimer */}
                <div className="absolute bottom-8 left-0 right-0 text-center">
                   <p className="text-[10px] uppercase tracking-widest font-bold text-slate-300">© 2026 SmartLoan Technologies. All rights reserved.</p>
                </div>
            </div>

            {/* Right Column: Branding/Visual */}
            <div className="hidden lg:flex flex-1 relative bg-blue-600 overflow-hidden items-center justify-center">
                {/* Decorative Pattern Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[128px] translate-x-1/3 translate-y-1/3"></div>
                </div>
                
                <div className="relative z-10 text-center px-12">
                    <div className="inline-block p-6 rounded-[3rem] bg-white/10 backdrop-blur-3xl border border-white/20 mb-8 animate-bounce-slow">
                        <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-7xl font-black text-white leading-none mb-6 tracking-tighter">
                        Smart<br /><span className="text-blue-200">Loan</span>
                    </h1>
                    <p className="text-xl text-blue-100 font-medium max-w-sm mx-auto leading-relaxed">
                        The ultimate marketplace for personalized financial solutions.
                    </p>
                </div>

                {/* Floating graphic elements */}
                <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-blue-400 rounded-lg rotate-12 opacity-40 animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border-4 border-blue-400 rounded-full opacity-30 animate-bounce-slow-delay"></div>
            </div>
        </div>
    );
}
