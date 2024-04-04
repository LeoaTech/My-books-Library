import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useOrdersApi = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  /* Edit Order Details */
  const updateOrder = async (order) => {
    setIsLoading(true);
    setError(null);

    // console.log(order, "OrderId");
    const response = await fetch(`${BASE_URL}/orders/update/${order?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ orderForm: order }),
    });

    console.log(response, "Orders Form Response");

    const result = await response.json(); //response?.data;
    console.log(result, "Result");

    if (response.status === 204) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

 
  return { isLoading, error, updateOrder };
};
