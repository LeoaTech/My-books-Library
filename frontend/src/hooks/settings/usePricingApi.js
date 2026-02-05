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

    const response = await fetch(`${BASE_URL}/pricing/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(plan),
    });


    const result = await response.json(); //response?.data;

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
    const response = await fetch(`${BASE_URL}/pricing/update/${plan.plan_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(plan),
    });


    const result = await response.json(); //response?.data;

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
    const response = await fetch(`${BASE_URL}/pricing/delete/${planId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });


    const result = await response.json();

    if (!response.ok) {
      toast.update(toastId, {
        render: `Error: ${result?.message || "Failed to Delete Plan"}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setIsLoading(false);

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
    }
  };

  const updatePlanOrder = async (sortData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/pricing/update-order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sortData }),
      });

      const result = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(result?.message || "Failed to update plan order");
        toast.error(result?.message || "Failed to update plan order");
        return;
      }

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      toast.error("Error updating plan order");
    }
  };

  return { createPlan, error, isLoading, updatePlan, deletePlan, updatePlanOrder };
};
