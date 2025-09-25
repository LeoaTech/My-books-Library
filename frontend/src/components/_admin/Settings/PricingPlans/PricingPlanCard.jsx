import { HiPencil } from "react-icons/hi";

const PricingPlanCard = ({ plans, handleEditPlan }) => {
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {plans?.map((plan, index) => (
        <div
          key={index}
          className="bg-neutral-50 dark:bg-[#24303F] border border-[#E2E8F0] dark:border-[#2E3A47] rounded-md shadow-sm p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-[#313D4A] dark:text-white mb-4">
              {plan.plan_name}
            </h3>
            <button
              type="button"
              onClick={() => handleEditPlan(plan.plan_id)}
            >
              <HiPencil size={20} />

            </button>
          </div>
          <div className="mb-4 mx-4">
            <p className="text-[#0284c7] dark:text-[#80CAEE] mb-2 font-medium">
              Price: {plan.price}
            </p>
            <p className="text-[#0284c7] dark:text-[#80CAEE] mb-2 font-medium">
              Duration: {plan.duration} Days
            </p>
            <p className="text-[#0284c7] dark:text-[#80CAEE] mb-2 font-medium">
              Credits Allocated:  {plan.credits_allocated}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#313D4A] dark:text-white mb-2">
              Features:
            </h4>
            <ul className="list-disc list-inside text-[#313D4A] dark:text-white">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="text-sm">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingPlanCard;