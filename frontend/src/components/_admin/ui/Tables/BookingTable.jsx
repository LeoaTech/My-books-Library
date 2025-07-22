
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useFetchBooks } from "../../../../hooks/books/useFetchBooks";
import {
  MdEdit,
  MdOutlineDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import Loader from "../../Loader/Loader";
import SkeletonModal from "../../../Loader/SkeletonModal";
const EditBookingDetails = lazy(() => import("../Modal/Bookings/EditBooking"));
const DeleteBookingDetails = lazy(() => import("../Modal/Bookings/DeleteBooking"));

const BookingTable = ({ hasPermission, searchQuery }) => {

  const { isPending, error, data: booksData } = useFetchBooks();

  const [modalState, setModalState] = useState({
    type: null, // null | 'view' | 'edit' | 'delete'
    data: null, // book ID or { id, title } for delete
  });

  //  pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Memoized action handlers
  const viewBookDetails = useCallback((id) => {
    setModalState({ type: "view", data: id });
  }, []);

  const editBookDetails = useCallback((id) => {
    setModalState({
      type: "edit", data: { id: id, "booking_id": "1234", "booking_by": "John doe", "booking_from": "vendor 1", "borrow_date": new Date().toDateString(), status: "pending", "return_due": "15 days" }
    });
  }, []);

  const deleteBookDetails = useCallback((id, title) => {
    setModalState({ type: "delete", data: { id, title } });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null });
  }, []);



  // Optimized filtering
  const filteredData = useMemo(() => {
    // if (!booksData?.books || !searchQuery) return booksData?.books || [];
    // const lowerQuery = searchQuery?.toLowerCase();
    // return booksData.books.filter(
    //   (book) =>
    //     (book.title?.toLowerCase() || "").includes(lowerQuery) ||
    //     (book.author_name?.toLowerCase() || "").includes(lowerQuery) ||
    //     (book.category_name?.toLowerCase() || "").includes(lowerQuery) ||
    //     (book.isbn?.toString() || "").includes(lowerQuery)
    // );
    return [
      { "booking_id": "1234", "booking_by": "John doe", "booking_from": "vendor 1", "borrow_date": new Date().toDateString(), status: "pending", "return_due": "15 days" }
    ]
  }, [booksData, searchQuery]);

  // Column definitions
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor("booking_id", {
        header: "Booking_Id",
      }),

      columnHelper.accessor("booking_by", {
        header: "Booking By",
      }),
      columnHelper.accessor("booking_from", {
        header: "Booking From",
      }),
      columnHelper.accessor("borrow_date", {
        header: "Borrow Date",
      }),
      columnHelper.accessor("status", {
        header: "Status",
      }),
      columnHelper.accessor("return_due", {
        header: "Return Due",

      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: ({ row }) => {
          const { id, title } = row.original;
          return (
            <div className="flex gap-3 max-w-[120px]">
              {hasPermission("EDIT") ? (
                <button
                  onClick={() => editBookDetails(id)}
                  className="text-green-600 hover:text-green-800 transition-colors"
                  aria-label={`Edit ${title}`}
                >
                  <MdEdit size={20} />
                </button>
              ) : (
                <div className="relative group">
                  <button
                    disabled
                    className="text-green-600/50 cursor-not-allowed"
                    aria-label={`Edit ${title} (disabled)`}
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
                onClick={() => viewBookDetails(id)}
                className="text-green-600 hover:text-green-800 transition-colors"
                aria-label={`View ${title}`}
              >
                <MdOutlineRemoveRedEye size={20} />
              </button>
              {hasPermission("DELETE") ? (
                <button
                  onClick={() => deleteBookDetails(id, title)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Delete ${title}`}
                >
                  <MdOutlineDeleteOutline size={20} />
                </button>
              ) : (
                <div className="relative group">
                  <button
                    disabled
                    className="text-red-500/50 cursor-not-allowed"
                    aria-label={`Delete ${title} (disabled)`}
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
    <div className="rounded-sm border border-[#E2E8F0] bg-neutral-100 shadow-default max-w-full overflow-x-auto dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="max-w-full overflow-x-auto">
        {filteredData?.length > 0 ? (
          <table className="w-full table-auto border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b bg-[#f7fcfc] text-center text-sm uppercase text-slate-700 dark:bg-[#313D4A] dark:text-white"
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
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-50 dark:hover:bg-[#2b3a4a]">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 text-center text-sm text-slate-600 dark:text-white whitespace-normal"
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
          <div className="flex justify-center items-center h-[400px] text-xl text-slate-600 dark:text-white">
            No books found. {hasPermission("CREATE") ? "Start by adding new books." : "Contact an administrator."}
          </div>
        )}
      </div>

      {filteredData?.length > 0 && (
        <nav
          className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 border-t border-[#E2E8F0] dark:border-[#2E3A47]"
          aria-label="Table navigation"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`rounded px-4 py-2 text-sm font-medium border transition-colors
                ${table.getCanPreviousPage()
                  ? "text-slate-600 bg-white border-[#E2E8F0] hover:bg-slate-100 dark:text-white dark:bg-[#1d2a39] dark:border-[#2E3A47] hover:dark:bg-[#2b3a4a]"
                  : "text-gray-400 bg-gray-100 border-gray-200 dark:bg-[#1d2a39] dark:text-gray-500 cursor-not-allowed"}`}
              aria-label="Previous page"
            >
              Previous
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
                  ? "text-slate-600 bg-white border-[#E2E8F0] hover:bg-slate-100 dark:text-white dark:bg-[#1d2a39] dark:border-[#2E3A47] hover:dark:bg-[#2b3a4a]"
                  : "text-gray-400 bg-gray-100 border-gray-200 dark:bg-[#1d2a39] dark:text-gray-500 cursor-not-allowed"}`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="pageSize"
              className="text-sm text-slate-600 dark:text-white"
            >
              Rows per page:
            </label>
            <select
              id="pageSize"
              className="rounded border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-slate-700 outline-none dark:border-[#2E3A47] dark:bg-[#1d2a39] dark:text-white"
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
          <EditBookingDetails bookingValue={modalState.data} close={closeModal} />
        </Suspense>)}
      {/* {modalState.type === "view" && (
        <BookDetailsModal data={modalState.data} close={closeModal} />
      )} */}
      {modalState.type === "delete" && (
        <Suspense fallback={<SkeletonModal title="Delete Booking" close={closeModal} actionButton="Delete" />
        }>
          <DeleteBookingDetails booking={modalState.data} close={closeModal} />
        </Suspense>)}
    </div>
  );
};


export default BookingTable;
