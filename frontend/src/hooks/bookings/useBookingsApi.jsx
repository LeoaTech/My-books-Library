import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useBookingApi = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const createBooking = async (booking) => {
    setIsLoading(true);
    setError(null);

    const updatedBooking = {
      ...booking,
      shipping_address: booking.shipping_address || "",
      shipping_city: booking.shipping_city || "",
      shipping_country: booking.shipping_country || "",
      shipping_phone: booking.shipping_phone || "",
      items: booking.items,
    }

    // console.log(booking, "BookingId");
    const response = await fetch(`${BASE_URL}/bookings/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bookingForm: updatedBooking }),
    });

    console.log(response, "Bookings Form Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    if (!response.ok) {
      setIsLoading(false)
      setError(response?.message || "Failed to Create New Booking ");
    } else {
      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
      }
    }
  }

  const updateBooking = async (booking) => {
    setIsLoading(true);
    setError(null);



    // console.log(booking, "BookingId");
    const response = await fetch(`${BASE_URL}/bookings/update/${booking.booking_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bookingForm: booking }),
    });

    console.log(response, "Bookings Update Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Update Booking details Result");

    if (!response.ok) {
      setIsLoading(false)
      setError(response?.message || "Failed to Update Booking ");
    } else {
      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
      }
    }
  }

  const deleteBooking = async (bookingId) => {
    setIsLoading(true);
    setError(null);

    // console.log(bookingId, "Booking Delete");
    const response = await fetch(`${BASE_URL}/bookings/delete/${bookingId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // console.log(response, "Booking Delete Response");
    const result = await response.json(); //response?.data;
    setIsLoading(false)
    // console.log(result, "delete Result");
  };

  return { createBooking, error, isLoading, updateBooking, deleteBooking }
}
