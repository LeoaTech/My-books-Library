import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH CONDITIONS TYPES FOR BOOKS

const fetchConditions = async ({ signal }) =>
  await fetch(`${BASE_URL}/conditions`, { signal, credentials: "include" })
    .then((res) => {
        // console.log(res,"Conditions fetched")
      if (!res.ok) {
        throw new Error("Couldn't fetch Book condition types");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchConditions = () => {
  return useQuery({
    queryKey: ["conditions"],  //keys
    queryFn: fetchConditions,
  });
};
