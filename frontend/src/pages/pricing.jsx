import React, { useState } from 'react';
import { BASE_URL } from '../utils/baseAPIURL';
import { useAuthContext } from '../hooks/useAuthContext';
import { useFetchCurrentPlan } from '../hooks/current_plan/useFetchCurrentPlan';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from "../components/_user/Navbar/Navbar"
import Banner from '../components/main/Banner';

const content = {
    pricing: {
        badge: "Fair & Simple Pricing",
        title: "Choose the Right Plan for You",
        subtitle: "Select the perfect plan that fits your needs.",
        billingToggle: {
            monthly: "Monthly",
            yearly: "Yearly",
        },
        plans: [
            {
                name: "Free",
                description: "Perfect for individuals and small teams getting started.",
                monthlyPrice: "$0",
                yearlyPrice: "$0",
                // billedText: "Billed as $180 per year",
                billingPeriod: "/ month",
                popular: false,
                features: [
                    "5 Users can join library",
                    "15 books can add in library",
                    "24/7 Email Support",
                    "10GB Storage",
                ],
            },
            {
                name: "Pro",
                description: "Ideal for growing businesses that need more power.",
                monthlyPrice: "$269",
                monthly_price_id: "price_1SJ4c7Cs7Tavj7Ojkc3GZ9li",

                yearlyPrice: "$2599",
                yearly_price_id: "price_1SJ4eKCs7Tavj7Ojzfgpw9ip",
                billedText: "Billed as $2599 per year",
                billingPeriod: "/ month",
                popular: true,
                features: [
                    "Unlimited Projects",
                    "Advanced Analytics",
                    "Priority Phone & Email Support",
                    "100GB Storage",
                    "Team Collaboration Tools",
                ],
            },
            {
                name: "School",
                description: "For large institutes with custom requirements.",
                dailyPrice: "$100",
                daily_price_id: "price_1SKuudCs7Tavj7OjkEKgu4P7",
                monthlyPrice: "$279",
                monthly_price_id: "price_1SKus6Cs7Tavj7Oj6Hp5TflC",
                yearlyPrice: "$1999",
                yearly_price_id: "price_1SKutiCs7Tavj7Oj2vm0somu",
                billedText: "Billed as $1999 per year",
                billingPeriod: "/ month",
                popular: false,
                features: [
                    "Everything in Pro",
                    "Dedicated Account Manager",
                    "Custom Integrations",
                    "SLA & Security Reviews",
                    "24/7/365 Premium Support",
                ],
            },
        ],
        faq: {
            title: "Frequently Asked Questions",
            items: [
                {
                    question: "Can I change my plan later?",
                    answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time from your account dashboard. Prorated charges or credits will be applied automatically.",
                },
                {
                    question: "Is there a free trial available?",
                    answer: "We offer a 30-day money-back guarantee on all our plans. If you're not satisfied for any reason, just let us know, and we'll issue a full refund.",
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards, including Visa, Mastercard, and American Express. We also support payments through PayPal.",
                },
                {
                    question: "Do you offer discounts for non-profits or students?",
                    answer: "Yes, we offer special discounts for non-profit organizations and educational institutions. Please contact our sales team with your details to learn more about our special pricing.",
                },
            ],
        },
    },
};

const CheckIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M20 6 9 17l-5-5" />
    </svg>
);


const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);
    const queryClient = useQueryClient();
    const [isChangingPlan, setIsChangingPlan] = useState(false);



    const { auth } = useAuthContext()
    const { data: currentPlan } = useFetchCurrentPlan(auth);

    const activeSubscription = currentPlan?.isActive;
    const subscriptionExpiredAt = `${new Date(currentPlan?.subscription?.currentPeriodEnd).toDateString()} at ${new Date(currentPlan?.subscription?.currentPeriodEnd).toLocaleTimeString()}`;

    const isCancelledAtPeriodEnd = currentPlan?.subscription?.cancelAtPeriodEnd
    
    
    // Activate PAID PLAN fisrt time create Subscription
    const handleCreateCheckoutSession = async (priceId, planName) => {
        try {
            const response = await fetch(`${BASE_URL}/create-checkout-session`, {
                method: 'POST',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId, planName }),
            });

            const session = await response.json();
            // Redirect the user to the Stripe Checkout page
            window.location.href = session.url;

        } catch (error) {
            console.error("Error creating checkout session:", error);
            // Hide spinner and show an error message
        }
    }
    
    // Activate: Change PAID PLAN
    const handleChangePlan = async (newPriceId, planName) => {
        if (isChangingPlan) return;
        setIsChangingPlan(true);
        try {
            const response = await fetch(`${BASE_URL}/change-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ newPriceId: newPriceId, planName, userId: auth?.userId || auth?.id })
            });

            if (!response.ok) {
                throw new Error('Failed to change plan.');
            }
            console.log(response, "Plan Changed Successfully");

            // console.log(`Your ${planName} plan has been activated!`);
            queryClient.invalidateQueries(['current-plan'])
            console.log('Plan change initiated successfully! Your plan will update shortly.');
            window.location.reload(); // Simple way to reflect the change
        } catch (error) {
            console.error('Failed to change plan:', error);
            alert('There was an error changing your plan.');
        } finally {
            setIsChangingPlan(false);
        }
    };

    // Activate: FREE PLAN OR Cancel A Subscription
    const handleCancelSubscription = async () => {
        if (!window.confirm("Are you sure you want to cancel your subscription?")) {
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error('Failed to activate plan.');
            }
            console.log(response, "Cancelled Subscription");

            queryClient.invalidateQueries(['current-plan']);
            console.log('Your subscription has been scheduled for cancellation.');
            // window.location.reload(); // Refresh to show the new state
        } catch (error) {
            // alert('Failed to cancel subscription.');
            console.log(error, "Cancel Subscription error")
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
            <Navbar />

            <main className="flex-1">
                <section className="py-20 px-4">

                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12">
                            <span className="border border-gray-300 rounded-full px-4 py-1 text-sm font-medium text-gray-600 mb-4 inline-block">
                                {content.pricing.badge}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                                {content.pricing.title}
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {content.pricing.subtitle}
                            </p>
                        </div>

                        {activeSubscription && isCancelledAtPeriodEnd && <Banner date={subscriptionExpiredAt} planName={currentPlan?.subscription?.planName} />
                        }

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                                {content.pricing.billingToggle.monthly}
                            </span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800"
                                role="switch"
                                aria-checked={isYearly}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${isYearly ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                                {content.pricing.billingToggle.yearly}
                            </span>

                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {content.pricing.plans.map((plan, index) => {
                                const finalPriceId = isYearly ? plan?.yearly_price_id : plan?.monthly_price_id;
                                const isCurrentPlan = currentPlan?.isActive ? currentPlan?.subscription?.stripePriceId == finalPriceId : null;
                                return (
                                    <div
                                        key={index}
                                        className={`relative bg-white border rounded-xl flex flex-col ${plan.popular ? 'border-indigo-500 shadow-xl scale-105' : 'border-gray-200 shadow-md'}`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-8 flex-grow">
                                            <h2 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h2>
                                            <p className="text-gray-600 mb-6">{plan.description}</p>

                                            <div className="mb-8">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        {isYearly
                                                            ? (plan.yearlyPrice === "$0"
                                                                ? "$0"
                                                                : `$${Math.round(parseInt(plan.yearlyPrice.replace(/[^0-9]/g, '')) / 12).toLocaleString()}`)
                                                            : plan.monthlyPrice}
                                                    </span>
                                                    {plan.billingPeriod && (
                                                        <span className="text-gray-500">{plan.billingPeriod}</span>
                                                    )}
                                                </div>
                                                {isYearly && plan.monthlyPrice !== "$0" && plan.monthlyPrice !== "Custom" && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Billed as {plan.yearlyPrice} per year
                                                    </p>
                                                )}
                                            </div>

                                            <ul className="space-y-4">
                                                {plan.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-start gap-3">
                                                        <CheckIcon className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="p-8 pt-0 mt-auto">

                                            {plan.name === "Free" ? <button
                                                onClick={handleCancelSubscription}
                                                disabled={!activeSubscription}
                                                className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors duration-200 ${!activeSubscription
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-white text-indigo-500 border border-indigo-500 hover:bg-indigo-50'
                                                    }`}
                                            >
                                                {activeSubscription ? "Downgrade to Free" : "Your Current Plan"}
                                            </button> : <button
                                                onClick={() => {
                                                    if (isCurrentPlan) {
                                                        return;
                                                    }
                                                    if (activeSubscription) {
                                                        handleChangePlan(finalPriceId, plan?.name);
                                                    }
                                                    else {
                                                        handleCreateCheckoutSession(finalPriceId, plan?.name);
                                                    }
                                                }}
                                                disabled={isCurrentPlan}
                                                className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-colors duration-200 ${plan.popular
                                                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                                                    : 'bg-white text-indigo-500 border border-indigo-500 hover:bg-indigo-50'
                                                    }`}
                                            >
                                                {currentPlan?.subscription?.stripePriceId === finalPriceId ? "Subscribed" : activeSubscription ? "Change Plan" : "Get Started"}
                                            </button>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
};

export default Pricing;
