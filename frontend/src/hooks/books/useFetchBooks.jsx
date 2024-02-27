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

