import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH PRICE PLANS

const fetchPricingPlans = async ({ signal }) =>
  await fetch(`${BASE_URL}/pricing`, { signal, credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch pricing");
      } else {
        return res.json();
      }
    })
     .catch((err) => {
      if (err.name === "AbortError") {
        return null;
      }
      console.error("Fetch pricing error:", err);
      throw err;
    });


export const useFetchPricingPlans = () => {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: fetchPricingPlans,
  });
};
