import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

//  Get All Branches of an Entity

const fetchBranches = async ({ signal }) =>
  await fetch(`${BASE_URL}/branches`, { signal, credentials: "include" })
    .then((res) => {
      // console.log(res, "branches fetched");
      if (!res.ok) {
        throw new Error("Couldn't fetch branches");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });
};
