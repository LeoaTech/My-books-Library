import { lazy, useState, Suspense } from 'react';
const StripeConnect = lazy(() => import('../../components/_admin/Account/StripeConnect/StripeConnect'));
const ProfileUpdateForm = lazy(() => import('../../components/_admin/Account/ProfileUpdateForm'));
const BillingHistory = lazy(() => import('../../components/_admin/Account/BillingHistory'));
const ActivePlanCard = lazy(() => import('../../components/_admin/Account/ActivePlanCard'));
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetchCurrentPlan } from '../../hooks/current_plan/useFetchCurrentPlan';
import { useFetchTransactions } from '../../hooks/settings/useFetchTransactions';
import Loader from '../../components/_admin/Loader/Loader';
import { getCurrencyCode } from '../../utils/currencyUtils';


const Profile = () => {
  const { auth } = useAuthContext();
  const entityId = auth?.entityId;
  const currencyCode = getCurrencyCode(auth?.country) || "usd";

  const [activeTab, setActiveTab] = useState('profile');

  const { data: currentPlan, isLoading: isPlanLoading } = useFetchCurrentPlan(auth);
  const { data: transactions, isLoading: isTxLoading } = useFetchTransactions();

  if (!auth?.entityId) {
    return (
      <p> No Library ID found</p>
    )
  }

  if (isPlanLoading && !currentPlan) {
    return <Loader />;
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'payment', label: 'Payment Method' },
    { id: 'billing', label: 'Billing' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your profile, payment methods, and billing information.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'profile' && (
          <section>
            <Suspense fallback={<Loader />}>
              <ProfileUpdateForm />
            </Suspense>
          </section>
        )}

        {activeTab === 'payment' && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h2>
            <Suspense fallback={<Loader />}>
              <StripeConnect entityId={entityId} /></Suspense>
          </section>
        )}

        {activeTab === 'billing' && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Overview</h2>

            <div className="grid grid-cols-1 mb-10">
              <Suspense fallback={<Loader />}>
                <ActivePlanCard currentPlan={currentPlan} /></Suspense>
            </div>
            <Suspense fallback={<Loader />}>
              <BillingHistory transactions={transactions} currencyCode={currencyCode} /></Suspense>
          </section>
        )}
      </div>
    </div>
  );
}

export default Profile;
