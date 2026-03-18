import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useFetchRoles } from "../../../../../hooks/users/roles/useFetchRole";
import { useRolesPermissions } from "../../../../../hooks/roles_permissions/useRolesPermissions";
import { fetchPermissionsByRoleID } from "../../../../../hooks/roles_permissions/useFetchRolesPermissions";
import { RxCross1 } from "react-icons/rx"
import LoadingSpinner from "../../../Loader/LoadingSpinner";


const RolesPermissionModal = ({ close }) => {
  const queryClient = useQueryClient();
  const { isPending, data: allRoles } = useFetchRoles();
  const { deleteRolesPermission } = useRolesPermissions();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({});

  const selectedRole = watch("role_id");

  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchPermissionsByRoleID(selectedRole),
    queryKey: ["role-permissions", { selectedRole }],
    enabled: !!selectedRole,
  });

  /* Delete Role PermissionsMutation */
  const { mutateAsync: deleteRolePermissionMutation } = useMutation({
    mutationFn: deleteRolesPermission,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["role-permissions"]);
      close();
    },
  });

  console.log(data);
  


  const onSubmit = async (data) => {
    await deleteRolePermissionMutation(data);
  };
  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-[#64748B] bg-opacity-75 transition-opacity z-50">
      <div className="relative p-5 bg-surface rounded-md mx-auto my-auto w-full max-w-2xl shadow-lg">
        {/* Modal Close Button */}
        <div className="absolute top-4 right-4">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "var(--color-text)",
              strokeWidth: 2,
            }}
            onClick={close}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-lg font-bold ">Remove Permissions For A Role</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="p-5">
            <div className="mt-2 mb-4.5 flex flex-col gap-2 md:flex-row md:gap:9">
              <div className="w-full ">
                <label
                  className="mb-2.5 block text-text"
                  htmlFor="role_id"
                >
                  Role Name
                </label>
                <div className="relative z-20 bg-background">
                  {allRoles && (
                    <select
                      autoFocus
                      className="relative z-20 w-full appearance-none rounded-sm border border-border bg-background py-3 px-5 outline-none transition focus:border-primary active:border-primary "
                      name="role_name"
                      {...register("role_id")}
                    >
                      {" "}
                      <option value="">Select Role</option>
                      {allRoles?.roles?.map((role) => (
                        <option key={role?.role_id} value={role?.role_id} disabled={role?.name == "owner"}> 
                         
                          {role?.name?.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  )}
                  <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg
                      className="fill-current"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                          fill=""
                        ></path>
                      </g>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <label className="mt-2.5 mb-2.5 block text-text">
              Permissions
            </label>

            <div className="h-[250px] bg-background rounded-md shadow-2xl w-full mt-4 m-1 px-4 overflow-hidden overflow-y-auto">
              {selectedRole && isLoading && <LoadingSpinner />}
              {data?.permissions ? (
                <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.permissions &&
                    data?.permissions?.map((permission, index) => (
                      <div key={index} className="flex gap-2 items-center text-sm font-semibold">
                        <input
                          className="h-4 w-4 border-border accent-primary"
                          type="checkbox"
                          name="permission_id"
                          id={`permission_id_${permission.permission_id}`}
                          value={permission.permission_id}
                          {...register("permission_id")}
                        />
                        <label htmlFor={`permission_id_${permission.permission_id}`}>
                          {permission?.permission_name}
                        </label>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="flex justify-center items-center text-text">
                  Please Select the Role ID to View Permissions
                </p>
              )}

              {selectedRole && data?.permissions?.length == 0 ? `No Permissions Found for ${selectedRole} Role` : ""}
            </div>
            <div className="mt-5 flex gap-2 px-2 py-5 xs:flex-col">
              <button
                onClick={close}
                className="rounded-md w-full bg-white px-2 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >Close</button>
              <button
                className="rounded-md w-full border-border bg-background text-text px-2 py-2 text-sm font-semibold shadow-sm disabled:opacity-50  hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!isDirty || isSubmitting}
              >Remove Permissions</button>
            </div>
            {errors && (
              <span className="text-meta-1 text-sm">
                {errors?.root?.message}
              </span>
            )}
          </form>


        </div>
      </div>
    </div>
  );
};

export default RolesPermissionModal;
