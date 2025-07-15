import { useState } from "react";
import { NewRole, RoleModal } from "../Modal";
import { useFetchRoles } from "../../../../hooks/users/roles/useFetchRole";
import { MdEdit } from "react-icons/md";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";

const RolesTable = ({ open, setOpenRoleModal }) => {
  const { isPending, data } = useFetchRoles();
  const [editRole, setEditRole] = useState(false);
  const [deleteRole, setDeleteRole] = useState(false);
  const [roleData, setRoleData] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(8);

  // Calculate indexes for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const UpdateRole = (roleId) => {
    const roleValues = data?.roles?.find((role) => role?.role_id === roleId);
    setEditRole(true);
    setRoleData(roleValues);
    // setOpenRoleModal(true)
  };

  const roleDelete = (roleId) => {
    const roleValues = data?.roles?.find((role) => role?.role_id === roleId);
    setDeleteRole(true);
    setRoleData(roleValues);
  };

  const closeModal = () => {
    setEditRole(false);
    setDeleteRole(false);
  };

  const currentRows = data?.roles?.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  if (isPending) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="rounded-sm border border-[#E2E8F0] bg-white shadow-default p-8 border-b  dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-[#F7F9FC] text-left dark:bg-[#313D4A]">
              <th className="min-w-[220px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                Role ID
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                Role Name
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                Created At
              </th>
              <th className="min-w-[170px] py-4 px-4 font-medium text-gray-600 dark:text-white xl:pl-11">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows?.map((role) => (
              <tr key={role?.role_id}>
                <td className="border-b border-[#eee] py-5 px-4 pl-5 dark:border-[#2E3A47] xl:pl-11">
                  {role?.role_id}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-5 dark:border-[#2E3A47] xl:pl-11">
                  <p className="inline-flex rounded-full bg-[#FF6766] bg-opacity-10 py-1 px-3 text-sm font-medium text-[#F0950C]">
                    {role?.name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-5 dark:border-[#2E3A47] xl:pl-11">
                {new Date(role?.created_at).toDateString()} {" "} - {" "}
                  {new Date(role?.created_at).toLocaleTimeString()}                 </td>
                <td className="border-b border-[#eee] py-5 px-8 dark:border-[#2E3A47]">
                  <div className="flex items-center space-x-3.5">
                    <button
                      className="text-green-400 hover:text-green-600 "
                      onClick={() => UpdateRole(role?.role_id)}
                    >
                      <span className="inline-flex rounded-full bg-[#d6d3ff] bg-opacity-30 py-2 px-2 text-sm font-medium">
                        <MdEdit />
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        roleDelete(role?.role_id);
                      }}
                      className="text-red-400 hover:text-red-700"
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end gap-4 mt-5 mb-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:text-slate-300 dark:disabled:text-gray-600 text-blue-500"
        >
          <HiChevronDoubleLeft style={{ height: 17, width: 27 }} />
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
            <HiChevronDoubleRight style={{ height: 17, width: 27 }} />
          </button>
        )}
      </div>

      {/* Save New Role Modal */}
      {open && <NewRole setOpenRoleModal={setOpenRoleModal} />}

      {/* UPDATE Role Modal */}
      {editRole && (
        <RoleModal isEdit={editRole} values={roleData} close={closeModal} />
      )}

      {/* DELETE Role Modal */}
      {deleteRole && (
        <RoleModal close={closeModal} isEdit={editRole} values={roleData} />
      )}
    </div>
  );
};

export default RolesTable;
