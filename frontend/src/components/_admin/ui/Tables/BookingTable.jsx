
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  MdEdit,
  MdOutlineDeleteOutline,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import Loader from "../../Loader/Loader";
import SkeletonModal from "../../../Loader/SkeletonModal";
import { useFetchBooking } from "../../../../hooks/bookings/useBookings";
import BookIssue from "../Modal/Bookings/IssueBooks";
import ViewBookingDetails from "../Modal/Bookings/ViewBookingDetails"
const DeleteBookingDetails = lazy(() => import("../Modal/Bookings/DeleteBooking"));

const BookingTable = ({ hasPermission, searchQuery }) => {

  const { isPending, error, data: bookingsData } = useFetchBooking();

  const [modalState, setModalState] = useState({
    type: null, //update state for edit,view or delete data
    data: null,
  });
  //  pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const viewBookDetails = useCallback((booking) => {

    setModalState({ type: "view", data: booking });
  }, []);

  const editBookDetails = useCallback((booking) => {
    setModalState({
      type: "edit", data: { booking }
    });
  }, []);

  const deleteBookDetails = useCallback((id) => {
    setModalState({ type: "delete", data: { id } });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null });
  }, []);



  // Optimized filtering
  const filteredData = useMemo(() => {
    if (!bookingsData?.bookings || !searchQuery) return bookingsData?.bookings || [];
    const lowerQuery = searchQuery?.toLowerCase();
    return bookingsData.bookings.filter(
      (data) =>
        (data?.user_name?.toLowerCase() || "").includes(lowerQuery) ||
        (data?.booking_status?.toLowerCase() || "").includes(lowerQuery)
    );
  }, [bookingsData, searchQuery]);

  // Column definitions
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor("booking_id", {
        header: "Booking_Id",
      }),

      columnHelper.accessor("user_name", {
        header: "User",
      }),
      columnHelper.accessor("items", {
        header: "Total Items",
        cell: ({ row }) => {
          const totalItems = row.original?.items?.length;
          return totalItems
        },
      }),
      columnHelper.accessor("borrow_date", {
        header: "Borrow Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return isNaN(date) ? "N/A" : date?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      }),
      columnHelper.accessor("booking_status", {
        header: "Status",
      }),
      columnHelper.accessor("return_due", {
        header: "Return Due",
        cell: (info) => {
          const date = new Date(info.getValue());
          return isNaN(date) ? "N/A" : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => {
          const booking = row.original;

          return (
            <div className="flex gap-3 max-w-[120px]">
              {hasPermission("EDIT") ? (
                <button
                  onClick={() => editBookDetails(booking)}
                  className="text-text bg-secondary border-2 border-surface rounded-full w-6 h-6 flex p-1 justify-center items-center hover:bg-primary hover:text-text transition-colors"
                  aria-label={`Edit booking${booking?.boking_id}`}
                >
                  <MdEdit size={20} />
                </button>
              ) : (
                <div className="relative group">
                  <button
                    disabled
                    className="text-green-600/50  bg-surface rounded-full w-6 h-6 flex p-1 justify-center items-center cursor-not-allowed"
                    aria-label={`Edit booking${booking?.boking_id} (disabled)`}
                  >
                    <MdEdit size={20} />
                  </button>
                  <span
                    className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 
                      transition-all rounded bg-gray-800 p-2 text-xs text-red-500"
                    role="tooltip"
                    aria-hidden="true"
                  >
                    Access Denied
                  </span>
                </div>
              )}
              <button
                onClick={() => viewBookDetails(booking)}
                className="text-surface bg-primary border-2 border-border rounded-full w-6 h-6 flex p-1 justify-center items-center hover:text-background hover:bg-secondary hover:border-surface transition-colors"
                aria-label={`View ${booking}`}
              >
                <MdOutlineRemoveRedEye size={20} />
              </button>
              {hasPermission("DELETE") ? (
                <button
                  disabled={booking.booking_status !== "returned"}
                  onClick={() => deleteBookDetails(booking?.booking_id)}
                  className="text-red-500 bg-secondary border-border rounded-full w-6 h-6 flex p-1 justify-center items-center hover:text-red-700 transition-colors disabled:text-gray-600 disabled:hover:text-gray-600"
                  aria-label={`Delete ${booking.booking_id}`}
                >
                  <MdOutlineDeleteOutline size={20} />
                </button>
              ) : (
                <div className="relative group">
                  <button
                    disabled
                    className="text-red-500/50 cursor-not-allowed"
                    aria-label={`Delete (disabled)`}
                  >
                    <MdOutlineDeleteOutline size={20} />
                  </button>
                  <span
                    className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 
                      transition-all rounded bg-gray-800 p-2 text-xs text-red-500"
                    role="tooltip"
                    aria-hidden="true"
                  >
                    Access Denied
                  </span>
                </div>
              )}
            </div>
          );
        },
        size: 100,
      }),
    ],
    [hasPermission, editBookDetails, viewBookDetails, deleteBookDetails]
  );

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    autoResetPageIndex: true,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[500px] text-red-500">
        An error occurred: {error.message}
      </div>
    );
  }

  return (
    <div className="rounded-md p-3 border border-border bg-background shadow-default max-w-full overflow-x-auto ">
      <div className="max-w-full overflow-x-auto">
        {filteredData?.length > 0 ? (
          <table className="mt-2 w-full rounded-2xl table-auto divide-y divide-primary border-collapse">
            <thead className="bg-secondary">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-primary bg-secondary rounded-2xl text-center text-sm uppercase text-text"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-4 font-medium"
                      style={{ width: header.column.getSize() || "auto" }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-surface hover:text-secondary">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 text-center text-sm text-text whitespace-normal"
                      style={{ width: cell.column.getSize() || "auto" }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center h-[400px] text-xl text-text">
            No bookings found. {hasPermission("CREATE") ? "Start by adding new bookings." : "Contact an administrator."}
          </div>
        )}
      </div>

      {filteredData?.length > 0 && (
        <nav
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 border-t border-border"
          aria-label="Table navigation"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`rounded px-4 py-2 text-sm font-medium border transition-colors
                ${table.getCanPreviousPage()
                  ? "text-text bg-primary border-border hover:bg-surface"
                  : "text-secondary bg-gray-100 border-border cursor-not-allowed"}`}
              aria-label="Previous page"
            >
              <MdOutlineKeyboardDoubleArrowLeft />
            </button>
            <span className="text-sm text-slate-600 dark:text-white">
              Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
              <strong>{table.getPageCount()}</strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`rounded px-4 py-2 text-sm font-medium border transition-colors
                ${table.getCanNextPage()
                  ? "text-text bg-primary border-border hover:bg-surface"
                  : "text-secondary bg-gray-100 border-border cursor-not-allowed"}`}
              aria-label="Next page"
            >
              <MdOutlineKeyboardDoubleArrowRight />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className="text-sm text-text"
            >
              Rows per page:
            </label>
            <select
              id="pageSize"
              className="rounded border border-border bg-secondary px-3 py-2 text-sm text-text outline-none "
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              aria-label="Select rows per page"
            >
              {[10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </nav>
      )}

      {modalState.type === "edit" && (
        <Suspense fallback={<SkeletonModal title="Edit Booking" close={closeModal} actionButton="Update" />
        }>
          <BookIssue booking={modalState?.data?.booking} onClose={closeModal} mode="edit" />
        </Suspense>)}


      {modalState.type === "view" && (
        <Suspense fallback={<SkeletonModal title="View Booking" close={closeModal} actionButton="Close" />
        }>
          <ViewBookingDetails bookingData={modalState?.data} close={closeModal} />
        </Suspense>
      )}
      {modalState.type === "delete" && (
        <Suspense fallback={<SkeletonModal title="Delete Booking" close={closeModal} actionButton="Delete" />
        }>
          <DeleteBookingDetails booking={modalState?.data?.id} close={closeModal} />
        </Suspense>)}
    </div>
  );
};


export default BookingTable;
