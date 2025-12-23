import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH  Current Plan

const fetchCurrentPlan = async ({ signal }) => {
  try {
    const response = await fetch(`${BASE_URL}/current-plan`, {
      signal,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Couldn't fetch Current Plan");
    }

    return await response.json(); 

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request aborted");
      return null; 
    }
    console.error("Error Fetching Plan:", err);
    throw err; 
  }
};
export const useFetchCurrentPlan = (auth) => {
  return useQuery({
    queryKey: ["current-plan"],
    queryFn: fetchCurrentPlan,
    enabled: !!auth?.accessToken || !!auth?.id,
    refetchOnWindowFocus: true,
  });
};
