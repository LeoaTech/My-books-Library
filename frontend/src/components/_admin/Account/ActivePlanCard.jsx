import { Link, useParams } from "react-router-dom";

const ActivePlanCard = ({ currentPlan }) => {
  const { subscription } = currentPlan || {};
  const isActive = currentPlan?.isActive;

  const { subdomain } = useParams();

  return (
    <div className="bg-white dark:bg-[#24303F] shadow-md rounded-lg p-6 border dark:border-[#2E3A47] h-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Current Plan</h2>
        <div className="mb-4">
          <span className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold mb-2">
            {subscription?.planName || "Free Plan"}
          </span>
          <div className='flex items-end gap-1'>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">$29</h3>
            <span className="text-gray-500 font-medium mb-1">/ Month</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          to={`/${subdomain}/pricing`}
          className="bg-[#24303F] text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
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