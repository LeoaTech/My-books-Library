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

  return (
    <>
      <ul className="flex flex-wrap text-md font-medium text-center text-[#64748B] border-gray-200">
        {types.map((type) => (
          <li className="mr-2 border-b mx-2 border-[#80CAEE] mb-2" key={type}>
            <Link
              className={`inline-block p-2 mx-3 bg-transparent rounded-t-lg ${active === type ? "text-[#3C50E0] " : "text-[#8A99AF]"
                }`}
              key={type}
              active={active === type}
              onClick={() => setActive(type)}
            >
              {type}
            </Link>
          </li>
        ))}
      </ul>
      <RenderTable active={active} />
    </>
  );
}

/* Renders Tables Based on Active Tabs */

const RenderTable = ({ active }) => {
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [ShowDetails, setShowDetails] = useState(false);

  if (active === "Roles") {
    return (
      <>
        <div className="flex justify-end items-end ">
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


        <Suspense fallback={<SkeletonTable rows={7} columns={4} />}>
          <RolesTable open={openRoleModal} setOpenRoleModal={setOpenRoleModal} />

        </Suspense>
      </>
    );
  } else if (active === "Permissions") {
    return (
      <>
        <div className="flex justify-end items-end">
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
        <Suspense fallback={<SkeletonTable rows={7} columns={4} />}>

          <PermissionsTable openModal={openModal} setOpenModal={setOpenModal} />
        </Suspense> </>
    );
  } else if (active === "Roles Permissions") {
    return (
      <>
        <div className="flex justify-end items-end">
          <button
            onClick={() => setOpenModal(true)}
            className="flex p-2 px-4 bg-[#758aae] hover:bg-[#2f3c52] text-white border m-2 rounded-md "
          >
            <span className="flex justify-center items-center gap-2">
              <HiPlus />
              New
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
        <Suspense fallback={<SkeletonTable rows={7} columns={5} />}>

          <RolesPermissionsTable
            openModal={openModal}
            setOpenModal={setOpenModal}
            ShowDetails={ShowDetails}
            setShowDetails={setShowDetails}
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
