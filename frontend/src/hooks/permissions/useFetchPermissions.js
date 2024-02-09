import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH  Roles

const fetchPermissions = async ({ signal }) =>
  await fetch(`${BASE_URL}/permissions`, { signal, credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch permissions");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });
};
