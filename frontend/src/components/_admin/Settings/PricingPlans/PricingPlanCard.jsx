import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePricingApi } from "../../../../hooks/settings/usePricingApi";
import LoadingSpinner from "../../Loader/LoadingSpinner";
const HiPencil = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const HiTrash = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const HiDotsVertical = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);
const PricingPlanCard = ({ plans, handleEditPlan }) => {

  const [openPlanActionId, setOpenPlanActionId] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, error, deletePlan } = usePricingApi();



  const { mutateAsync: deletePlanMutation } = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries(['pricing']);
    },
  });

  const toggleActionMenu = (planId) => {
    setOpenPlanActionId(openPlanActionId === planId ? null : planId);
  };
  const handleToggle = () => setIsYearly(!isYearly);

  //close the action menu
  useEffect(() => {
    const handleOutsideClick = (event) => {

      const isButton = event.target.closest('[data-action-button="true"]');
      if (!isButton && openPlanActionId !== null) {
        setOpenPlanActionId(null);
      }
    };

    window.addEventListener('click', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [openPlanActionId]);


  const handleDeletePlan = async (planId) => {
    await deletePlanMutation(planId)
  }

  const ToggleSwitch = () => (
    <div className="flex items-center justify-center space-x-4 mb-8 bg-white dark:bg-[#1d2a39] p-2 rounded-full shadow-inner w-fit mx-auto">
      <span className={`text-sm font-semibold transition-colors duration-200 ${!isYearly ? 'text-[#0284c7] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        Monthly
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={isYearly} onChange={handleToggle} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#80CAEE] dark:peer-focus:ring-[#0284c7] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#0284c7]"></div>
      </label>
      <span className={`text-sm font-semibold transition-colors duration-200 ${isYearly ? 'text-[#0284c7] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
        Yearly
      </span>
    </div>
  );

  if(plans?.length ==0){
    return (
      <p className="flex justify-center items-center">Add New Plans</p>
    )
  }

  return (
    <div className="p-6">
      <ToggleSwitch />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">

        {plans?.map((plan, index) => {

          const currentPricing = isYearly
            ? plan.plan_details?.yearly
            : plan.plan_details?.monthly;

          const displayCredits = isYearly ? plan.plan_details?.yearly?.credits_allocated : plan.plan_details?.monthly?.credits_allocated;
          const displayFeatures = plan.plan_details?.features;

          if (!currentPricing) return null;

          return (
            <div
              key={plan?.plan_id || index}
              className="bg-neutral-50 dark:bg-[#24303F] border border-[#E2E8F0] dark:border-[#2E3A47] rounded-md shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[#313D4A] dark:text-white mb-4">
                  {plan.plan_name}
                </h3>

                {/* Action Button */}
                <div className="relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleActionMenu(plan.plan_id);
                    }}
                    className="text-[#758aae] hover:text-[#0284c7] dark:text-white dark:hover:text-[#80CAEE] p-2 rounded-full transition duration-150 ease-in-out"
                    data-action-button="true"
                  >
                    <HiDotsVertical size={20} />
                  </button>

                  {/*  Action Dropdown Menu  */}
                  {openPlanActionId === plan.plan_id && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1d2a39] rounded-md shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {/*  Edit Plan */}
                      <div
                        className="py-1 cursor-pointer text-blue-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#24303F]"
                        onClick={() => {
                          handleEditPlan(plan.plan_id);
                          setOpenPlanActionId(null);
                        }}
                      >
                        <div className="flex items-center px-4 gap-2 py-2 text-sm">
                          <HiPencil size={16} className="mr-2 text-blue-500" />
                          Edit Plan
                        </div>
                      </div>

                      {/* Delete Plan */}
                      <div
                        className="py-1 cursor-pointer text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#24303F]"
                        onClick={() => {
                          handleDeletePlan(plan.plan_id);
                          setOpenPlanActionId(null);
                        }}
                      >
                        {isLoading ? <LoadingSpinner /> : <div className="flex items-center px-4 py-2 gap-4 text-sm text-red-500">
                          <HiTrash size={16} className="mr-2 ml-4" />
                          Delete Plan
                        </div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 mx-2 border-l-4 border-l-[#032e43] dark:border-l-[#80CAEE] pl-4 py-2 bg-neutral-100 dark:bg-[#2e3a47] rounded-md">
                <p className="text-[#0284c7] dark:text-white mb-2 text-xl font-bold">
                  ₨{currentPricing?.price_value?.toLocaleString()}
                  <span className="text-base font-semibold text-purple-700 dark:text-purple-400">
                    / {isYearly ? 'year' : 'month'}
                  </span>
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium text-md">
                  Duration: {currentPricing.duration_days} Days
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium text-md">
                  Credits Allocated: {displayCredits}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#313D4A] dark:text-white mb-2 mt-4">
                  Features:
                </h4>
                <ul className="list-disc list-inside text-[#313D4A] dark:text-white space-y-1">
                  {displayFeatures?.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-md">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )

        })}
      </div>
    </div>
  );
};

export default PricingPlanCard;