import { useQuery } from "@tanstack/react-query";

const fetchBookDataByIsbn = async (isbn) => {
  // console.log(isbn, "Book ISBN");

  if (!isbn) {
    return null;
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
      isbn
    )}`
  );

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
