import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH TYPES OF BOOK COVERS

const fetchCovers = async ({ signal }) =>
  await fetch(`${BASE_URL}/covers`, { signal, credentials: "include" })
    .then((res) => {
        // console.log(res,"Covers fetched")
      if (!res.ok) {
        throw new Error("Couldn't fetch Types of COVERS for books");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err, "error fetching covers types"));

export const useFetchCovers = () => {
  return useQuery({
    queryKey: ["covers"],
    queryFn: fetchCovers,
  });
};
