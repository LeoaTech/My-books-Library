import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "../../api/books";

export const useFetchBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
};
