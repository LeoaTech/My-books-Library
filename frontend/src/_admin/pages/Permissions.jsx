import { useState } from "react";
import { Link } from "react-router-dom";
import { Roles, RolesPermission } from "../../components/_admin";

const types = ["Roles", "Permissions"];


/* Tabs  */
function TabGroup() {
  const [active, setActive] = useState(types[0]);

  return (
    <>
      <ul className="flex flex-wrap text-md font-medium text-center text-[#64748B] border-gray-200">
        {types.map((type) => (
          <li className="mr-2 border-b mx-2 border-[#80CAEE] mb-2" key={type}>
            <Link
              className={`inline-block p-2 mx-3 text-[#64748B] bg-transparent rounded-t-lg ${
                active === type ? "text-[#3C50E0] " : "text-[#8A99AF]"
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

  if (active === "Roles") {
    return (
      <>
        <div className="flex justify-end items-end ">
        <button
          onClick={() => setOpenRoleModal(true)}
        className="flex p-2 px-4 bg-gray-500 text-white border m-2 rounded-md hover:bg-slate-500"
        >
          Add Role
        </button>
        </div>
        <Roles open={openRoleModal} setOpenRoleModal={setOpenRoleModal} />
      </>
    );
  } else if (active === "Permissions") {
    return (
      <>
        <button className="flex p-2 px-4 bg-[#10B981] text-white border m-2 rounded-md ">
          Change Permissions
        </button>
        <RolesPermission />
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
