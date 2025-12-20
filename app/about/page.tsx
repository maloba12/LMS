import Navbar from '@/components/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto py-20 px-4">
                <h1 className="text-4xl font-bold mb-8 text-slate-900 text-center">About Our System</h1>

                <div className="prose prose-slate max-w-none space-y-8 text-lg text-slate-600 leading-relaxed">
                    <p>
                        The Loan Management System (LMS) is a modern, web-based platform designed to bridge the gap between financial needs and efficient management. Our mission is to provide a transparent, secure, and fast environment for both borrowers and administrators.
                    </p>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Key Benefits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                            <div className="bg-slate-50 p-6 rounded-xl">
                                <h3 className="font-bold text-lg mb-2 text-blue-600">For Customers</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Quick and easy registration</li>
                                    <li>Online document (CV) submission</li>
                                    <li>Simple application process</li>
                                    <li>Real-time status tracking</li>
                                </ul>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl">
                                <h3 className="font-bold text-lg mb-2 text-indigo-600">For Administrators</h3>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Centralized user management</li>
                                    <li>Efficient dashboard for loan reviews</li>
                                    <li>One-click approve/reject actions</li>
                                    <li>Detailed customer profiles</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Technology</h2>
                        <p>
                            Built using Next.js and MySQL, our platform leverages the latest technology to ensure data integrity and 99.9% uptime. Security is at the heart of our architecture, with hashed passwords, protected API routes, and secure document storage.
                        </p>
                    </section>

                    <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100 italic">
                        "Transparency and speed are not just features; they are our foundational principles."
                    </section>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">© 2025 Loan Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
