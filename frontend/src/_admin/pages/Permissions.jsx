import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { HiPlus, HiMinusCircle } from "react-icons/hi";
import SkeletonTable from "../../components/Loader/SkeletonTable";

// Lazy Load Components
const PermissionsTable = lazy(() => import("../../components/_admin/ui/Tables/PermissionsTable"));
const RolesTable = lazy(() => import("../../components/_admin/ui/Tables//RolesTable"));
const RolesPermissionsTable = lazy(() => import("../../components/_admin/ui/Tables/RolesPermissionsTable"));

const types = ["Roles", "Permissions", "Roles Permissions"];

/* Tabs  */
function TabGroup() {
  const [active, setActive] = useState(types[0]);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <ul className="flex flex-wrap text-md font-medium text-center text-[#64748B] border-gray-200">
        {types.map((type) => (
          <li className="mr-1 border-b mx-1 border-[#80CAEE] mb-2" key={type}>
            <Link
              className={`inline-block p-2 mx-3 bg-transparent rounded-t-lg ${active === type ? "text-[#3C50E0] " : "text-[#8A99AF]"
                }`}
              key={type}
              active={active === type}
              onClick={() => {
                setActive(type);
                setSearchTerm("")
              }}
            >
              {type}
            </Link>
          </li>
        ))}
      </ul>
      <RenderTable active={active} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </>
  );
}

/* Renders Tables Based on Active Tabs */

const RenderTable = ({ active, searchTerm, setSearchTerm }) => {
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [ShowDetails, setShowDetails] = useState(false);




  if (active === "Roles") {
    return (
      <>
        <div className="mt-3 flex flex-col md:flex-row justify-between items-start md:items-center mb-2 ">
          <div className="p-4 mb-4 text-md text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            <span className="font-medium text-orange-500">Important!</span> Default Roles cannot be modified.
          </div>
          <button
            onClick={() => setOpenRoleModal(true)}
            className="flex p-2 px-4 bg-[#758aae] hover:bg-[#2f3c52] text-white border m-2 rounded-md"
          >
            <span className="flex justify-center items-center gap-2">
              <HiPlus />
              New Role{" "}
            </span>
          </button>
        </div>

        <div className=" m-3 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by role name"
            className="ml-4 w-1/2  focus:outline-none px-4 py-2 text-sm border-b border-gray-300 bg-neutral-100 rounded-md dark:border-gray-600 dark:bg-[#1d2a39] dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /></div>
        <Suspense fallback={<SkeletonTable rows={7} columns={4} />}>
          <RolesTable
            searchTerm={searchTerm}
            open={openRoleModal} setOpenRoleModal={setOpenRoleModal} />

        </Suspense>
      </>
    );
  } else if (active === "Permissions") {
    return (
      <>
        <div className="mt-3 flex flex-col md:flex-row  justify-between  items-start md:items-center mb-2 ">
          <div className="p-4 mb-4 text-md text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            <span className="font-medium text-orange-500">Important!</span> Default Permissions cannot be modified.
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="flex p-2 px-4 bg-[#758aae] hover:bg-[#2f3c52] text-white border m-2 rounded-md "
          >
            <span className="flex justify-center items-center gap-2">
              <HiPlus />
              New Permission
            </span>
          </button>
        </div>
        <div className=" m-3 flex justify-between items-center">
          {/* Search Input */}

          <input
            type="text"
            placeholder="Search by permission name"
            className="ml-4 w-1/2  focus:outline-none px-4 py-2 text-sm border-b border-gray-300 bg-neutral-100 rounded-md dark:border-gray-600 dark:bg-[#1d2a39] dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /></div>
        <Suspense fallback={<SkeletonTable rows={7} columns={4} />}>
          <PermissionsTable openModal={openModal} setOpenModal={setOpenModal} searchTerm={searchTerm} />
        </Suspense> </>
    );
  } else if (active === "Roles Permissions") {
    return (
      <>
        <div className="mt-3 flex flex-col md:flex-row justify-between items-start md:items-center mb-2 ">
          <div className="p-4 mb-4 text-md text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            <span className="font-medium text-orange-500">Important!</span> Owner&apos;s Permissions cannot be modified
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => setOpenModal(true)}
              className="flex p-2 px-4 bg-[#758aae] hover:bg-[#2f3c52] text-white border m-2 rounded-md "
            >
              <span className="flex justify-center items-center gap-2">
                <HiPlus />
                Add New
              </span>
            </button>

            <button
              onClick={() => setShowDetails(true)}
              className="flex p-2 px-4 bg-[#758aae] hover:bg-[#2f3c52] text-white border m-2 rounded-md "
            >
              <span className="flex justify-center items-center gap-2">
                <HiMinusCircle />
                Permissions
              </span>
            </button>
          </div>
        </div>
        <div className=" m-3 flex justify-between items-center">
          {/* Search Input */}

          <input
            type="text"
            placeholder="Search by permission name"
            className="ml-4 w-1/2  focus:outline-none px-4 py-2 text-sm border-b border-gray-300 bg-neutral-100 rounded-md dark:border-gray-600 dark:bg-[#1d2a39] dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /></div>
        <Suspense fallback={<SkeletonTable rows={7} columns={5} />}>
          <RolesPermissionsTable
            openModal={openModal}
            setOpenModal={setOpenModal}
            ShowDetails={ShowDetails}
            setShowDetails={setShowDetails}
            searchTerm={searchTerm}
          />
        </Suspense>
      </>
    );
  }
};

/*  Permissions Page */
const Permissions = () => {
  return (
    <div>
      <h2 className="m-5 text-lg md:text-2xl text-[#8A99AF]">
        Roles and Permissions Details{" "}
      </h2>
      <TabGroup />
    </div>
  );
};

export default Permissions;
