import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import React, { useState } from "react";

const mydata = [
  {
    Id: 1,
    title: "hello world",
    price: "23.9",
    author: "John Smith",
    cover: "Hardcopy",
    condition: "used",
    isAvailable: true,
    ISBN: "48u58jhu40-944",
    category: "History",
  },
  {
    Id: 2,
    title: "hello world",
    price: "23.9",
    author: "John Smith",
    cover: "Hardcopy",
    condition: "used",
    isAvailable: true,
    ISBN: "48u58jhu40-944",
    category: "History",
  },
  {
    Id: 3,
    title: "hello world",
    price: "23.9",
    author: "John Smith",
    cover: "Hardcopy",
    condition: "used",
    isAvailable: true,
    ISBN: "48u58jhu40-944",
    category: "History",
  },
  {
    Id: 4,
    title: "hello world",
    price: "23.9",
    author: "John Smith",
    cover: "Hardcopy",
    condition: "used",
    isAvailable: true,
    ISBN: "48u58jhu40-944",
    category: "History",
  },
  {
    Id: 5,
    title: "hello world",
    price: "23.9",
    author: "John Smith",
    cover: "Hardcopy",
    condition: "used",
    isAvailable: true,
    ISBN: "48u58jhu40-944",
    category: "History",
  },
];

const columns = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <IndeterminateCheckbox
  //         {...{
  //           checked: table.getIsAllRowsSelected(),
  //           indeterminate: table.getIsSomeRowsSelected(),
  //           onChange: table.getToggleAllRowsSelectedHandler(),
  //         }}
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <div className="px-1">
  //         <IndeterminateCheckbox
  //           {...{
  //             checked: row.getIsSelected(),
  //             disabled: !row.getCanSelect(),
  //             indeterminate: row.getIsSomeSelected(),
  //             onChange: row.getToggleSelectedHandler(),
  //           }}
  //         />
  //       </div>
  //     ),
  //   },
  {
    accessorKey: "Id",
    header: "Id",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "cover",
    header: "Cover",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "isAvailable",
    header: "isAvailable",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "ISBN",
    header: "ISBN",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];
const ListingTable = () => {
  const [books, setbooks] = useState(mydata);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState([]);
  const table = useReactTable({
    data: books,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    //   globalFilter,
    },
    // enableRowSelection: true, //enable row selection for all rows
    // // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    // onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // debugTable: true,
  });

  console.log(globalFilter, "Rows");

//   const filteredData = globalFilter.find((f) => f.id === "title")?.value || "";

//   const onFilterChange = (id, value) =>
//     setGlobalFilter((prev) =>
//       prev.filter((f) => f.id !== id).concat({ id, value })
//     );
  return (
    <>
      {/* Create a Seprate filter Components */}
      <form action="#" method="POST">
        <div className="relative">
          <input
            type="text"
            // value={filteredData}
            // onChange={(e) => onFilterChange("title", e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-transparent pr-4 pl-9 p-3 focus:outline-none"
          />
          <button className="absolute top-1/2 left-0 -translate-y-1/2">
            <svg
              className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </form>
      <div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  className="bg-gray-2 text-left dark:bg-meta-4"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null} */}
                          </>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11"
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr></tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListingTable;
