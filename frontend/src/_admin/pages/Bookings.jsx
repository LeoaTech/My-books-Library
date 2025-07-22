import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { fetchPermissionsByRoleID } from "../../hooks/roles_permissions/useFetchRolesPermissions";
import { useAuthContext } from "../../hooks/useAuthContext";
import { MdWarning } from "react-icons/md";
import Loader from "../../components/_admin/Loader/Loader";
import SkeletonTable from "../../components/Loader/SkeletonTable";
import { debounce } from "lodash"; 
// Lazy Load Components
const UnAuthorizedRoles = lazy(() => import("../../components/_admin/UnAuthorized"));
const BookingTable = lazy(() => import("../../components/_admin/ui/Tables/BookingTable"));

// Custom hook for permissions
const usePermissions = (role) => {
  const { data: permissionsList, isPending } = useQuery({
    queryKey: ["role-permissions", { role }],
    queryFn: () => fetchPermissionsByRoleID(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 5, 
  });

  const permissions = useMemo(() => {
    if (!permissionsList) return new Set();
    return new Set(
      permissionsList.permissions
        .filter((p) => p?.permission_name.toUpperCase().includes("BOOKING"))
        .map((p) => p.permission_name.toUpperCase())
    );
  }, [permissionsList]);

  const hasPermission = useCallback(
    (permission) => {
      const permUpper = permission.toUpperCase();
      return Array.from(permissions).some((p) => p.includes(permUpper));
    },
    [permissions]
  );

  return { permissions, hasPermission, isPending };
};

const Bookings = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useAuthContext();
  const { permissions, hasPermission, isPending } = usePermissions(auth?.role);

  console.log(hasPermission("READ"), permissions);

  // Debounced search input handle
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearchQuery(value.trim());
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      if (value.length <= 10) { 
        debouncedSearch(value);
      }
    },
    [debouncedSearch]
  );

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!permissions.size) {
    return (
      <Suspense fallback={<Loader />}>
        <UnAuthorizedRoles />
      </Suspense>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-5">
        <h2 className="text-2xl md:text-3xl text-[#8A99AF] font-medium">
          Bookings
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {hasPermission("READ") && (
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full sm:w-1/2 px-4 py-2 text-sm border-b border-gray-300 bg-neutral-100 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-[#758aae] dark:border-gray-600 dark:bg-[#1d2a39] dark:text-white"
            onChange={handleSearch}
            aria-label="Search booking"
          />
        )}

        {hasPermission("CREATE") ? (
          <button
            className="flex items-center gap-2 bg-[#758aae] text-white px-4 py-2 rounded-md 
              hover:bg-[#80CAEE] focus:outline-none focus:ring-2 focus:ring-[#758aae] 
              transition-colors duration-200"
            onClick={(prev) => setShowModal(!prev)}
            aria-label="Add new booking"
          >
            <HiPlus /> New Booking
          </button>
        ) : (
          <div className="relative group">
            <button
              className="flex items-center gap-2 bg-[#758aae]/50 text-white px-4 py-2 rounded-md 
                cursor-not-allowed"
              disabled
              aria-label="Add new booking (disabled)"
            >
              <HiPlus /> New Booking
            </button>
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 
              transition-all rounded bg-gray-800 p-2 text-xs text-red-500 flex items-center gap-2">
              <MdWarning /> Access Denied
            </span>
          </div>
        )}
      </div>

      {hasPermission("READ") ? (
        <Suspense fallback={<SkeletonTable rows={7} columns={7} />}>
          <h1>Booking Details</h1>
          <BookingTable hasPermission={hasPermission} searchQuery={searchQuery} />
        </Suspense>
      ) : (
        <Suspense fallback={<Loader />}>
          <UnAuthorizedRoles />
        </Suspense>
      )}

      {showModal && hasPermission("CREATE") && (
        <Suspense fallback={<Loader />}>
          <h2>Add Booking </h2>
        </Suspense>
      )}
    </div>
  );
};




export default Bookings;
