import { useState } from "react";
import { useFetchPricingPlans } from "../../hooks/settings/useFetchPricing";
import { HiCheckCircle } from "react-icons/hi";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/_user/Loader/Loader";
import { BASE_URL } from "../../utils/baseAPIURL";
import { useFetchCurrentPlan } from "../../hooks/current_plan/useFetchCurrentPlan";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const PopularPlanType = {
    NO: 0,
    YES: 1,
}

export const Pricing = () => {
    const { auth } = useAuthContext();
    const { subdomain } = useParams();
    const queryClient = useQueryClient();
    const [isChangingPlan, setIsChangingPlan] = useState(false);


    const { data: pricingPlans, isLoading } = useFetchPricingPlans()

    const { data: currentPlan } = useFetchCurrentPlan(auth);

    // console.log(currentPlan, "Current Plan");
    const activeSubscription = currentPlan?.isActive;
    const subscriptionExpiredAt = `${new Date(currentPlan?.subscription?.currentPeriodEnd).toDateString()} at ${new Date(currentPlan?.subscription?.currentPeriodEnd).toLocaleTimeString()}`;

    const isCancelledAtPeriodEnd = currentPlan?.subscription?.cancelAtPeriodEnd

    const [isYearly, setIsYearly] = useState(false);
    const handleToggle = () => setIsYearly(!isYearly);


    // Switch plan Interval
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

    let sub_domain = auth?.subdomain || subdomain
    // console.log(sub_domain);



    const handleCreateCheckoutSession = async (priceId, planName) => {
        let stripeAccountID = pricingPlans?.plans[0]?.plan_details?.stripe_account_id;
        const checkoutPlanToastId = toast.loading('Redirecting to Stripe Checkout Page...');

        try {
            const response = await fetch(`${BASE_URL}/create-checkout-session`, {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, planName, userType: "customer", stripeAccountID }),
            });

            const session = await response.json();
            // Redirect the user to the Stripe Checkout page
            window.location.href = session.url;

        } catch (error) {
            console.error("Error creating checkout session:", error);
            toast.update(checkoutPlanToastId, {
                render: `Error: ${error.message}` || "Failed to create checkout session for new subscription",
                type: 'error',
                isLoading: false,
                autoClose: 1000,
            });
        }
    }



    if (isLoading) {
        return (
            <Loader />
        )
    }
    if (pricingPlans?.plans?.length == 0) {
        return (
            <div className="flex justify-center items-center h-screen">

                {auth?.role_name == "owner" ?

                    (
                        <div className="items-center">
                            <p>No Plan Found! Please Start Adding Plans for your Library</p>

                            <button
                                className="mt-10 flex justify-center items-center bg-[#758aae] text-white active:bg-[#80CAEE] 
                                       font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                                type="button"
                            >
                                <Link
                                    to="/dashboard/pricingsettings">
                                    Pricing
                                </Link>
                            </button>

                        </div>
                    ) :
                    <p>No Plan Found!</p>}
            </div>

        )
    }
    return (
        <section id='pricing' className='container py-24 px-20 sm:py-32'>

            <ToggleSwitch />



            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {pricingPlans?.plans?.map((pricing) => {
                    const currentPricing = isYearly
                        ? pricing.plan_details?.yearly
                        : pricing.plan_details?.monthly;

                    const displayCredits = isYearly ? pricing?.plan_details?.yearly?.credits_allocated : pricing?.plan_details?.monthly?.credits_allocated;
                    const displayFeatures = pricing?.plan_details?.features;

                    const finalPriceId = isYearly ? pricing?.plan_details?.yearly?.price_id : pricing?.plan_details?.monthly?.price_id;
                    const isCurrentPlan = currentPlan?.isActive ? currentPlan?.subscription?.stripePriceId == finalPriceId : null;

                    if (!currentPricing) return null;

                    return (
                        <li key={pricing.plan_id}
                            className={`${pricing.popular === PopularPlanType.YES ? "bg-purple-300" : "bg-purple-50"}  relative overflow-hidden rounded-lg border border-black shadow-md text-left`
                            } >
                            <div className="mt-8 w-full">
                                <span className="absolute top-0 block h-8 w-full bg-slate-500"></span>
                                <div className="p-5 text-center md:w-full lg:px-5 lg:py-8">
                                    <h3 className="font-serif text-xl font-bold lg:text-2xl lg:leading-7">
                                        {pricing.plan_name}
                                    </h3>
                                    <p className="mt-2 font-sans text-xl font-bold leading-9 lg:text-2xl">
                                        <span className="text-sm ">PKR</span>{currentPricing?.price_value?.toLocaleString()}
                                        <span className="text-base font-semibold text-blue-500 dark:text-blue-300">
                                            / {isYearly ? 'year' : 'month'}
                                        </span>
                                    </p>


                                    <p className="mt-5 mb-4 font-sans text-base lg:text-base lg:leading-6">
                                        {displayCredits} Credits
                                    </p>
                                    {auth?.accessToken ?
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (isCurrentPlan) {
                                                    return;
                                                }

                                                else {
                                                    handleCreateCheckoutSession(finalPriceId, pricing.plan_name)
                                                }
                                            }
                                            }
                                            disabled={isCurrentPlan}
                                            className="mt-5 inline-flex cursor-pointer rounded-full bg-slate-500 px-8 py-2 font-sans text-sm text-white shadow-sm transition hover:translate-y-1 hover:shadow-md hover:shadow-slate-200"
                                        >
                                            {currentPlan?.subscription?.stripePriceId === finalPriceId ? "Subscribed" : activeSubscription ? "Change Plan" : "Buy Now"}
                                        </button> :
                                        <Link to={sub_domain ? `/${sub_domain}/signin` : "/signin"}
                                            className="mt-5 inline-flex cursor-pointer rounded-full bg-slate-500 px-8 py-2 font-sans text-sm text-white shadow-sm transition hover:translate-y-1 hover:shadow-md hover:shadow-slate-200"
                                        >
                                            Login
                                        </Link>}
                                </div>
                                <span className="block w-full border-b"></span>
                                <label htmlFor="viewmore-1">
                                    <input
                                        className="peer hidden"
                                        type="checkbox"
                                        id="viewmore-1"
                                    />
                                    <span className="my-8 mx-auto flex cursor-pointer select-none flex-col items-center text-center normal-case sm:hidden">
                                        View Features
                                        <svg
                                            width="16"
                                            height="7"
                                            viewBox="0 0 16 7"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="block align-middle text-gray-600"
                                        >
                                            <path
                                                d="M15.7 5.67409L8.7 0.214485C8.6 0.13649 8.5 0.0584958 8.4 0.0584958C8.2 -0.0194986 7.9 -0.0194986 7.6 0.0584958C7.5 0.0584958 7.4 0.13649 7.3 0.214485L0.3 5.67409C-0.1 5.98607 -0.1 6.45404 0.3 6.76602C0.7 7.07799 1.3 7.07799 1.7 6.76602L8 1.85237L9 2.63231L14.3 6.76602C14.7 7.07799 15.3 7.07799 15.7 6.76602C16.1 6.45404 16.1 5.98607 15.7 5.67409Z"
                                                fill="currentColor"
                                                className="  "
                                            ></path>
                                        </svg>
                                    </span>
                                    <div className="my-5 hidden px-5 text-center peer-checked:block sm:text-left md:block lg:my-8 lg:px-10">
                                        <ul className="">
                                            {displayFeatures?.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="mb-2">
                                                    <p className="font-sans text-base lg:text-base lg:leading-6">
                                                        <b className="flex justify-start gap-3 items-center"><HiCheckCircle color="green" /> {feature}</b>
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </label>
                            </div>
                        </li>
                    )
                })}
            </div>



        </section>


    );
};
