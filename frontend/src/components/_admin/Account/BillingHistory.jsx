import React from 'react';
import { FiDownload, FiAlertCircle } from 'react-icons/fi';

const BillingHistory = ({ transactions, currencyCode }) => {
    return (
        <div className="bg-surface shadow-md rounded-lg p-6 border border-border mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-text">Billing History</h2>
                
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full p-5 bg-background text-left text-sm">
                    <thead className="bg-secondary text-text uppercase font-medium">
                        <tr className='border-b border-primary bg-secondary'>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">Description</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                        {!transactions || transactions.length === 0 ? (
                            <tr className='border-b hover:bg-surface hover:text-secondary'>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    No billing history available.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="border-b hover:bg-surface hover:text-secondary transition-colors">
                                    <td className="px-6 py-4 text-text whitespace-nowrap">
                                        {new Date(tx.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 text-text">
                                        Pro Plan – Monthly
                                    </td>
                                    <td className="px-6 py-4 font-medium text-text">
                                        {new Intl.NumberFormat(window.navigator.language, {
                                            style: "currency",
                                            currency: currencyCode || 'USD',
                                        }).format(tx.amount_paid / 100)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                            ${tx.status === 'paid' || tx.status === 'succeeded'
                                                ? 'bg-secondary text-green-700 '
                                                : 'bg-primary text-text '}
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
                                                className="inline-flex items-center gap-1 text-sm font-medium text-text hover:text-primary  transition-colors"
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
