import { useQuery } from '@tanstack/react-query';

const fetchBookData = async (title) => {
    // console.log(title, "Title of book");
    
  if (!title) {
    return null;
  }
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(title)}"`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }


  const data = await response.json();
  // console.log(data?.items, "Book info");
  
  return data|| null;
};

export const useBookSearch = (title, options={}) => {
  return useQuery({
    queryKey: ['bookSearch', title],
    queryFn: () => fetchBookData(title),
    enabled: options.enabled, 
    staleTime: 5 * 60 * 1000, 
  });
};