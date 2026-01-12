import Link from 'next/link';
import { AlertTriangle, CreditCard, Mail } from 'lucide-react';

export default function SubscriptionExpiredPage() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const reason = searchParams.get('reason') || 'Your subscription has expired';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Subscription Expired</h2>
          <p className="mt-2 text-gray-600">
            {reason}
          </p>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Access Restricted
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Your account has been temporarily suspended due to an expired subscription.
                      Please renew your subscription to regain access to the vendor dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Renew Subscription</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Contact our sales team to renew your subscription and continue offering loans on our marketplace.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">Contact Support</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Need help? Reach out to our support team for assistance with your subscription.
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
                Contact Sales Team
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
