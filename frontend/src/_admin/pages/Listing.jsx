import { useEffect, useState } from "react";
import { AddBookDetails, Table } from "../../components/_admin";
import { HiPlus } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { fetchPermissionsByRoleID } from "../../hooks/roles_permissions/useFetchRolesPermissions";
import { useAuthContext } from "../../hooks/useAuthContext";
import { MdWarning } from "react-icons/md";
import UnAuthorized from "../../components/_admin/UnAuthorized";

const Listing = () => {
  const [showModal, setShowModal] = useState(false);
  const [accessAction, setAccessAction] = useState([]);

  // Search Book Functionality is not yet implemented
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const { auth } = useAuthContext();

  // Get the Role Permissions to Perform Action on the Page

  const selectedRole = auth?.role;

  const { data: permissionsList, isPending: PendingPermissions } = useQuery({
    queryFn: () => fetchPermissionsByRoleID(selectedRole),
    queryKey: ["role-permissions", { selectedRole }],
    enabled: !!selectedRole,
  });

  // Find Permissions ID Related to Books Listings
  useEffect(() => {
    if (permissionsList) {
      const booksPermissions = permissionsList?.permissions.filter(
        (permission) =>
          permission?.permission_name.includes("BOOK" || "Book" || "book") //filter all permissions related to books listings
      );
      setAccessAction(booksPermissions);
    }
  }, [permissionsList]);

  // Function to check if permissions exist in the List

  // Function to check if a user has a specific permission
  const hasPermission = (permissionName) => {
    return accessAction.some((permission) =>
      permission.permission_name.includes(permissionName)
    );
  };
  // console.log(accessAction, "Access actions");

  if (PendingPermissions) {
    return <h1>Loading...</h1>; //Update Loader Here with animation
  }

  return (
    <>
      <div className="flex justify-between items-center mx-4 overflow-hidden">
        {/* Page Heading */}
        <h2 className="m-5 text-2xl md:text-3xl text-[#8A99AF] font-medium">
          Listings
        </h2>
      </div>

      {/* Render Page Content based on Role Authority */}
      {accessAction ? (
        <>
          {/* Search from Listing ----  and ----  Create New Book Button */}
          <div className=" m-3 flex justify-between items-center">
            {/* Search Input Shows for Read Books Authorixed roles */}
            {hasPermission("READ") && (
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type to search..."
                    className="border-b w-full bg-transparent pr-2 pl-6 lg:pr-4 lg:pl-9 p-3 focus:outline-none"
                  />

                  <button
                    className="absolute top-1/2 left-0 -translate-y-1/2"
                    type="submit"
                  >
                    <svg
                      className="fill-[#64748B] hover:fill-[#3C50E0] dark:fill-[#AEB7C0] dark:hover:fill-[#3C50E0]"
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
            )}

            {/* Authhorized roles can access Create Book Form  */}
            {hasPermission("CREATE") ? (
              <button
                className="bg-[#758aae] text-white active:bg-[#80CAEE] 
      font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                type="button"
                onClick={() => setShowModal(true)}
              >
                <span className="flex justify-center items-center gap-1 lg:gap-2">
                  <HiPlus /> New Book
                </span>
              </button>
            ) : (
              <>
                <div className="group relative m-2 flex justify-center">
                  {/* <button className="rounded bg-amber-500 px-4 py-2 text-sm text-white shadow-sm">
                    Hover me!
                  </button> */}
                  <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-red-500 group-hover:scale-100">
                    <span className="flex gap-2 items-center">
                      {" "}
                      <MdWarning /> Access Denied!
                    </span>{" "}
                  </span>
                  <button
                    className="bg-[#758aae] text-white 
      font-medium rounded outline-none cursor-not-allowed focus:outline-none mr-1 mb-2 px-2 py-2 lg:px-3 "
                    type="button"
                    disabled
                  >
                    <span className="flex justify-center items-center gap-1 lg:gap-2">
                      <HiPlus /> New Book
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Show Table Only when Role has Read Authority */}
          {hasPermission("READ") ? (
            <Table hasPermission={hasPermission} />
          ) : (
            <UnAuthorized />
          )}
        </>
      ) : (
        <UnAuthorized /> // Access Denied
      )}

      {/* Add New Book Modal */}

      {showModal && <AddBookDetails setShowModal={setShowModal} />}
    </>
  );
};

export default Listing;
