import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../utils/baseAPIURL';

const BookingsList = ({ bookings }) => {
    const [payingBookKey, setPayingBookKey] = useState(null);

    // Fine Payment on Stripe
    const handlePayFine = async (bookingId, fineAmount, bookTitle, entityId) => {
        if (payingBookKey) return;

        const currentKey = `${bookingId}-${bookTitle}`;
        setPayingBookKey(currentKey);
        const toastId = toast.loading("Initiating payment...");

        try {
            const response = await fetch(`${BASE_URL}/create-fine-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    bookingId,
                    fineAmount,
                    bookTitle,
                    targetEntityId: entityId
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || "Failed to create payment session");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            toast.update(toastId, {
                render: error.message || "Payment initiation failed",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
            setPayingBookKey(null);
        }
    };

    if (!bookings || !bookings?.bookings || bookings?.bookings?.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                You have no active bookings.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <h1 className="p-4 mt-2 text-2xl font-bold text-gray-800 mb-4">Your Bookings</h1>
            {bookings?.bookings?.map((booking) => (
                <div key={booking.booking_id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                    <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500">Booking ID: <span className="font-semibold text-gray-700">#{booking?.booking_id}</span></p>
                            <p className="text-xs text-gray-400">Placed on: {booking?.created_at ? format(new Date(booking?.created_at), 'MMM dd, yyyy') : 'N/A'}</p>
                            <p className="text-xs text-gray-600">Shipping to: {booking?.shipping_address || 'N/A'}</p>

                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                ${booking.booking_status === 'active' ? 'bg-green-100 text-green-800' :
                                    booking.booking_status === 'overdue' ? 'bg-red-100 text-red-800' :
                                        booking.booking_status === 'returned' ? 'bg-blue-100 text-blue-800' :
                                            'bg-indigo-300 text-gray-800'}`}>
                                {booking.booking_status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Items in this Booking</h3>
                        <div className="space-y-4">
                            {booking.items && booking.items.map((item, index) => {
                                const fineAmount = parseFloat(item.overdue_fine || 0);
                                const isOverdue = item.status === 'overdue';
                                const isReturned = item.status === 'returned';
                                const itemKey = `${booking.booking_id}-${item.title}`;

                                return (
                                    <div key={item.title} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 rounded border border-gray-100 shadow-sm">
                                        <div className="mb-2 sm:mb-0">
                                            <p className="font-medium text-gray-800">{item.title}</p>
                                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                                <p>Due: <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                                                    {item.return_due ? format(new Date(item.return_due), 'MMM dd, yyyy') : 'N/A'}
                                                </span></p>
                                                {item.return_date && <p>Returned: {format(new Date(item.return_date), 'MMM dd, yyyy')}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            <span className={`text-xs px-2 py-1 rounded capitalize 
                                                ${item.status === 'issued' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                                    item.status === 'returned' ? 'bg-green-50 text-green-700 border border-green-100' :
                                                        item.status === 'overdue' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                            'bg-gray-50 text-gray-600'}`}>
                                                {item.status}
                                            </span>

                                            {fineAmount > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <div className="text-right">
                                                        <p className="text-xs text-red-600 font-bold">Fine: ${fineAmount.toFixed(2)}</p>
                                                    </div>
                                                    <button
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        onClick={() => handlePayFine(booking.booking_id, fineAmount, item.title, booking.entity_id)}
                                                        disabled={payingBookKey !== null}
                                                    >
                                                        {payingBookKey === itemKey ? "Processing..." : "Pay Now"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingsList;