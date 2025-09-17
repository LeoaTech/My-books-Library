import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useBookingApi = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

const createBooking = async (order) => {
    setIsLoading(true);
    setError(null);

    const updatedOrder = {
      shipping_address:order.shipping_address,
      shipping_city:order.shipping_city,
      shipping_country:order.shipping_country,
      shipping_phone:order.shipping_phone,
      items:order.items, 
    }

    // console.log(order, "OrderId");
    const response = await fetch(`${BASE_URL}/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderForm: updatedOrder }),
    });

    console.log(response, "Orders Form Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    if (!response.ok) {
      setIsLoading(false)
      setError(response?.message || "Failed to Create New Order ");
    } else {
      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
      }
    }
  }

  return {createBooking, error, isLoading}
}
