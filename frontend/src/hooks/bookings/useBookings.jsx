import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utiliz/baseAPIURL";

// API CALL to FETCH ROLES OF USERS

const fetchBookings = async ({ signal }) =>
    await fetch(`${BASE_URL}/bookings`, { signal, credentials: "include" })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Couldn't fetch");
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


export const useFetchBooking = () => {
    return useQuery({
        queryKey: ["bookings"],
        queryFn: fetchBookings,
    });
};
