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
      <ul className="flex flex-wrap text-md font-medium text-center text-text border-border">
        {types.map((type) => (
          <li className="mr-1 border-b mx-1 border-border mb-2" key={type}>
            <Link
              className={`inline-block p-2 mx-3 bg-transparent rounded-t-lg ${active === type ? "text-primary " : "text-text"
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

      <div className="p-2 mt-5 mb-5 text-md text-text border-b border-background rounded-lg bg-surface" role="alert">

        <span className="font-medium text-secondary pr-2">Important!</span>Default {active} cannot be modified.
      </div>
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

        <div className=" m-3 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by role name"
            className="ml-4 w-1/2 shadow-lg focus:outline-none focus:ring-2 focus:ring-border px-4 py-2 text-sm border-b border-primary bg-background text-text rounded-md "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setOpenRoleModal(true)}
            className="flex p-2 px-4 bg-surface text-text hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary active:bg-secondary border m-2 rounded-md"
          >
            <span className="flex justify-center items-center gap-2">
              <HiPlus />
              New Role{" "}
            </span>
          </button>
        </div>
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
        <div className=" m-3 flex justify-between items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by permission name"
            className="ml-4 w-1/2  focus:outline-none px-4 py-2 text-sm border-b border-primary bg-background text-text rounded-md focus:ring-2 focus:ring-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setOpenModal(true)}
            className="flex p-2 px-4 bg-surface text-text hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary active:bg-secondary border m-2 rounded-md "
          >
            <span className="flex justify-center items-center gap-2">
              <HiPlus />
              New Permission
            </span>
          </button>
        </div>
        <Suspense fallback={<SkeletonTable rows={7} columns={4} />}>
          <PermissionsTable openModal={openModal} setOpenModal={setOpenModal} searchTerm={searchTerm} />
        </Suspense> </>
    );
  } else if (active === "Roles Permissions") {
    return (
      <>
        <div className="mt-3 flex justify-end items-end mb-2 ">
          <button
            onClick={() => setOpenModal(true)}
            className="flex p-2 px-4 bg-surface text-text hover:bg-secondary active:bg-secondary border m-2 rounded-md "
          >
            <span className="flex justify-center items-center gap-2">
              <HiPlus />
              Add New
            </span>
          </button>

          <button
            onClick={() => setShowDetails(true)}
            className="flex p-2 px-4 bg-surface text-text border m-2 rounded-md "
          >
            <span className="flex justify-center items-center gap-2">
              <HiMinusCircle />
              Permissions
            </span>
          </button>

        </div>
        <div className=" m-3 flex w-full  justify-between items-center">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by permission name"
            className="ml-4 w-1/2 md:w-2/3 focus:outline-none px-4 py-2 text-sm border-b border-primary bg-background text-text  rounded-md focus:ring-2 focus:ring-border "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>
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
      <h2 className="m-5 text-lg md:text-2xl text-text">
        Roles and Permissions Details{" "}
      </h2>
      <TabGroup />
    </div>
  );
};

export default Permissions;
