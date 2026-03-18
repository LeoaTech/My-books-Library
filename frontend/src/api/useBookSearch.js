import { useQuery } from '@tanstack/react-query';

const fetchBookData = async (title) => {
  // console.log(title, "Title of book");

  if (!title) {
    return null;
  }
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const baseUrl = `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(title)}"`;
  const url = apiKey ? `${baseUrl}&key=${apiKey}` : baseUrl;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  // console.log(data?.items, "Book info");

  return data || null;
};

export const useBookSearch = (title, options = {}) => {
  return useQuery({
    queryKey: ['bookSearch', title],
    queryFn: () => fetchBookData(title),
    enabled: options.enabled,
    staleTime: 5 * 60 * 1000,
  });
};