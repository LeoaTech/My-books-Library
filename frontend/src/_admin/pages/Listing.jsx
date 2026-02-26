import React, { lazy, Suspense, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useAuthContext } from "../../hooks/useAuthContext";
import { MdWarning } from "react-icons/md";
import Loader from "../../components/_admin/Loader/Loader";
import SkeletonTable from "../../components/Loader/SkeletonTable";
import useVerifyPermissions from "../../hooks/verifyPermissions";
import { useFetchCurrentPlan } from "../../hooks/current_plan/useFetchCurrentPlan";
import { BiArrowToTop } from "react-icons/bi";
const ImportFileModal = lazy(() => import("../../components/_admin/Books/UploadFile/FileUpload"));

// * Lazy Load Components
const UnAuthorizedRoles = lazy(() => import("../../components/_admin/UnAuthorized"));
const ListingTable = lazy(() => import("../../components/_admin/ui/Tables/Tables"));
const AddBookDetails = lazy(() => import("../../components/_admin/ui/Modal/BooksListing/CreateBookModal"));


const Listing = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { auth } = useAuthContext();

  const { data: currentPlan, isLoading } = useFetchCurrentPlan(auth)

  // console.log(currentPlan, "Current Plans");

  const hasLimitToAddBook = !isLoading ? currentPlan?.isActive ? true : currentPlan?.booksCount?.count <= 15 : false;
  // console.log(hasLimitToAddBook);

  // Get the Role Permissions to Perform Action on the Page

  const selectedRole = auth?.role;
  const { hasPermission, isPending, error, hasPageAccess } = useVerifyPermissions(selectedRole || auth?.role, "BOOK")

  // console.log(permissions, "Access actions");

  if (isPending || isLoading) {
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
    <>
      <div className="flex justify-between items-center mx-4 overflow-hidden">
        {/* Page Heading */}
        <h2 className="m-5 text-2xl md:text-3xl text-text font-medium">
          Listings
        </h2>
      </div>

      {/* Render Page Content based on Role Authority */}
      {hasPermission("READ") ? (
        <>
          {/* Search from Listing ----  and ----  Create New Book Button */}
          <div className=" m-3 flex flex-col gap-4 md:flex-row md:justify-between items-center">
            {/* Search Input Shows for Read Books Authorixed roles */}

            <input
              type="text"
              placeholder="Search by title, author, genre..."
              className="ml-4 w-full md:w-1/2 focus:outline-none px-4 py-2 text-sm border-b border-border bg-background rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Authhorized roles can access Create Book Form  */}
            {/* Restrict the Users to Create Books based the Plan */}
            <div className="flex justify-end items-end gap-4" >
              {hasPermission("CREATE") && hasLimitToAddBook ? (
                <>
                  <button
                    className="bg-surface text-text hover:bg-secondary active:bg-secondary 
      font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                    type="button"
                    onClick={() => setShowModal(true)}
                  >
                    <span className="flex justify-center items-center gap-1 lg:gap-2">
                      <HiPlus /> New Book
                    </span>

                  </button>

                  <button
                    className="bg-surface text-text hover:bg-secondary active:bg-secondary 
      font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                    type="button"
                    onClick={() => setUploadFileModal(true)}
                  >
                    <span className="flex justify-center items-center gap-1 lg:gap-2">
                      <BiArrowToTop /> Import Books
                    </span>

                  </button>
                </>

              ) : (
                <React.Fragment >
                  <div className="group relative m-2 flex justify-center">

                    <span className="absolute -top-10 scale-0 transition-all rounded bg-surface p-2 text-xs text-red-500 group-hover:scale-100">
                      <span className="flex gap-2 items-center">
                        {" "}
                        <MdWarning /> Access Denied!
                      </span>{" "}
                    </span>
                    <button
                      className="bg-background text-text 
      font-medium rounded outline-none cursor-not-allowed focus:outline-none mr-1 mb-2 px-2 py-2 lg:px-3 "
                      type="button"
                      disabled
                    >
                      <span className="flex justify-center items-center gap-1 lg:gap-2">
                        <HiPlus /> New Book
                      </span>
                    </button>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>




          {/* Show Table Only when Role has Read Authority */}
          {hasPermission("READ") ? (
            <Suspense fallback={<SkeletonTable rows={7} columns={7} />}>
              <ListingTable showModal={showModal} setShowModal={setShowModal} hasPermission={hasPermission} searchQuery={searchQuery} />

            </Suspense>
          ) : (
            <Suspense fallback={<Loader />}>
              <UnAuthorizedRoles />
            </Suspense>
          )}         </>
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

      {
        uploadFileModal &&
        <Suspense fallback={<Loader />}>
          <ImportFileModal setUploadFileModal={setUploadFileModal} />
        </Suspense>
      }
    </>
  );
};

export default Listing;
