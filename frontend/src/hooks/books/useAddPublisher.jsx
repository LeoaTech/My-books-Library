import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const usePublisher = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const addPublisher = async (name) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/publishers/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: name }),
    });

    const result = await response.json(); //response?.data;
    // console.log(result, "Result to Create a new publisher");
  };

  return { isLoading, error, addPublisher };
};
