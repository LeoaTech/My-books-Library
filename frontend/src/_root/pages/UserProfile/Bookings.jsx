import { useFetchUserBookings } from "../../../hooks/bookings/useFetchUserBookings";
import { useAuthContext } from "../../../hooks/useAuthContext";
import BookingsList from "../../../components/_user/Bookings/Bookings";
import DashboardSB from "../../../components/_user/Profile/DashboardSB";

const BookingsPage = () => {

    const { auth } = useAuthContext();

    // Fetch Bookings By User ID
    const { data: usersBookings, isLoading, isError, error } = useFetchUserBookings(auth?.id);
    console.log(usersBookings, "User Bookings")

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;

    return (
        <div className="bg-slate-200 flex h-screen">
            {/* <!-- Sidebar --> */}
            <DashboardSB />

            {/* Bookings Details List */}
            <div className="flex h-full w-full flex-col">
                <BookingsList bookings={usersBookings} />
            </div>
        </div>
    );
};

export default BookingsPage;