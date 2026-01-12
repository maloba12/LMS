import Link from 'next/link';
import { CheckCircle, Clock, Mail } from 'lucide-react';

export default function CompanyRegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Registration Submitted!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for registering your company with our loan marketplace.
          </p>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Review Process</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your company registration is currently under review by our administrators.
                  This process typically takes 1-2 business days.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">Email Notification</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You will receive an email notification once your account is approved and activated.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">What Happens Next?</h3>
                <ul className="mt-1 text-sm text-gray-500 space-y-1">
                  <li>• Admin reviews your company information</li>
                  <li>• PACRA number and documents are verified</li>
                  <li>• Account is activated for marketplace access</li>
                  <li>• You can start listing loan products</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Questions about your registration? Contact our support team.
              </p>
              <div className="flex space-x-4 justify-center">
                <Link
                  href="/dashboard/vendor"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
