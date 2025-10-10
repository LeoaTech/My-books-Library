import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH DASHBORAD METRICS

const fetchDashboardMetrics = async ({ signal }) =>
  await fetch(`${BASE_URL}/dashboard`, { signal, credentials: "include" })
    .then((res) => {
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

export const useFetchDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardMetrics,
    throwOnError: (error) => error.name !== "AbortError", // Ignore AbortError in React Query

  });
};
