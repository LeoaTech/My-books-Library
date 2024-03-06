import { useEffect, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import DeleteBookModal from "../Modal/DeleteBookModal";
import { useFetchBooks } from "../../../../hooks/books/useFetchBooks";
import { ShowBookDetails } from "../..";
import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

const Tables = ({ hasPermission }) => {
  const { isPending, error, data: booksData } = useFetchBooks();

  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    if (booksData) {
      setData(booksData);
    }
  }, [data]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title_cover", {
        header: "Book Title",
        cell: (info) => {
          const title = info.row.original.title;
          const images = info.row.original.cover_img_url;

          return (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                {images && (
                  <img
                    src={images[0]?.secureURL}
                    alt={`Cover Image `}
                    className="h-12 w-12 rounded-lg"
                  />
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-white">{title}</p>
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
      columnHelper.accessor("rental_price", {
        header: () => <span>Rental Price</span>,
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
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor("actions", {
        header: "Actions",
        cell: (info) => {
          const bookId = info.row.original?.id;

          return (
            <div className="flex gap-2">
              {hasPermission("EDIT") ? (
                <button
                  onClick={() => editBookDetails(bookId)}
                  className="text-green-600"
                >
                  <MdEdit />
                </button>
              ) : (
                <div className="group relative m-2 flex justify-center">
                  <span className="absolute -top-10 scale-0 transition-all px-3 py-1 rounded bg-gray-800 p-2 text-xs text-red-500 group-hover:scale-100">
                    Access Denied!
                  </span>
                  <button disabled className="text-green-600 ">
                    <MdEdit />
                  </button>
                </div>
              )}
              <button
                onClick={() => viewBookDetails(bookId)}
                className="text-red-500"
              >
                <MdOutlineDeleteOutline />
              </button>
            </div>
          );
        },
        footer: (info) => info.column.id,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: booksData?.books,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [values, setValues] = useState(null);
  const [bookDetailModal, setBookDetailModal] = useState(false);
  const [editDetailModal, setEditDetailModal] = useState(false);

  const viewBookDetails = (id) => {
    setValues(id);
    setBookDetailModal(true);
  };

  const editBookDetails = (id) => {
    setValues(id);

    setEditDetailModal(true);
  };

  const closeModal = () => {
    setBookDetailModal(false);
    setEditDetailModal(false);
  };

  if (isPending) return "Loading..."; //Add Loading Component

  if (error) return "An error has occurred: " + error.message; // Add error Component

  return (
    <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-default max-w-full overflow-x-auto overflow-y-auto dark:border-[#2E3A47] dark:bg-[#24303F]">
      {/* React Table */}
      <div className="max-w-full overflow-x-auto dark:border-[#2E3A47]">
        {booksData?.books && (
          <table className="w-full table-auto border">
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
                      className="text-center pt-[14px] pb-[18px] border-b border-[#eee] py-5 px-4 pl-9 dark:border-[#2E3A47] xl:pl-7"
                    >
                      <p className="font-medium text-slate-600 dark:text-white">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </p>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div />
      </div>

      {/* Edit / Delete  Book Details Modal */}

      {editDetailModal && (
        <ShowBookDetails bookValue={values} close={closeModal} />
      )}

      {bookDetailModal && <DeleteBookModal data={values} close={closeModal} />}
    </div>
  );
};
export default Tables;
