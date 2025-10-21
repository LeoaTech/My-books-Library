
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH  Current Plan

const fetchCurrentPlan = async ({ signal }) =>
    await fetch(`${BASE_URL}/current-plan`, {
        signal,
        credentials: "include",
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Couldn't fetch Current Plan");
            } else {
                return res.json();
            }
        })
        .catch((err) => {
            if (err.name === "AbortError") {
                return null;
            }
            console.error("Error for Fetching Current Plan:", err);
            throw err;
        });


export const useFetchCurrentPlan = (auth) => {
    return useQuery({
        queryKey: ["current-plan"],
        queryFn: fetchCurrentPlan,
        enabled: !!auth?.accessToken,
        refetchOnWindowFocus:true
    });
};
