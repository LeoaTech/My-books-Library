import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

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
    .catch((err) => console.log(err));

export const useFetchOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};
