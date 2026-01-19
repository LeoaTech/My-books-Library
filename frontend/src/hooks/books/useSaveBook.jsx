import { useState } from "react";
import { BASE_URL } from "../../utils/baseAPIURL";

export const useSaveBook = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const addBook = async (booksForm) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/books/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ books: booksForm }),
    });

    const result = await response.json();


    if (response.ok) {
      setIsLoading(false);
      setError(null);
      setMessage(result.message)
      return result;
    }
    else {
      setIsLoading(false);
      setError(result?.error);
      setMessage(result.message || "Something went wrong")
      throw new Error(result.message || "Failed to add book");
    }

  };

  const updateBook = async (book) => {
    setIsLoading(true);
    setError(null);

    // console.log(book, "Update Book");

    const response = await fetch(`${BASE_URL}/books/update/${book?.bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ book: book }),
    });

    const result = await response.json(); //response?.data;
    console.log(result, "Update Book details Result");


    if (response.ok) {
      setIsLoading(false);
      setError(null);
      setMessage(result.message)
      return result;
    }
    else {
      setIsLoading(false);
      setError(result?.error);
      setMessage(result.message || "Something went wrong")
      throw new Error(result.message || "Failed to update book");
    }
  };

  const deleteBook = async (bookId) => {
    setIsLoading(true);
    setError(null);

    console.log(bookId, "Book Delete");
    const response = await fetch(`${BASE_URL}/books/delete/${bookId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // console.log(response, "Book Delete Response");
    const result = await response.json(); //response?.data;
    setIsLoading(false)
    console.log(result, "delete Result");

    if (response.ok) {
      setIsLoading(false);
      setError(null);
      setMessage(result.message)
      return result;
    }
    else {
      setIsLoading(false);
      setError(result?.error);
      setMessage(result.message || "Something went wrong")
      throw new Error(result.message || "Failed to delete book");
    }
  };

  return { addBook, isLoading, error, message, updateBook, deleteBook };
};
