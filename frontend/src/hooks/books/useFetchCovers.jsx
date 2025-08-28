import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";
import { useState } from "react";

export const useCoverActions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Cover
  const addCover = async (data) => {
    setIsLoading(true);
    setError(null);

    // console.log(data, "Cover name");
    
    try {
      const response = await fetch(`${BASE_URL}/covers/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({name:data}),
      });

      const result = await response.json(); //response?.data;
      console.log(result, "Cover Save Result");
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


  return { isLoading, error, message, addCover };
};

// API CALL to FETCH TYPES OF BOOK COVERS

const fetchCovers = async ({ signal }) =>
  await fetch(`${BASE_URL}/covers`, { signal, credentials: "include" })
    .then((res) => {
        // console.log(res,"Covers fetched")
      if (!res.ok) {
        throw new Error("Couldn't fetch Types of COVERS for books");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err, "error fetching covers types"));

export const useFetchCovers = () => {
  return useQuery({
    queryKey: ["covers"],
    queryFn: fetchCovers,
  });
};
