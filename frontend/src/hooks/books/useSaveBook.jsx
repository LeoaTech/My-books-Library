import { useState } from "react";
import { BASE_URL } from "../../utiliz/baseAPIURL";

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

    console.log(response, "Book Form Response");
    const result = await response.json();
    console.log(result, "Result");
  };

  const updateBook = async (book) => {
    setIsLoading(true);
    setError(null);

    console.log(book, "Book updated Form functions");
    const response = await fetch(`${BASE_URL}/books/update/${book?.bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ book: book }),
    });

    console.log(response, "Book Update Form Response");
    const result = await response.json(); //response?.data;
    console.log(result, "Update Result");
  };

  
  return { addBook, isLoading, error, message, updateBook };
};
