import { useState } from "react";
import { BASE_URL } from "../../utils/baseAPIURL";

export const usePublisher = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  /* Create New Publisher */
  const addPublisher = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/publishers/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publishersForm: data }),
      });

      const result = await response.json(); //response?.data;
      // console.log(result, "Result to Create a new publisher");
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


  /* Update Publisher Details */

  const updatePublisher = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/publishers/update/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publishersForm: data }),
      });

      const result = await response.json(); //response?.data;
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


  /* Delete a Publisher */

  const deletePublisher = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/publishers/remove/${data}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const result = await response.json(); //response?.data;
      // console.log(result, "Author deleted Result");
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
  return { isLoading, error, addPublisher, updatePublisher, deletePublisher, message };
};
