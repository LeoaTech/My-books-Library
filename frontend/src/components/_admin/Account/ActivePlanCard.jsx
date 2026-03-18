import { Link, useParams } from "react-router-dom";

const ActivePlanCard = ({ currentPlan }) => {
  const { subscription } = currentPlan || {};
  const isActive = currentPlan?.isActive;

  const { subdomain } = useParams();
  const amount = subscription?.amount;
  const currency = subscription?.currency || 'usd';

  const formatPrice = (value, curr) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0
    }).format(value);
  };

  const displayPrice = amount > 0 ? formatPrice(amount, currency) : "Free";

  return (
    <div className="bg-surface shadow-md rounded-lg p-6 border border-border h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-6 text-text">Current Plan</h2>
        <div className="mb-4">
          <span className="inline-block bg-border text-text px-3 py-1 rounded-full text-sm font-semibold mb-2">
            {subscription?.planName || "Free Plan"}
          </span>
          <div className='flex items-end gap-1'>
            <h3 className="text-3xl font-bold text-text">{displayPrice}</h3>
            {amount > 0 && <span className="text-primary font-medium mb-1">/ Month</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/${subdomain}/pricing`}
          className="border-border bg-background text-text shadow-sm disabled:opacity-50 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
        >
          Upgrade
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00001 3.33334V12.6667M8.00001 3.33334L12.6667 8.00001M8.00001 3.33334L3.33334 8.00001" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  );
};



export default ActivePlanCard;