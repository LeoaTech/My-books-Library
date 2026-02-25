import  { useEffect, useMemo, useState } from "react";
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
  searchTerm
}) => {
  const { isPending, data } = useFetchRolesPermissions();
  const { data: allRoles } = useFetchRoles();

  const [rolePermissions, setRolePermissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Calculate indexes for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
const filteredData = useMemo(() => {
    if (!data?.permissions) return [];

    return data?.permissions?.filter((permission) => {
      const lower = searchTerm?.toLowerCase();
      return (
        permission?.permission_name?.toLowerCase().includes(lower)
      );
    });
  }, [data?.permissions, searchTerm]);
  const currentRows = filteredData?.slice(indexOfFirstRow, indexOfLastRow);

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
    <div className="rounded-sm border border-border bg-background shadow-default p-8 border-b  ">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto divide-y divide-primary">
          {/* Table Header displays permissions and All Roles */}
          {allRoles && (
            <thead>
              <tr className="bg-secondary text-left ">
                <th className="min-w-[250px] py-4 px-3 font-medium text-text xl:pl-11">
                  Permissions
                </th>
                {allRoles?.roles?.map((role) => (
                  <th
                    key={role?.role_id}
                    className="min-w-[170px] py-4 px-3 font-semibold underline text-text text-sm xl:pl-11"
                  >
                    {role?.name?.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Display permissions and role_id assigned to that permissions in Table data */}
          <tbody className="divide-y divide-primary">
            {currentRows?.map((permission, index) => (
              <tr key={index}>
                <td className="border-b border-primary py-5 px-2 text-sm pl-2 font-semibold  xl:pl-11">
                  {permission.permission_name}
                </td>
                {allRoles?.roles?.map((role, index) => (
                  <td
                    key={index}
                    className="border-b border-primary py-5 px-4 pl-5 xl:pl-11"
                  >
                    <p className="inline-flex rounded-full bg-surface  bg-opacity-10 py-3 px-3 text-md font-medium text-text">
                      {permission?.roles?.includes(role?.role_id) ? (
                        <AiOutlineCheck
                          style={{ strokeWidth: 20, color: "green" }}
                        />
                      ) : (
                        <AiOutlineClose
                          style={{ stroke: 22, color: "crimson" }}
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
          className="disabled:text-slate-300 text-text"
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
            className="disabled:text-slate-300 text-text"
          >
            <HiChevronDoubleRight style={{ height: 18, width: 27  }} />
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
