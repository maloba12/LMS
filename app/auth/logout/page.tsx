'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically submit logout form on page load
    const logoutForm = document.getElementById('logout-form') as HTMLFormElement;
    if (logoutForm) {
      logoutForm.submit();
    }
  }, []);

  const handleManualLogout = () => {
    const logoutForm = document.getElementById('logout-form') as HTMLFormElement;
    if (logoutForm) {
      logoutForm.submit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <LogOut className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Logging Out</h2>
          <p className="mt-2 text-gray-600">
            Please wait while we securely log you out...
          </p>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting you to the login page...
            </p>
          </div>

          {/* Hidden form for logout */}
          <form
            id="logout-form"
            action="/api/auth/logout"
            method="POST"
            style={{ display: 'none' }}
          >
          </form>

          {/* Fallback button in case auto-submit doesn't work */}
          <div className="mt-6 text-center">
            <button
              onClick={handleManualLogout}
              className="text-sm text-blue-600 hover:text-blue-500 underline"
            >
              Click here if you're not redirected automatically
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
