import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";
import { toast } from "react-toastify";

export const useBookingApi = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const createBooking = async (booking) => {
    const toastId = toast.loading("Creating Booking")

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

    // console.log(response, "Bookings Form Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    if (!response.ok) {
      setIsLoading(false)
      setError(response?.message || "Failed to Create New Booking ");
      toast.update(toastId, {
        render: `Error: ${response?.message || "Failed to Save Booking details"}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    } else {
      toast.update(toastId, {
        render: 'New Booking created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
      }
    }
  }

  const updateBooking = async (booking) => {
    const toastId = toast.loading("Updating Booking...")

    setIsLoading(true);
    setError(null);
    // console.log(booking, "BookingId");
    const response = await fetch(`${BASE_URL}/bookings/update/${booking.booking_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bookingForm: booking }),
    });

    // console.log(response, "Bookings Update Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Update Booking details Result");

    if (!response.ok) {
      setIsLoading(false)
      setError(response?.message || "Failed to Update Booking ");
      toast.update(toastId, {
        render: `Error: ${response?.message || "Failed to Update Booking details"}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
      return;
    } else {
      toast.update(toastId, {
        render: 'Booking details updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
      }
    }
  }

  const deleteBooking = async (bookingId) => {
    const toastId = toast.loading("Deleting Booking details..")

    setIsLoading(true);
    setError(null);
    // console.log(bookingId, "Booking Delete");
    const response = await fetch(`${BASE_URL}/bookings/delete/${bookingId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // console.log(response, "Booking Delete Response");
    if (!response.ok) {
      toast.update(toastId, {
        render: `Error: ${response?.message || "Failed to Delete Booking details"}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
      return;
    } else {
      toast.update(toastId, {
        render: 'Booking details deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      const result = await response.json(); //response?.data;
      setIsLoading(false)
      // console.log(result, "delete Result");
    }
  };

  return { createBooking, error, isLoading, updateBooking, deleteBooking }
}
