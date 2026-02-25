import { useFetchDashboardMetrics } from "../../hooks/dashboard/fetchDashboardMetrics";
// Mock Data for tables and charts
import { mockRecentlyAddedBooks, mockAvailableAuthors, mockBookingData, mockLocationData, mockCategories } from "../../components/_admin/Dashboard"
import { lazy, Suspense } from "react";
import SkeletonTable from "../../components/Loader/SkeletonTable";
import Loader from "../../components/_admin/Loader/Loader";
// Tables
const RecentlyAddedBooks = lazy(() => import("../../components/_admin/Dashboard/RecentlyAddedBooks"));
const AuthorsTable = lazy(() => import("../../components/_admin/Dashboard/AuthorsTable"));
// Charts
const BookingsByCategoryChart = lazy(() => import("../../components/_admin/Dashboard/BookingsByCategoryChart"));
const BookingAreaChart = lazy(() => import("../../components/_admin/Dashboard/BookingAreaChart"));
const LocationDonutChart = lazy(() => import("../../components/_admin/Dashboard/LocationDonutChart"));
const BooksCategoryPieChart = lazy(() => import("../../components/_admin/Dashboard/BooksCategoryPieChart"));

// Summary Cards
const CardBooks = lazy(() => import("../../components/_admin/ui/cards/CardBooks"));
const CardOverdue = lazy(() => import("../../components/_admin/ui/cards/CardOverdue"));
const CardUsers = lazy(() => import("../../components/_admin/ui/cards/CardUsers"));
const CardBookings = lazy(() => import("../../components/_admin/ui/cards/CardBookings"));



const DashboardPage = () => {
  // Call the dashboard API to display real-data
  const { data } = useFetchDashboardMetrics();

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-lg font-medium text-gray-600 dark:text-gray-300">
        <div className="p-8 rounded-xl bg-background shadow-xl">
          Loading Library Metrics...
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-surface min-h-screen  transition-colors">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardBooks books={data?.popularBooks} />
        <CardBookings booking={data?.bookingSummary} />
        <CardOverdue overdue={data?.totalOverdueBooks} />
        <CardUsers users={data?.totalUsers} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 2xl:gap-7.5 mb-8">

        <Suspense fallback={<SkeletonTable />}>
          <RecentlyAddedBooks books={data?.recentlyAddedBooks || mockRecentlyAddedBooks} />

        </Suspense>
        <Suspense fallback={<SkeletonTable />}>
          <AuthorsTable authors={data?.booksByAuthorsSummary || mockAvailableAuthors} />

        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:gap-7.5">
        <Suspense fallback={<Loader />}>
          <BookingAreaChart data={data?.monthlyBookingSummary || mockBookingData} />
        </Suspense>
        <Suspense fallback={<Loader />}>
          <LocationDonutChart data={data?.bookingsByLocation || mockLocationData} />
        </Suspense>
      </div>

      <div className="mt-8">
        <Suspense fallback={<Loader />}>
          <BooksCategoryPieChart data={data?.booksCategorySummary || mockCategories} />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense fallback={<Loader />}>
          <BookingsByCategoryChart data={data?.bookingsByCategory || []} />
        </Suspense>
      </div>
    </div >
  );
};

export default DashboardPage;
