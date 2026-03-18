import { useQuery } from "@tanstack/react-query";

const fetchBookDataByIsbn = async (isbn) => {

  if (!isbn) {
    return null;
  }

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const baseUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}`;
  const url = apiKey ? `${baseUrl}&key=${apiKey}` : baseUrl;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }


  const data = await response.json();
  return data;
};

export const useBookSearchByIsbn = (isbn, options = {}) => {
  return useQuery({
    queryKey: ["bookSearch", isbn],
    queryFn: () => fetchBookDataByIsbn(isbn),
    enabled: options.enabled,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });
};
