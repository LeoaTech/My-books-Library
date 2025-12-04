import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH  Notification Templates

const fetchNotificationTemplates = async ({ signal }) => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/template`, {
      signal,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Couldn't fetch Notification templates");
    }

    return await response.json(); 

  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request aborted");
      return null; 
    }
    console.error("Error Fetching Templates:", err);
    throw err; 
  }
};
export const useFetchNotificationTemplates = () => {
  return useQuery({
    queryKey: ["notification-templates"],
    queryFn: fetchNotificationTemplates,
  });
};
