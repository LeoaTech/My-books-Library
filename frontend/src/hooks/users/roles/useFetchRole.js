import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../../utiliz/baseAPIURL";
import { useAuthContext } from "../../useAuthContext";

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
    .catch((err) => {
      if (err.name === "AbortError") {
        return null; // Ignore AbortError
      }
      console.error("Fetch error:", err);
      throw err; // Re-throw other errors
    });

export const useFetchRoles = () => {
  const { auth } = useAuthContext();
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
    enabled: auth.auth,
    throwOnError: (error) => error.name !== "AbortError", // Ignore AbortError in React Query
  });
};
