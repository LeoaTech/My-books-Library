import { useState } from "react";
import { BASE_URL } from "../../utils/baseAPIURL";
import { toast } from "react-toastify";

export const usePricingApi = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const createPlan = async (plan) => {
    const toastId = toast.loading("Creating Plan");

    setIsLoading(true);
    setError(null);

    // console.log(plan, "PlanId");
    const response = await fetch(`${BASE_URL}/pricing/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(plan),
    });

    // console.log(response, "Plans Form Response");

    const result = await response.json(); //response?.data;
    // console.log(result, "Result");

    if (!response.ok) {
      setIsLoading(false);
      setError(response?.message || "Failed to Create New Plan ");
      toast.update(toastId, {
        render: `Error: ${response?.message || "Failed to Save Plan details"}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    } else {
      toast.update(toastId, {
        render: "New Plan created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
      }
    }
  };



  return { createPlan, error, isLoading};
};
