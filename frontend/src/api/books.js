import { BASE_URL } from "../utils/baseAPIURL";
import axios from "./axios";

export const fetchBooks = async ({ signal }) =>
  await axios
    .get(`${BASE_URL}/books`, { signal, withCredentials: true })
    .then((res) => {
      console.log(res, "Books fetched");

      console.log(res.data);
      if (res.status !== 200) {
        throw new Error("Couldn't fetch books");
      } else {
        return res?.data || [];
      }
    })
    .catch((err) => {
      console.error("Fetch Books error:", err);

      if (err.name === "AbortError") {
        return null;
      }
      return err?.response?.data?.message || err;
    });

// Fetch Book Details by ID

export const FetchBookById = async (bookId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/books/book?bookId=${bookId}`,
      {
        withCredentials: true,
      }
    );
    const bookData = await response.data;
    return bookData;
  } catch (error) {
    console.error("Error fetching books", error);
    throw error;
  }
};
