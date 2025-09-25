import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH Settings

const fetchSettings = async ({ signal }) =>
  await fetch(`${BASE_URL}/settings`, { signal, credentials: "include" })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Couldn't fetch settings");
      } else {
        return res.json();
      }
    })
     .catch((err) => {
      if (err.name === "AbortError") {
        return null;
      }
      console.error("Fetch settings error:", err);
      throw err;
    });


export const useFetchSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
};
