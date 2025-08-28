import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useCategoryActions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Category
  const addCategory = async (data) => {
    setIsLoading(true);
    setError(null);

    // console.log(data, "Category name");
    
    try {
      const response = await fetch(`${BASE_URL}/categories/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({name:data}),
      });

      const result = await response.json(); //response?.data;
      console.log(result, "Category Save Result");
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
 

  return { isLoading, error, message, addCategory };
};
