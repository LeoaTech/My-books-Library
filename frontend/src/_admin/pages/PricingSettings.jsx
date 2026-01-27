import { lazy, Suspense, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import Loader from '../../components/_admin/Loader/Loader'
import { useFetchPricingPlans } from '../../hooks/settings/useFetchPricing';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFetchUserPaymentMethod } from '../../hooks/users/useFetchPaymentMethodDetails';
import { Link } from 'react-router-dom';
const PricingPlanCard = lazy(() => import('../../components/_admin/Settings/PricingPlans/PricingPlanCard'));
const PricingPlanForm = lazy(() => import('../../components/_admin/ui/Modal/PricingSettings/PricingPlanForm'));

const PricingSettings = () => {
    const [showModal, setShowModal] = useState(false)
    const { data: pricingPlans, isLoading } = useFetchPricingPlans()
    const [editPlan, setEditPlan] = useState(false)
    const [values, setValues] = useState(null);
    const { auth } = useAuthContext();
    const entityId = auth?.entityId;

    const { data: stripeStatus, isLoading: isStripeLoading } = useFetchUserPaymentMethod(entityId);

    // Edit a Plan Details
    const editPlanDetails = (planId) => {
        const activePlan = pricingPlans.plans?.find((plan) => plan?.plan_id == planId);
        setValues(activePlan);
        setEditPlan(!editPlan);
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
                <h1 className="m-5 text-lg md:text-2xl text-[#8A99AF]">Pricing Plan Settings</h1>
                <div className="flex justify-end items-end mb-2">
                    {isStripeConnected ? (
                        <button
                            className=" bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
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
                            to="/dashboard/profile"
                            className=" bg-[#000] text-white active:bg-[#333] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                        >
                            <span className="flex justify-center items-center gap-1 lg:gap-2">
                                Connect Stripe Account
                            </span>
                        </Link>
                    )}
                </div>

                <PricingPlanCard isStripeConnected={isStripeConnected} plans={pricingPlans.plans} handleEditPlan={editPlanDetails} />

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