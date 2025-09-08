import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

export const useAuthor = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  // Create New Author
  const addAuthor = async (data) => {
    setIsLoading(true);
    setError(null);

    // console.log(data, "Author name");
    
    try {
      const response = await fetch(`${BASE_URL}/authors/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ authorsForm: data }),
      });

      const result = await response.json(); //response?.data;
      console.log(result, "Author Save Result");
      return {success:true, data:result?.authors, message:result.message}
      // setError(null);
      // setMessage(result.message);
      // return result;
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  };
  /* Update Authors Details */

  const updateAuthor = async (data) => {
    setIsLoading(true);
    setError(null);
    // console.log(data,"Update Author");
    
    try {
      const response = await fetch(`${BASE_URL}/authors/update/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ authorsForm: data }),
      });

      const result = await response.json(); //response?.data;
      // console.log(result, "Author updated Result");
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


  /* Delete an Author */

  const deleteAuthor = async (data) => {
    setIsLoading(true);
    setError(null);
console.log(data);

    try {
      const response = await fetch(`${BASE_URL}/authors/remove/${data}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // body: JSON.stringify(authorsID: data }),
      });

      const result = await response.json(); //response?.data;
      console.log(result, "Author deleted Result");
      setError(null);
      setMessage(result.message);
      return result;
    } catch (error) {
      console.log(error);
      setError(error.message);
      setMessage(error.detail)
    } finally {
      setIsLoading(false)
    }
  };

  return { isLoading, error, message, addAuthor ,updateAuthor, deleteAuthor};
};
