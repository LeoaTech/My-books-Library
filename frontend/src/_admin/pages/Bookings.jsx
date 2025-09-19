import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useAuthContext } from "../../hooks/useAuthContext";
import { MdWarning } from "react-icons/md";
import Loader from "../../components/_admin/Loader/Loader";
import SkeletonTable from "../../components/Loader/SkeletonTable";
import { debounce } from "lodash";
import useVerifyPermissions from "../../hooks/verifyPermissions";
import SkeletonModal from "../../components/Loader/SkeletonModal";
import BookIssue from "../../components/_admin/ui/Modal/Bookings/IssueBooks";
// Lazy Load Components
const UnAuthorizedRoles = lazy(() => import("../../components/_admin/UnAuthorized"));
const BookingTable = lazy(() => import("../../components/_admin/ui/Tables/BookingTable"));



const Bookings = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useAuthContext();
  const selectedRole = auth?.role;

  const { hasPermission, isPending, error, hasPageAccess } = useVerifyPermissions(selectedRole || auth?.role, "BOOK")


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

  const onClose = useCallback(() => {
    setShowModal(false)
  }, [])

  if (isPending) {
    return (
      <Loader />
    )
  }

  if (error || !hasPageAccess()) {
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
            placeholder="Search bookings by status and user name ..."
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
          onClick={() => setShowModal(true)}
          aria-label="issue books"
        >
          <HiPlus />Issue Books
        </button>
        ) : (
          <div className="relative group">
            <button
              className="flex items-center gap-2 bg-[#758aae]/50 text-white px-4 py-2 rounded-md 
                cursor-not-allowed"
              disabled
              aria-label="Add new booking (disabled)"
            >
              <HiPlus /> Issue Books
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
          <BookingTable hasPermission={hasPermission} searchQuery={searchQuery} onClose={onClose} />
        </Suspense>
      ) : (
        <Suspense fallback={<Loader />}>
          <UnAuthorizedRoles />
        </Suspense>
      )}


      {showModal &&
        <Suspense fallback={<SkeletonModal title={"Issue Book"} close={close} actionButton={"Issue Books"} />}>
          <BookIssue mode="create" onClose={onClose} />
        </Suspense>}

    </div>
  );
};




export default Bookings;
