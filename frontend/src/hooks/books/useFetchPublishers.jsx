import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH PUBLISHERS DETAILS

const fetchPublishers = async ({ signal }) =>
  await fetch(`${BASE_URL}/publishers`, { signal, credentials: "include" })
    .then((res) => {
        // console.log(res,"publishers fetched")
      if (!res.ok) {
        throw new Error("Couldn't fetch Publishers details");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err, "publishers fetching Error"));

export const useFetchPublishers = () => {
  return useQuery({
    queryKey: ["publishers"],
    queryFn: fetchPublishers,
  });
};
