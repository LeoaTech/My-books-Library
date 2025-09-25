import { lazy, Suspense, useState } from 'react'
import { HiPlus } from 'react-icons/hi'
import Loader from '../../components/_admin/Loader/Loader'
import { useFetchPricingPlans } from '../../hooks/settings/useFetchPricing';
const PricingPlanCard = lazy(() => import('../../components/_admin/Settings/PricingPlans/PricingPlanCard'));
const PricingPlanForm = lazy(() => import('../../components/_admin/ui/Modal/PricingSettings/PricingPlanForm'));

const PricingSettings = () => {
    const [showModal, setShowModal] = useState(false)
    const { data: pricingPlans, isLoading } = useFetchPricingPlans()
    const [editPlan, setEditPlan] = useState(false)
    const [values, setValues] = useState(null);

    // Edit a Plan Details
    const editPlanDetails = (planId) => {
        const activePlan = pricingPlans.plans?.find((plan) => plan?.plan_id == planId);
        setValues(activePlan);
        setEditPlan(!editPlan);
    };
    if (isLoading) {
        return (
            <Loader />
        )
    }


    return (
        <div>
            <h1 className="m-5 text-lg md:text-2xl text-[#8A99AF]">Pricing Plan Settings</h1>
            <div className="flex justify-end items-end mb-2">
                <button
                    className=" bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                    type="button"
                    onClick={() => setShowModal(true)}
                >
                    <span className="flex justify-center items-center gap-1 lg:gap-2">
                        <HiPlus /> New Pricing Plan
                    </span>
                </button>
            </div>

            <PricingPlanCard plans={pricingPlans.plans} handleEditPlan={editPlanDetails} />

            {/* Add New Plan Details */}
            {showModal && <Suspense fallback={<Loader />}>
                <PricingPlanForm
                    setOpenModal={setShowModal}
                />
            </Suspense>}

            {/* Edit Plan Details */}
            {editPlan && <Suspense fallback={<Loader />}>
                <PricingPlanForm
                    setOpenModal={setEditPlan}
                    plan={values}
                />
            </Suspense>}
        </div>
    )
}

export default PricingSettings