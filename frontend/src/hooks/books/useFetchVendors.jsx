import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH VENDORS Details

const fetchVendors = async ({ signal }) =>
  await fetch(`${BASE_URL}/vendors`, { signal, credentials: "include" })
    .then((res) => {
      // console.log(res, "vendors fetched");
      if (!res.ok) {
        throw new Error("Couldn't fetch Vendors details");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchVendors = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: fetchVendors,
  });
};
