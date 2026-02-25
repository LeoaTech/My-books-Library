import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePricingApi } from "../../../../hooks/settings/usePricingApi";
import LoadingSpinner from "../../Loader/LoadingSpinner";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import { getCurrencyCode } from "../../../../utils/currencyUtils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Sortable Item Component
const SortableItem = ({
  plan,
  isYearly,
  currencyCode,
  openPlanActionId,
  toggleActionMenu,
  handleEditPlan,
  handleDeletePlan,
  isLoading,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: plan.plan_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const currentPricing = isYearly
    ? plan.plan_details?.yearly
    : plan.plan_details?.monthly;

  const displayCredits = isYearly
    ? plan.plan_details?.yearly?.credits_allocated
    : plan.plan_details?.monthly?.credits_allocated;
  const displayFeatures = plan.plan_details?.features;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-background border border-border rounded-md shadow-sm p-6 transition-shadow ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-text mb-4">
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
            className="text-text hover:text-primary  p-2 rounded-full transition duration-150 ease-in-out"
            data-action-button="true"
          >
            <HiDotsVertical size={20} />
          </button>

          {/*  Action Dropdown Menu  */}
          {openPlanActionId === plan.plan_id && (
            <div
              className="absolute right-0 mt-2 w-48 bg-surface border-2 border-border p-1 rounded-md shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/*  Edit Plan */}
              <div
                className="py-1 cursor-pointer text-text hover:bg-primary "
                onClick={() => {
                  handleEditPlan(plan.plan_id);
                }}
              >
                <div className="flex items-center px-4 gap-2 py-2 text-sm">
                  <HiPencil size={16} className="mr-2 text-text" />
                  Edit Plan
                </div>
              </div>

              {/* Delete Plan */}
              <div
                className="py-1 cursor-pointer text-text hover:bg-primary"
                onClick={() => {
                  handleDeletePlan(plan.plan_id);
                }}
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="flex items-center px-4 py-2 gap-4 text-sm text-text">
                    <HiTrash size={16} className="mr-2 ml-4" />
                    Delete Plan
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 mx-2 border-l-4 border-l-border pl-4 py-2 bg-surface shadow-lg rounded-md">
        <h2 className="text-text mb-2 text-3xl font-bold">
          {new Intl.NumberFormat(window.navigator.language, {
            style: "currency",
            currency: currencyCode,
            minimumFractionDigits: 0,
          }).format(currentPricing?.price_value)}
          <span className="ml-3 text-base font-semibold text-primary">
            per {isYearly ? 'year' : 'month'}
          </span>
        </h2>
        <p className="text-text mb-2 font-medium text-md">
          Duration: {currentPricing.duration_days} Days
        </p>
        <p className="text-text mb-2 font-medium text-md">
          Credits Allocated: {displayCredits}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text mb-2 mt-4">
          Features:
        </h4>
        <ul className="list-disc list-inside text-text space-y-1">
          {displayFeatures?.map((feature, featureIndex) => (
            <li key={featureIndex} className="text-md">
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PricingPlanCard = ({ isStripeConnected, plans, handleEditPlan, stripeStatus, onReorder }) => {

  const [openPlanActionId, setOpenPlanActionId] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, error, deletePlan } = usePricingApi();

  const { auth } = useAuthContext();
  const currencyCode = getCurrencyCode(auth?.country) || stripeStatus?.currency || "pkr";

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { mutateAsync: deletePlanMutation } = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
    },
    onSettled: () => {
      queryClient.invalidateQueries(["pricing"]);
    },
  });

  const toggleActionMenu = (planId) => {
    setOpenPlanActionId(openPlanActionId === planId ? null : planId);
  };
  const handleToggle = () => setIsYearly(!isYearly);

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
    setOpenPlanActionId(null);
  }

  const ToggleSwitch = () => (
    <div className="flex items-center justify-center space-x-4 mb-8 bg-background p-2 rounded-full shadow-inner w-fit mx-auto">
      <span className={`text-sm font-semibold transition-colors duration-200 ${!isYearly ? 'text-primary' : 'text-surface '}`}>
        Monthly
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={isYearly} onChange={handleToggle} />
        <div className="w-11 h-6 bg-surface peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary :ring-primary rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
      <span className={`text-sm font-semibold transition-colors duration-200 ${isYearly ? 'text-primary' : 'text-secondary'}`}>
        Yearly
      </span>
    </div>
  );

  if (plans?.length == 0 && isStripeConnected) {
    return (
      <p className="mt-10 flex justify-center items-center">Add New Plans</p>
    )
  }

  if (!isStripeConnected) {
    return (
      <p className="flex justify-center items-center text-text mt-20">Connect Stripe to Add New Plans</p>
    )
  }

  // Filter plans to only include those with valid pricing data
  const validPlans = plans?.filter((plan) => {
    const currentPricing = isYearly
      ? plan.plan_details?.yearly
      : plan.plan_details?.monthly;
    return currentPricing !== null && currentPricing !== undefined;
  }) || [];

  return (
    <div className="p-6">
      <ToggleSwitch />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorder}
      >
        <SortableContext
          items={validPlans.map((plan) => plan.plan_id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {validPlans.map((plan) => (
              <SortableItem
                key={plan.plan_id}
                plan={plan}
                isYearly={isYearly}
                currencyCode={currencyCode}
                openPlanActionId={openPlanActionId}
                toggleActionMenu={toggleActionMenu}
                handleEditPlan={handleEditPlan}
                handleDeletePlan={handleDeletePlan}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PricingPlanCard;