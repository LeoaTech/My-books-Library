import { useState } from "react";
import { BASE_URL } from "../../utils/baseAPIURL";

export const useCategoryActions = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Category
  const addCategory = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/categories/new`, {
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
  /* Update Category Details */

  const updateCategory = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/categories/update/${data.id}`, {
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


  /* Delete an Category */

  const deleteCategory = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/categories/remove/${data}`, {
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

  return { isLoading, error, message, addCategory, updateCategory, deleteCategory };
};
