import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH CATEGORIES OF BOOKS

const fetchCategories = async ({ signal }) =>
  await fetch(`${BASE_URL}/categories`, { signal, credentials: "include" })
    .then((res) => {
      // console.log(res, "categories fetched");
      if (!res.ok) {
        throw new Error("Couldn't fetch categories");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
