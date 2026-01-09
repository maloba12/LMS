import VendorOnboardingForm from '@/components/VendorOnboardingForm';
import { Building2, ShieldCheck, BadgeCheck } from 'lucide-react';

export default function VendorOnboardingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 mb-6 font-bold text-2xl">
                        <Building2 className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Vendor Onboarding
                    </h1>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        Welcome to the Loan Marketplace. Please provide your company details to start reaching customers across Zambia.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-blue-500 mb-2" />
                        <h3 className="text-sm font-bold">PACRA Verified</h3>
                        <p className="text-[10px] text-gray-400">Trusted business entity</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                        <BadgeCheck className="w-8 h-8 text-green-500 mb-2" />
                        <h3 className="text-sm font-bold">BoZ Licensed</h3>
                        <p className="text-[10px] text-gray-400">Compliant institution</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                        <Building2 className="w-8 h-8 text-indigo-500 mb-2" />
                        <h3 className="text-sm font-bold">Marketplace Ready</h3>
                        <p className="text-[10px] text-gray-400">Reach more customers</p>
                    </div>
                </div>

                <VendorOnboardingForm />

                <div className="pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        By submitting, you agree to comply with the Bank of Zambia regulations and the Loan Marketplace terms of service.
                    </p>
                </div>
            </div>
        </div>
    );
}
