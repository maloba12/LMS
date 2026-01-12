'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Configuration constants
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const GRACE_PERIOD = 2 * 60 * 1000; // 2 minutes

export default function InactivityTimeout() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const graceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (graceTimerRef.current) {
      clearTimeout(graceTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Start new inactivity timer
    inactivityTimerRef.current = setTimeout(() => {
      setShowModal(true);
      startGracePeriod();
    }, INACTIVITY_TIMEOUT);
  }, []);

  // Start grace period countdown
  const startGracePeriod = () => {
    setCountdown(Math.floor(GRACE_PERIOD / 1000));

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleAutoLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    graceTimerRef.current = setTimeout(() => {
      handleAutoLogout();
    }, GRACE_PERIOD);
  };

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (!showModal) {
      resetInactivityTimer();
    }
  }, [showModal, resetInactivityTimer]);

  // Continue session
  const handleContinueSession = () => {
    setShowModal(false);
    setShowConfirmation(true);
    setConfirmationMessage('Your session has been refreshed. You may continue using the system.');

    // Clear timers
    if (graceTimerRef.current) {
      clearTimeout(graceTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Reset inactivity timer
    resetInactivityTimer();

    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  // Handle logout
  const handleLogout = async () => {
    setShowModal(false);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setShowConfirmation(true);
        setConfirmationMessage('You have been logged out due to inactivity. Please sign in again to continue.');

        // Redirect after showing message
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback redirect
      router.push('/auth/login');
    }
  };

  // Auto logout when grace period expires
  const handleAutoLogout = () => {
    setShowModal(false);
    handleLogout();
  };

  // Set up event listeners
  useEffect(() => {
    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start initial timer
    resetInactivityTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [handleActivity, resetInactivityTimer]);

  return (
    <>
      {/* Inactivity Warning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Session Timeout Warning
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your session has been inactive for some time. For security reasons, the system is about to log you out. Please confirm if you are still active to continue using the system.
                </p>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Auto-logout in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleContinueSession}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Continue Session
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-gray-800">{confirmationMessage}</p>
              </div>
              <button
                onClick={() => setShowConfirmation(false)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
