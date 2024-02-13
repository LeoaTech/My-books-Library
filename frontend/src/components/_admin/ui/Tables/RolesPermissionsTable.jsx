import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { AddRolePermission, RolePermissionAction } from "../Modal";
import { useFetchRolesPermissions } from "../../../../hooks/roles_permissions/useFetchRolesPermissions";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { useFetchRoles } from "../../../../hooks/users/roles/useFetchRole";
import { MdRemoveRedEye } from "react-icons/md";

const RolesPermissionsTable = ({
  openModal,
  setOpenModal,
  ShowDetails,
  setShowDetails,
}) => {
  const { isPending, data } = useFetchRolesPermissions();
  const { data: allRoles } = useFetchRoles();

  const [rolePermissions, setRolePermissions] = useState([]);

  const closeModal = () => {
    setShowDetails(false);
    setOpenModal(false);
  };
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (data?.permissions) {
     
      const uniqueRoles = data?.permissions?.map(
        (permission) => permission?.roles
      );

      setRoles(uniqueRoles);
      setRolePermissions([
        ...new Set(
          data?.permissions?.map((permission) => permission?.permission_name)
        ),
      ]);
    }
  }, [data?.permissions]);

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default p-8 border-b border-[#eee]  dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          {/* Table Header displays permissions and All Roles */}
          {allRoles && (
            <thead>
              <tr className="bg-[#F7F9FC] text-left dark:bg-[#313D4A]">
                <th className="min-w-[220px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                  Permissions
                </th>
                {allRoles?.roles?.map((role) => (
                  <th
                    key={role?.role_id}
                    className="min-w-[220px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11"
                  >
                    {role?.name?.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Display permissions and role_id assigned to that permissions in Table data */}
          <tbody>
            {data?.permissions?.map((permission, index) => (
              <tr key={index} >
                <td className="border-b border-[#eee] py-5 px-4 pl-5 dark:border-[#2E3A47] xl:pl-11">
                  {permission.permission_name}
                </td>
                {allRoles?.roles?.map((role, index) => (
                  <td
                    key={index}
                    className="border-b border-[#eee] py-5 px-4 pl-5 dark:border-[#2E3A47] xl:pl-11"
                  >
                    <p className="inline-flex rounded-full bg-[#5fef77] bg-opacity-10 py-1 px-3 text-md font-medium text-[#3b63e8]">
                      {permission?.roles?.includes(role?.role_id) ? (
                        <AiOutlineCheck
                          style={{ stroke: 8, color: "darkgreen" }}
                        />
                      ) : (
                        <AiOutlineClose style={{ stroke: 8, color: "red" }} />
                      )}
                    </p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save New Role Modal */}
      {openModal && <AddRolePermission setOpenModal={setOpenModal} />}

      {/* UPDATE Role Modal */}
      {ShowDetails && <RolePermissionAction close={closeModal} />}
    </div>
  );
};

export default RolesPermissionsTable;

