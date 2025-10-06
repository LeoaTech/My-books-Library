import { useQuery } from "@tanstack/react-query";
import { fetchBooks ,fetchAvailableBooks} from "../../api/books";

export const useFetchBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
};


export const useFetchAvailableBooks = () => {
  return useQuery({
    queryKey: ["books-available"],
    queryFn: fetchAvailableBooks,
  });
};
