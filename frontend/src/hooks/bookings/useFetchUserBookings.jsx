import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/baseAPIURL";

// API CALL to FETCH Bookings BY USER ID 

const fetchBookingsByUserId = async ({ signal, user_id }) =>
    await fetch(`${BASE_URL}/bookings/user/${user_id}`, { signal, credentials: "include" })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Couldn't fetch User Bookings details");
            } else {
                return res.json();
            }
        })
        .catch((err) => {
            if (err.name === "AbortError") {
                return null;
            }
            console.error("Fetch bookings error:", err);
            throw err;
        });


export const useFetchUserBookings = (user_id) => {
    return useQuery({
        queryKey: ["user-bookings", user_id],
        queryFn: ({ signal }) => fetchBookingsByUserId({ signal, user_id }),
        enabled: !!user_id,
    });
};
