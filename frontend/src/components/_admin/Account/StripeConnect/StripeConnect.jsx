
import { BASE_URL } from '../../../../utils/baseAPIURL';
import { useFetchUserPaymentMethod } from '../../../../hooks/users/useFetchPaymentMethodDetails';
import { useState } from 'react';

const StripeConnect = ({ entityId }) => {
    // const [status, setStatus] = useState('disconnected'); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { data: fetchPaymentStatus, isLoading, refetch } = useFetchUserPaymentMethod(entityId);
    // console.log(fetchPaymentStatus, "Fetch  Status of Payment")

    const handleConnect = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${BASE_URL}/library/${entityId}/stripe/connect`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await res.json();
            console.log("Response for Connect API", res)

            if (!res.ok) {
                throw new Error(data.error || "Failed to initiate Stripe connection");
            }

            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe's hosted onboarding
            } else {
                setError("Received invalid redirect URL from server.");
            }
        } catch (err) {
            // console.error(err);
            setError(err.message || 'Failed to start onboarding');
        } finally {
            setLoading(false);
        }
    };

    const handleConnectExisting = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${BASE_URL}/library/${entityId}/stripe/oauth-url`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            // console.log("res", res, "data", data);

            if (!res.ok) {
                throw new Error(data.error || "Failed to get Stripe OAuth URL");
            }

            if (data.url) {
                window.location.href = data.url;  // Redirect to Stripe OAuth
            } else {
                setError("Received invalid redirect URL from server.");
            }

        } catch (err) {
            // console.error(err);
            setError(err.message || 'Failed to connect exising stripe account');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <p>Please wait for Loading to compelete</p>
                {/* <button
                    onClick={refetch}
                    className="mt-2 text-xs text-green-600 underline"
                >
                    Refresh Status
                </button> */}
            </div>
        )
    }
    if (fetchPaymentStatus?.status === 'connected') {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800">Stripe Connected</h3>
                <p className="text-sm text-green-600">Your library is ready to accept payments!</p>

            </div>
        );
    }

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Connect Stripe for Library Payments</h3>
            <p className="text-sm text-gray-600 mb-4">
                Link your Stripe account to enable subscription plans for your library customers.
            </p>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            {fetchPaymentStatus?.status === 'pending' && (
                <div className="text-yellow-600 text-sm mb-4">
                    Onboarding in progress... <p className="underline">Status is {fetchPaymentStatus?.status }</p>
                </div>
            )}

            <button
                onClick={handleConnect}
                disabled={loading || fetchPaymentStatus?.status === 'connected'}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
                {loading ? 'Connecting...' : fetchPaymentStatus?.status === 'pending' ? 'Complete Onboarding' : 'Connect Stripe'}
            </button>

            <p className="text-xs text-gray-500 mt-2">
                We&apos;ll redirect you to Stripe to set up your payment account.
            </p>


            <div className='mb-4 py-4'>
                <p className='font-semibold text-md mb-2 py-2'>Want to Integrate Existing Standard Account?</p>
                <button
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    onClick={handleConnectExisting}>Connect Existing Stripe Account</button>
            </div>
        </div>
    );
};

export default StripeConnect;


