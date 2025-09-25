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
  const updatePlan = async (plan) => {
    const toastId = toast.loading("Updating Plan details...");

    setIsLoading(true);
    setError(null);
    // console.log(plan, "PlanId");
    const response = await fetch(`${BASE_URL}/pricing/update/${plan.plan_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(plan),
    });

    // console.log(response, "Plans Update Response");

    const result = await response.json(); //response?.data;
    // console.log(result, "Update Plan details Result");

    if (!response.ok) {
      setIsLoading(false);
      setError(response?.message || "Failed to Update Plan ");
      toast.update(toastId, {
        render: `Error: ${
          response?.message || "Failed to Update Plan details"
        }`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    } else {
      toast.update(toastId, {
        render: "Plan details updated successfully!",
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

  const deletePlan = async (planId) => {
    const toastId = toast.loading("Deleting Plan details..");

    setIsLoading(true);
    setError(null);
    // console.log(planId, "Plan Delete");
    const response = await fetch(`${BASE_URL}/pricing/delete/${planId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // console.log(response, "Plan Delete Response");
    if (!response.ok) {
      toast.update(toastId, {
        render: `Error: ${
          response?.message || "Failed to Delete Plan"
        }`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      return;
    } else {
      toast.update(toastId, {
        render: "Plan deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      const result = await response.json(); //response?.data;
      setIsLoading(false);
      // console.log(result, "delete Result");
    }
  };


  return { createPlan, error, isLoading, updatePlan, deletePlan};
};
