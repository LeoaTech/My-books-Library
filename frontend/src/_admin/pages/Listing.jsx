import { lazy, Suspense, useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { fetchPermissionsByRoleID } from "../../hooks/roles_permissions/useFetchRolesPermissions";
import { useAuthContext } from "../../hooks/useAuthContext";
import { MdWarning } from "react-icons/md";
import Loader from "../../components/_admin/Loader/Loader";
import SkeletonTable from "../../components/Loader/SkeletonTable";

// * Lazy Load Components
const UnAuthorizedRoles = lazy(() => import("../../components/_admin/UnAuthorized"));
const ListingTable = lazy(() => import("../../components/_admin/ui/Tables/Tables"));
const AddBookDetails = lazy(() => import("../../components/_admin/ui/Modal/AddNewBookModal"));


const Listing = () => {
  const [showModal, setShowModal] = useState(false);
  const [accessAction, setAccessAction] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


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

            <input
              type="text"
              placeholder="Search by title, author, genre..."
              className="ml-4 w-1/2  focus:outline-none px-4 py-2 text-sm border-b border-gray-300 bg-neutral-100 rounded-md dark:border-gray-600 dark:bg-[#1d2a39] dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            <Suspense fallback={<SkeletonTable rows={7} columns={7} />}>
              <ListingTable hasPermission={hasPermission} searchQuery={searchQuery} />

            </Suspense>
          ) : (
            <Suspense fallback={<Loader />}>
              <UnAuthorizedRoles />
            </Suspense>
          )}
        </>
      ) : (
        <Suspense fallback={<Loader />}>
          <UnAuthorizedRoles />
        </Suspense>// Access Denied
      )}

      {/* Add New Book Modal */}

      {showModal &&
        <Suspense fallback={<Loader />}>
          <AddBookDetails setShowModal={setShowModal} />
        </Suspense>
      }
    </>
  );
};

export default Listing;
