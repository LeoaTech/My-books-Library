import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useAuthor = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const addAuthor = async (name) => {
    setIsLoading(true);
    setError(null);
    console.log("Form Reached");

    const response = await fetch(`${BASE_URL}/authors/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({name:name}),
    });

    console.log(response, "Authors Add Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Result");
  };

  return { isLoading, error, message, addAuthor };
};
