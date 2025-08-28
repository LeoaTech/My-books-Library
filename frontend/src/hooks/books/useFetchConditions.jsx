import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useConditionActions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Condition
  const addConditionType = async (data) => {
    setIsLoading(true);
    setError(null);

    console.log(data, "Condition name");
    
    try {
      const response = await fetch(`${BASE_URL}/conditions/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({name:data}),
      });

      const result = await response.json(); //response?.data;
      console.log(result, "Condition Save Result");
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


  return { isLoading, error, message, addConditionType };
};


// API CALL to FETCH CONDITIONS TYPES FOR BOOKS

const fetchConditions = async ({ signal }) =>
  await fetch(`${BASE_URL}/conditions`, { signal, credentials: "include" })
    .then((res) => {
        // console.log(res,"Conditions fetched")
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
