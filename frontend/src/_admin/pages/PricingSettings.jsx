import { lazy, Suspense, useState, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import Loader from '../../components/_admin/Loader/Loader'
import { useFetchPricingPlans } from '../../hooks/settings/useFetchPricing';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetchUserPaymentMethod } from '../../hooks/users/useFetchPaymentMethodDetails';
import { usePricingApi } from '../../hooks/settings/usePricingApi';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { arrayMove } from '@dnd-kit/sortable';
const PricingPlanCard = lazy(() => import('../../components/_admin/Settings/PricingPlans/PricingPlanCard'));
const PricingPlanForm = lazy(() => import('../../components/_admin/ui/Modal/PricingSettings/PricingPlanForm'));

const PricingSettings = () => {
    const [showModal, setShowModal] = useState(false)
    const { data: pricingPlans, isLoading } = useFetchPricingPlans()
    const [editPlan, setEditPlan] = useState(false)
    const [values, setValues] = useState(null);
    const { auth } = useAuthContext();
    const entityId = auth?.entityId;
    const [localPlans, setLocalPlans] = useState([]);
    const { updatePlanOrder } = usePricingApi();
    const queryClient = useQueryClient();
    const subdomain = auth?.subdomain;

    const { data: stripeStatus, isLoading: isStripeLoading } = useFetchUserPaymentMethod(entityId);

    useEffect(() => {
        if (pricingPlans?.plans) {
            setLocalPlans(pricingPlans.plans);
        }
    }, [pricingPlans]);

    // Edit a Plan Details
    const editPlanDetails = (planId) => {
        const activePlan = localPlans?.find((plan) => plan?.plan_id == planId);
        setValues(activePlan);
        setEditPlan(!editPlan);
    };

    // Handle drag and drop of pricing cards
    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const oldIndex = localPlans.findIndex((plan) => plan.plan_id === active.id);
        const newIndex = localPlans.findIndex((plan) => plan.plan_id === over.id);

        const items = arrayMove(localPlans, oldIndex, newIndex);

        setLocalPlans(items);

        const sortData = items.map((plan, index) => ({
            plan_id: plan.plan_id,
            sorting_number: index,
        }));

        // update pricing card order in database
        await updatePlanOrder(sortData);

        queryClient.invalidateQueries(["pricing"]);
    };

    if (isLoading || isStripeLoading) {
        return (
            <Loader />
        )
    }

    if (!auth?.entityId) {
        return (
            <p> No Library ID found</p>
        )
    }

    if (entityId) {
        const isStripeConnected = stripeStatus?.connected === true;

        return (
            <div>
                <h1 className="m-5 text-lg md:text-2xl text-text">Pricing Plan Settings</h1>
                <div className="flex justify-end items-end mb-2">
                    {isStripeConnected ? (
                        <button
                            className=" bg-surface text-text active:bg-primary 
            font-medium rounded shadow hover:bg-primary hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                            type="button"
                            disabled={!entityId}
                            onClick={() => setShowModal(true)}
                        >
                            <span className="flex justify-center items-center gap-1 lg:gap-2">
                                <HiPlus /> New Pricing Plan
                            </span>
                        </button>
                    ) : (
                        <Link
                            to={`/${subdomain}/dashboard/profile`}
                            className="  bg-surface text-text active:bg-primary
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                        >
                            <span className="flex justify-center items-center gap-1 lg:gap-2">
                                Connect Stripe Account
                            </span>
                        </Link>
                    )}
                </div>

                <PricingPlanCard
                    isStripeConnected={isStripeConnected}
                    plans={localPlans}
                    handleEditPlan={editPlanDetails}
                    stripeStatus={stripeStatus}
                    onReorder={handleDragEnd}
                />

                {/* Add New Plan Details */}
                {showModal && <Suspense fallback={<Loader />}>
                    <PricingPlanForm
                        setOpenModal={setShowModal}
                        entityId={entityId}
                    />
                </Suspense>}

                {/* Edit Plan Details */}
                {editPlan && <Suspense fallback={<Loader />}>
                    <PricingPlanForm
                        setOpenModal={setEditPlan}
                        plan={values}
                        entityId={entityId}
                    />
                </Suspense>}
            </div>
        )
    }
}

export default PricingSettings