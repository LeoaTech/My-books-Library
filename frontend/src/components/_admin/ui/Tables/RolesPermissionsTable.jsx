import  { useEffect, useState } from "react";
import { AddRolePermission, RolePermissionAction } from "../Modal";
import { useFetchRolesPermissions } from "../../../../hooks/roles_permissions/useFetchRolesPermissions";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { useFetchRoles } from "../../../../hooks/users/roles/useFetchRole";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

const RolesPermissionsTable = ({
  openModal,
  setOpenModal,
  ShowDetails,
  setShowDetails,
}) => {
  const { isPending, data } = useFetchRolesPermissions();
  const { data: allRoles } = useFetchRoles();

  const [rolePermissions, setRolePermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Calculate indexes for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = data?.permissions?.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-default p-8 border-b  dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          {/* Table Header displays permissions and All Roles */}
          {allRoles && (
            <thead>
              <tr className="bg-[#F7F9FC] text-left dark:bg-[#313D4A]">
                <th className="min-w-[250px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                  Permissions
                </th>
                {allRoles?.roles?.map((role) => (
                  <th
                    key={role?.role_id}
                    className="min-w-[170px] py-4 px-4 font-medium underline text-gray-800 dark:text-white xl:pl-11"
                  >
                    {role?.name?.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Display permissions and role_id assigned to that permissions in Table data */}
          <tbody>
            {currentRows?.map((permission, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] underline py-5 px-4 pl-5 font-semibold dark:border-[#2E3A47] xl:pl-11">
                  {permission.permission_name}
                </td>
                {allRoles?.roles?.map((role, index) => (
                  <td
                    key={index}
                    className="border-b border-[#eee] py-5 px-4 pl-5 dark:border-[#283a3e] xl:pl-11"
                  >
                    <p className="inline-flex rounded-full bg-[#6a9f74] dark:bg-[#182131] bg-opacity-10 py-3 px-3 text-md font-medium text-[#3b63e8]">
                      {permission?.roles?.includes(role?.role_id) ? (
                        <AiOutlineCheck
                          style={{ stroke: 10, color: "darkgreen" }}
                        />
                      ) : (
                        <AiOutlineClose
                          style={{ stroke: 12, color: "crimson" }}
                        />
                      )}
                    </p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end items-center gap-4 mt-5 mb-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:text-slate-300 dark:disabled:text-gray-600 text-blue-500"
        >
          <HiChevronDoubleLeft style={{ height: 18, width: 27 }} />
        </button>

        <span className="text-orange-600 bg-gray-100 border text-sm rounded-full h-[40px] w-[45px] flex justify-center items-center">
          {currentPage}
        </span>
        {data?.permissions?.length > rowsPerPage && (
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastRow >= data?.permissions?.length}
            className="disabled:text-slate-300 dark:disabled:text-gray-600 text-blue-500"
          >
            <HiChevronDoubleRight style={{ height: 18, width: 27 }} />
          </button>
        )}
      </div>

      {/* Save New Role Modal */}
      {openModal && <AddRolePermission setOpenModal={setOpenModal} />}

      {/* UPDATE Role Modal */}
      {ShowDetails && <RolePermissionAction close={closeModal} />}
    </div>
  );
};

export default RolesPermissionsTable;
