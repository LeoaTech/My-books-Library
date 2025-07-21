import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";
import { useAuthContext } from "../useAuthContext";

// API CALL to FETCH ALL ORDERS

const fetchOrders = async ({ signal }) =>
  await fetch(`${BASE_URL}/orders`, { signal, credentials: "include" })
    .then((res) => {
      //   console.log(res, "orders fetched");
      if (res.status === 403) {
        return { error: "You are not authorized to see this Data." };
      } else if (!res.ok) {
        throw new Error("Couldn't fetch Orders");
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

export const useFetchOrders = () => {
  const { auth } = useAuthContext()
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: auth.auth,
    throwOnError: (error) => error.name !== "AbortError", // Ignore AbortError in React Query

  });
};
