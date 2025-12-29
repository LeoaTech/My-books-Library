
import { Link, useLocation } from "react-router-dom";

function AuthFailurePage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const errorMessage = query.get("error") || "Authentication failed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
        {/* Error Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-6">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Failed
        </h2>
        
        <p className="text-gray-500 mb-6">
          We couldn&apos;t sign you in. Please check your details and try again.
        </p>

        {/* Dynamic Error Message Box */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
          <p className="text-sm font-medium text-red-800 break-words">
            Error: {errorMessage}
          </p>
        </div>

        {/* Action Button */}
        <Link
          to="/signin"
          className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          Try Again
        </Link>
        
        {/* Optional Helper Link */}
        <div className="mt-4">
            <Link to="/support" className="text-sm text-gray-400 hover:text-gray-600 hover:underline">
                Need help? Contact Support
            </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthFailurePage;