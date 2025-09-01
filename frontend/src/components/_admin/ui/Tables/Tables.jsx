import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useFetchBooks } from "../../../../hooks/books/useFetchBooks";
import { ShowBookDetails } from "../../";
import {
  MdEdit,
  MdOutlineDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
import DeleteBook from "../Modal/BooksListing/DeleteBook";
import BookDetailsModal from "../Modal/BooksListing/BookDetailsModal";
import Loader from "../../Loader/Loader";

const Tables = ({ hasPermission, searchQuery }) => {
  const { isPending, error, data: booksData } = useFetchBooks();


  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const columnHelper = createColumnHelper();

  useEffect(() => {
    if (booksData) {
      setData(booksData);
    }
  }, [booksData]);



  const filteredData = useMemo(() => {
    if (!booksData?.books) return [];

    return booksData.books.filter((book) => {
      const lower = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(lower) ||
        book.author_name?.toLowerCase().includes(lower) ||
        book.category_name?.toLowerCase().includes(lower) ||
        book.isbn?.toString().includes(lower)
      );
    });
  }, [booksData, searchQuery]);


  const columns = useMemo(
    () => [
      columnHelper.accessor("title_cover", {
        header: "Book Title",
        cell: (info) => {
          const title = info.row.original.title;
          const images = info.row.original.cover_img_url;

          return (
            <div className="min-w-[220px] flex flex-col lg:flex-row lg:justify-start lg:items-center gap-2 lg:gap-4 w-full max-w-[260px]">
              <div className="flex-shrink-0">
                {images && images.length > 0 && (
                  <img
                    src={images[0]?.secure_url}
                    alt="Cover"
                    className="h-14 w-14 rounded-md object-cover"
                  />
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-white break-words">
                {title}
              </p>
            </div>
          );
        },
        footer: (info) => info.column.id,
      }),

      columnHelper.accessor("category_name", {
        header: () => "Genre",
        cell: (info) => info.renderValue(),
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("member_price", {
        header: () => <span>Member Price</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("purchase_price", {
        header: "Purchase Price",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("author_name", {
        header: "Author",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("isbn", {
        header: "ISBN",
        cell: ({ getValue }) => (
          <div className="w-[100px] max-w-[150px] whitespace-normal break-all">
            {getValue()}
          </div>
        ),
        size: 150,
        footer: (info) => info.column.id,

      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: (info) => {
          const bookId = info.row.original?.id;
          const bookTitle = info.row.original?.title

          return (
            <div className=" max-w-[120px] flex gap-3">
              {/* {hasPermission("EDIT") ? ( */}
                <button
                  onClick={() => editBookDetails(bookId)}
                  className="text-green-600"
                >
                  <MdEdit />
                </button>
           {/*    ) : (
                <div className="group relative m-2 flex justify-center">
                  <span className="absolute -top-10 scale-0 transition-all px-3 py-1 rounded bg-gray-800 p-2 text-xs text-red-500 group-hover:scale-100">
                    Access Denied!
                  </span>
                  <button disabled className="text-green-600 ">
                    <MdEdit />
                  </button>
                </div>
               )} */}

              <button
                onClick={() => viewBookDetails(bookId)}
                className="text-green-600"
              >
                <MdOutlineRemoveRedEye />
              </button>
              {/* {hasPermission("DELETE") ? ( */}
                <button
                  onClick={() => deleteBookDetails(bookId, bookTitle)}
                  className="text-red-500"
                >
                  <MdOutlineDeleteOutline />
                </button>
              {/* ) : (
                <div className="group relative m-2 flex justify-center">
                  <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-red-500 group-hover:scale-100">
                    Access Denied!
                  </span>
                  <button disabled className="text-red-500">
                    <MdOutlineDeleteOutline />
                  </button>
                </div>
               )}  */}
            </div>
          );
        },
        size: 100,
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
    state: {
      pagination
    },
    autoResetPageIndex: true

  });

  const [values, setValues] = useState(null);
  const [bookDetailModal, setBookDetailModal] = useState(false);
  const [editDetailModal, setEditDetailModal] = useState(false);
  const [deleteBookModal, setDeleteBookModal] = useState(false);

  const viewBookDetails = (id) => {
    setValues(id);
    setBookDetailModal(true);
  };

  const deleteBookDetails = (id, title) => {
    setValues({ id, title });
    setDeleteBookModal(true);
  };

  const editBookDetails = (id) => {
    setValues(id);

    setEditDetailModal(true);
  };

  const closeModal = () => {
    setBookDetailModal(false);
    setEditDetailModal(false);
    setDeleteBookModal(false);
  };


  if (isPending) return <Loader />; //Add Loading Component

  if (error) return "An error has occurred: " + error.message; // Add error Component

  return (
    <div className="rounded-sm h-[500px]border border-[#E2E8F0] bg-neutral-100 shadow-default max-w-full overflow-x-auto overflow-y-auto dark:border-[#2E3A47] dark:bg-[#24303F]">
      {/* React Table */}
      <div className="max-w-full  overflow-x-auto dark:border-[#2E3A47]">
        {booksData?.books && booksData?.books?.length > 0 ? (
          <table className="w-full  table-auto border">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b text-slate-700 uppercase bg-[#f7fcfc] text-center text-md dark:bg-[#313D4A]"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 pr-2 font-medium py-4 text-slate-700 dark:text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table?.getRowModel()?.rows?.map((row) => (
                <tr key={row.id} className="border-b">
                  {row?.getVisibleCells()?.map((cell) => (
                    <td
                      key={cell.id}
                      className="text-center pt-[14px] pb-[18px] border-b border-[#eee] py-5 px-4 pl-9 dark:border-[#2E3A47] xl:pl-7 w-[200px]" // add fixed width here
                    >
                      <p className="font-medium text-slate-600 dark:text-white whitespace-normal break-words">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        ) :
          <h2 className="flex max-h-[400px] m-20 justify-center items-center text-2xl"> Start by Adding New Books </h2>
        }

        <div />

        {/* Pagination */}
        {booksData?.books && booksData?.books?.length > 0 && (

          <nav
            className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 border-t border-[#E2E8F0] dark:border-[#2E3A47]"
            aria-label="Table navigation"
          >
            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={`rounded px-4 py-2 text-sm font-medium border 
        ${table.getCanPreviousPage()
                    ? "text-slate-600 bg-white border-[#E2E8F0] hover:bg-slate-100 dark:text-white dark:bg-[#1d2a39] dark:border-[#2E3A47] hover:dark:bg-[#2b3a4a]"
                    : "cursor-not-allowed text-gray-400 bg-gray-100 border-gray-200 dark:bg-[#1d2a39] dark:text-gray-500"}`}
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
                className={`rounded px-4 py-2 text-sm font-medium border 
        ${table.getCanNextPage()
                    ? "text-slate-600 bg-white border-[#E2E8F0] hover:bg-slate-100 dark:text-white dark:bg-[#1d2a39] dark:border-[#2E3A47] hover:dark:bg-[#2b3a4a]"
                    : "cursor-not-allowed text-gray-400 bg-gray-100 border-gray-200 dark:bg-[#1d2a39] dark:text-gray-500"}`}
              >
                Next
              </button>
            </div>

            {/* Page Size Selector */}
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
              >
                {[20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        )}

      </div>



      {/* Edit / Delete  Book Details Modal */}

      {editDetailModal && (
        <ShowBookDetails bookValue={values} close={closeModal} />
      )}
      {/* Display Single Book Details */}
      {bookDetailModal && <BookDetailsModal data={values} close={closeModal} />}

      {deleteBookModal && <DeleteBook book={values} close={closeModal} />}
    </div>
  );
};
export default Tables;
