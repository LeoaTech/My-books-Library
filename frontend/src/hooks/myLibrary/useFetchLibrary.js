import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH  my Library Details

const fetchLibraryDetails = async ({ signal, queryKey }) => {
    const [, entityId] = queryKey;
    if (!entityId) return;
    try {
        const response = await fetch(`${BASE_URL}/library/${entityId}`, {
            signal,
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Couldn't fetch library details");
        }

        return await response.json();

    } catch (err) {
        if (err.name === "AbortError") {
            return null;
        }
        throw err;
    }
};

export const useFetchLibraryDetails = (entityId) => {
    return useQuery({
        queryKey: ["my-library", entityId],
        queryFn: fetchLibraryDetails,
        enabled: !!entityId ,
        refetchOnWindowFocus: true,
    });
};
