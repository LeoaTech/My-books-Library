import React from 'react';
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

const BillingHistory = ({ transactions, currencyCode }) => {
    return (
        <div className="bg-white dark:bg-[#24303F] shadow-md rounded-lg p-6 border dark:border-[#2E3A47] mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Billing History</h2>
                <button className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                    Filter
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
                        <path d="M3.33331 4H12.6666M5.33331 8H10.6666M7.33331 12H8.66665" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-[#24303F]">
                        {!transactions || transactions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No billing history available.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-200 whitespace-nowrap">
                                        {new Date(tx.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-200">
                                        Pro Plan – Monthly
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                        {new Intl.NumberFormat(window.navigator.language, {
                                            style: "currency",
                                            currency: currencyCode || 'USD',
                                        }).format(tx.amount_paid / 100)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${tx.status === 'paid' || tx.status === 'succeeded'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
                                        `}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'paid' || tx.status === 'succeeded' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                            <span className="capitalize">{tx.status === 'succeeded' ? 'Paid' : tx.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {tx.invoice_pdf ? (
                                            <a
                                                href={tx.invoice_pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                                            >
                                                Download Invoice <FiDownload />
                                            </a>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-sm text-gray-400 italic cursor-not-allowed">
                                                No Action <FiAlertCircle />
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BillingHistory;
