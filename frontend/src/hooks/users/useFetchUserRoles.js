import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH ROLES OF USERS

const fetchUsers = async ({ signal }) =>
  await fetch(`${BASE_URL}/users`, { signal, credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch");
      } else {
        return res.json();
      }
    })
    .catch((err) => console.log(err));

export const useFetchUserRoles = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
};
