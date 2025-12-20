import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center -mx-4">
                        <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
                            <div className="max-w-lg">
                                <h1 className="text-5xl font-bold font-heading mb-6 leading-tight text-slate-900">
                                    Smart, Secure <span className="text-blue-600">Loan Management</span> Made Simple
                                </h1>
                                <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                    The all-in-one platform for effortless loan applications, document processing, and status tracking. Designed for speed, security, and transparency.
                                </p>
                                <div className="flex flex-wrap -mx-2">
                                    <div className="w-full sm:w-auto px-2 mb-3 sm:mb-0">
                                        <Link href="/auth/register" className="inline-block w-full py-4 px-8 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl transition duration-200 text-center">
                                            Apply for a Loan
                                        </Link>
                                    </div>
                                    <div className="w-full sm:w-auto px-2">
                                        <Link href="/about" className="inline-block w-full py-4 px-8 text-slate-900 font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl transition duration-200 text-center">
                                            Learn More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 px-4">
                            <div className="relative max-w-lg mx-auto">
                                <div className="absolute top-0 left-0 w-full h-full bg-blue-100 rounded-3xl transform rotate-3 -z-10"></div>
                                <div className="bg-white p-8 rounded-3xl shadow-2xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="h-2 w-16 bg-blue-100 rounded-full"></div>
                                        <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
                                        <div className="h-4 w-1/2 bg-slate-100 rounded-full"></div>
                                        <div className="h-12 w-full bg-blue-50 rounded-xl"></div>
                                        <div className="h-4 w-5/6 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="mt-10 flex items-center space-x-4">
                                        <div className="h-10 w-10 bg-indigo-100 rounded-full"></div>
                                        <div>
                                            <div className="h-3 w-20 bg-slate-200 rounded-full mb-1"></div>
                                            <div className="h-2 w-32 bg-slate-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center mb-20">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need to Manage Loans</h2>
                        <p className="text-slate-600">A simplified workflow for both customers and administrators, built for modern financial management.</p>
                    </div>
                    <div className="flex flex-wrap -mx-4">
                        {[
                            { title: 'Customer Onboarding', desc: 'Fast and secure registration process to get you started in minutes.' },
                            { title: 'Online Loan Application', desc: 'Apply for loans directly from your intuitive customer dashboard.' },
                            { title: 'Secure Document Upload', desc: 'Safely upload and store your CV and other required documents.' },
                            { title: 'Loan Status Tracking', desc: 'Track your application status in real-time from PENDING to approval.' },
                            { title: 'Admin Approval Workflow', desc: 'Streamlined tools for administrators to review and process applications.' }
                        ].map((feature) => (
                            <div key={feature.title} className="w-full md:w-1/2 lg:w-1/5 px-4 mb-8">
                                <div className="bg-white h-full p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="bg-blue-600 rounded-3xl p-12 text-center text-white">
                        <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
                            Join thousands of users who trust our system for their financial management needs.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/auth/register" className="py-4 px-8 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition">
                                Create Account
                            </Link>
                            <Link href="/contact" className="py-4 px-8 border border-white text-white font-bold rounded-xl hover:bg-blue-700 transition">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">© 2025 Loan Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
