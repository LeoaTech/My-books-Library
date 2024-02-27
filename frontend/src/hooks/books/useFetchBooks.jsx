import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH ROLES OF USERS

const fetchBooks = async ({ signal }) =>
  await fetch(`${BASE_URL}/books`, { signal, credentials: "include" })
    .then((res) => {
      // console.log(res, "Books fetched");
      if (!res.ok) {
        throw new Error("Couldn't fetch books");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });
};

// Fetch Book Details by ID

export const fetchBookById = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}/books/book?bookId=${bookId}`, {
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books", error);
    throw error; // Rethrow the error to let React Query handle it
  }
};
