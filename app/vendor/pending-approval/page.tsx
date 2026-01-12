import Link from 'next/link';
import { Clock, CheckCircle, Mail, Building2 } from 'lucide-react';

export default function VendorPendingApprovalPage() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const reason = searchParams.get('reason') || 'pending_approval';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <Clock className="mx-auto h-16 w-16 text-yellow-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Account Under Review</h2>
          <p className="mt-2 text-gray-600">
            Your company registration is currently being reviewed by our administrators.
          </p>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Review in Progress
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Our team is carefully reviewing your company information, regulatory compliance,
                      and subscription details. This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">What We Check</h3>
                  <ul className="mt-1 text-sm text-gray-500 space-y-1">
                    <li>• Company registration and PACRA details</li>
                    <li>• Regulatory compliance and licenses</li>
                    <li>• Subscription payment verification</li>
                    <li>• Contact information accuracy</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Notification</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You will receive an email notification once your account is approved and activated.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Next Steps</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Once approved, you'll be able to access your vendor dashboard, create loan products,
                    and start offering loans to customers on our marketplace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex flex-col space-y-4">
              <Link
                href="/contact"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </Link>
              <Link
                href="/auth/logout"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

