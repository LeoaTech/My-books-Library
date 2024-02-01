import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../utiliz/baseAPIURL";

// API CALL to FETCH  Roles

const fetchRoles = async ({ signal }) =>
  await fetch(`${BASE_URL}/roles`, { signal, credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch roles");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
};
