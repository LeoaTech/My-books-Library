import React, { lazy, Suspense } from 'react'
import DashboardSB from '../../../components/_user/Profile/DashboardSB';
import { useFetchTransactions } from '../../../hooks/settings/useFetchTransactions';
import Loader from '../../../components/_user/Loader/Loader';
const BillingHistory = lazy(() => import('../../../components/_admin/Account/BillingHistory'));
import { useAuthContext } from '../../../hooks/useAuthContext';
import { getCurrencyCode } from '../../../utils/currencyUtils';

const UserTransactionPage = () => {
    const { auth } = useAuthContext();
    const currencyCode = getCurrencyCode(auth?.country) || "usd";
    const { data: transactions, isLoading } = useFetchTransactions();

     if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-500">
                <Loader/>
                <p className='mt-2'> please wait....</p>
            </div>
        );
    }
     if (!transactions || transactions?.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                You have no billing history.
            </div>
        );
    }
    return (
        <div className="bg-slate-200 flex h-screen">
            {/* <!-- Sidebar --> */}
            <DashboardSB />

            <div className="flex h-full w-full flex-col">
                {/* <!-- Navbar --> */}
                <header className="relative flex flex-col items-center bg-white px-4 py-4 shadow sm:flex-row md:h-20">
                    <div className="flex w-full flex-col justify-between overflow-hidden transition-all sm:max-h-full sm:flex-row sm:items-center">
                        <div className="relative ml-10 flex items-center justify-between rounded-md sm:ml-auto">
                            <svg
                                className="absolute left-2 block h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" className=""></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65" className=""></line>
                            </svg>
                            <input
                                type="name"
                                name="search"
                                className="h-12 w-full rounded-md border border-gray-100 bg-gray-100 py-4 pr-4 pl-12 shadow-sm outline-none focus:border-blue-500"
                                placeholder="Search for anything"
                            />
                        </div>

                        <ul className="mx-auto mt-4 flex space-x-6 sm:mx-5 sm:mt-0">
                            <li className="">
                                <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </button>
                            </li>
                            <li className="">
                                <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </button>
                            </li>
                            <li className="">
                                <button className="flex h-8 w-8 items-center justify-center rounded-xl border text-gray-600 hover:text-black hover:shadow">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </div>
                </header>

                {/* <!-- Main --> */}
                <div className="h-full overflow-hidden pl-10">
                    <div className="h-full overflow-auto px-4 py-10">
                        <Suspense fallback={<Loader />}>
                            <BillingHistory transactions={transactions} currencyCode={currencyCode} />
                        </Suspense>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default UserTransactionPage