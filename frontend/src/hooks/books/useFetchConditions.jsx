import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BASE_URL } from "../../utils/baseAPIURL";

export const useConditionActions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Condition
  const addConditionType = async (data) => {
    setIsLoading(true);
    setError(null);


    try {
      const response = await fetch(`${BASE_URL}/conditions/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: data }),
      });

      const result = await response.json(); //response?.data;
      setError(null);
      setMessage(result.message);
      return result;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  };
  /* Update Authors Details */

  const updateCondition = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/conditions/update/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: data.name }),
      });

      const result = await response.json(); //response?.data;
      setError(null);
      setMessage(result.message);
      return result;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  };


  /* Delete an Condition */

  const deleteCondition = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/conditions/remove/${data}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json(); //response?.data;
      setError(null);
      setMessage(result.message);
      return result;
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  };

  return { isLoading, error, message, addConditionType, updateCondition, deleteCondition };
};


// API CALL to FETCH CONDITIONS TYPES FOR BOOKS

const fetchConditions = async ({ signal }) =>
  await fetch(`${BASE_URL}/conditions`, { signal, credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch Book condition types");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchConditions = () => {
  return useQuery({
    queryKey: ["conditions"],  //keys
    queryFn: fetchConditions,
  });
};
