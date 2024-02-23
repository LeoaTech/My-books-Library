import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH ALL AUTHORS

const fetchAuthors = async ({ signal }) =>
  await fetch(`${BASE_URL}/authors`, { signal, credentials: "include" })
    .then((res) => {
        // console.log(res,"authors fetched")
      if (!res.ok) {
        throw new Error("Couldn't fetch");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchAuthors = () => {
  return useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });
};
