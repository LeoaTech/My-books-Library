import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";
import { useState } from "react";
import { toast } from "react-toastify";

export const useBranchActions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Branch
  const addBranch = async (data) => {
    setIsLoading(true);
    setError(null);

    console.log(data, "Branch name");

    try {
      const response = await fetch(`${BASE_URL}/branches/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ branchData: data }),
      });

      const result = await response.json(); //response?.data;
      console.log(result, "Branch Save Result");
      setError(null);
      setMessage(result.message);
      return result;
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  };
  /* Update Branch Details */

  const updateBranch = async (data) => {
    setIsLoading(true);
    setError(null);
    // console.log(data, "Updated Form");

    try {
      const response = await fetch(`${BASE_URL}/branches/update/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ branchData: data }),
      });

      const result = await response.json(); //response?.data;
      // console.log(result, "Branch updated Result");
      setError(null);
      setMessage(result.message);
      return result;
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  };


  /* Delete a Branch */

  const deleteBranch = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/branches/remove/${data}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json(); //response?.data;
      // console.log(result, "Branch deleted Result");
      setError(null);
      setMessage(result.message);
      toast.error(result.message, {
        position:"bottom-center",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: true,
        theme: "dark",
      })
      return result;
    } catch (error) {
      console.log(error);
      setError(error.message);
      setMessage(error.message);
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  };

  return { isLoading, error, message, addBranch, updateBranch, deleteBranch };
};

//  Get All Branches of an Entity

const fetchBranches = async ({ signal }) =>
  await fetch(`${BASE_URL}/branches`, { signal, credentials: "include" })
    .then((res) => {
      // console.log(res, "branches fetched");
      if (!res.ok) {
        throw new Error("Couldn't fetch branches");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });
};
