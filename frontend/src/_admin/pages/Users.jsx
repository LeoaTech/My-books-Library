import { lazy, Suspense, useState } from "react";
import { HiPlus } from "react-icons/hi";

import { useFetchUserRoles } from "../../hooks/users/useFetchUserRoles";

import SkeletonTable from "../../components/Loader/SkeletonTable";
import Loader from "../../components/_admin/Loader/Loader";

/* Lazy imports components */
const AddUserModal = lazy(() => import("../../components/_admin/ui/Modal/User/AddUserModal"));
const UserTable = lazy(() => import("../../components/_admin/ui/Tables/UserTable"));

/* Users Page */
const Users = () => {

  const [showModal, setShowModal] = useState(false)
  /* Fetch:/ Users in Library */
  const { isPending, error, data } = useFetchUserRoles();

  if (isPending) return <Loader />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1 className="m-5 text-lg md:text-2xl text-[#8A99AF]">Users</h1>
      <div className="flex justify-end items-end mb-2">
        <button
          className=" bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
          type="button"
          onClick={() => setShowModal(true)}
        >
          <span className="flex justify-center items-center gap-1 lg:gap-2">
            <HiPlus /> New User
          </span>
        </button>
      </div>

      {/* // TODO Add Permissions Check for Data Access or Actions */}
      {data &&

        /* Display Table for users and their roles */
        <Suspense fallback={<SkeletonTable rows={2} columns={4} />}>
          <UserTable users={data?.data} />
        </Suspense>

      }
        {/* Add New User */}
      {showModal && <Suspense fallback={<Loader />}><AddUserModal setOpenModal={setShowModal} /></Suspense>}
    </div>
  );
};

export default Users;
