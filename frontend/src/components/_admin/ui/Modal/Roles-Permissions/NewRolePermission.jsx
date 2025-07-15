import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPermissionsByRole } from "../../../../../hooks/roles_permissions/useFetchRolesPermissions";
import { useFetchRoles } from "../../../../../hooks/users/roles/useFetchRole";
import { useRolesPermissions } from "../../../../../hooks/roles_permissions/useRolesPermissions";
import { RxCross1 } from "react-icons/rx";

const AddRolePermission = ({ setOpenModal }) => {
  const queryClient = useQueryClient();
  const { isPending, data: allRoles } = useFetchRoles();
  const { addRolePermission } = useRolesPermissions();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({});

  const selectedRole = watch("role_id");
  const { data } = useQuery({
    queryFn: () => fetchPermissionsByRole(selectedRole),
    queryKey: ["role-permissions", { selectedRole }],
    enabled: !!selectedRole,
  });

  /* Add New Role Mutation */
  const { mutateAsync: addRolePermissionMutation } = useMutation({
    mutationFn: addRolePermission,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["role-permissions"]);
      setOpenModal(false);
    },
  });

  const onSubmit = async (data) => {
    const permissionsForRole = {
      permissions: data,
    };

    await addRolePermissionMutation(permissionsForRole);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/65 lg:left-[18rem]">
      <div className="relative w-[90%] max-w-md bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-10 rounded-md shadow-lg">
        {/* Modal Close Button */}
        <div className="absolute top-4 right-4">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "#FFF",
              strokeWidth: 2,
            }}
            onClick={() => setOpenModal(prev => !prev)}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-[17px] font-bold ">Assign New Permission</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="p-5">
            <div className="mt-2 mb-4.5 flex flex-col gap-2 md:flex-row md:gap:9">
              <div className="w-full ">
                <label
                  className="mb-2.5 block text-blue-500 dark:text-white"
                  htmlFor="role_id"
                >
                  Role Name
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  {allRoles && (

                    <select
                      autoFocus
                      className="relative z-20 w-full appearance-none rounded-sm border border-[#abc6e8] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      name="role_name"
                      {...register("role_id")}
                    >
                      {" "}
                      <option></option>
                      {allRoles?.roles?.map((role) => (
                        <option key={role?.role_id} value={role?.role_id}>
                          {role?.name}
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
            <label className="mt-2.5 mb-2.5 block text-blue-500 dark:text-white">
              Permissions
            </label>
            <div className=" h-[270px] w-full mt-4 m-3 px-6 overflow-hidden overflow-y-auto ">
              {data?.permissions ? (
                <div className="flex flex-wrap overflow-hidden overflow-y-auto justify-between gap-9 xs:flex-col ">
                  {data?.permissions &&
                    data?.permissions?.map((permission, index) => (
                      <div key={index} className="flex justify-center items-center gap-4">
                        <input
                          className="h-4 w-4 border-"
                          type="checkbox"
                          name="permission_id"
                          id="permission_id"
                          value={permission.permission_id}
                          {...register("permission_id")}
                        />
                        <span>{permission?.permission_name}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="flex justify-center items-center text-blue-300">
                  Please Select the Role ID to Assign New Permissions{" "}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end p-5 gap-5  ">
              {" "}
              <button
                className="rounded-md bg-[#FFBA00] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"

                disabled={!isDirty || isSubmitting }
              >Add Permissions</button>
              <button
                onClick={() => setOpenModal((prev) => !prev)}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >Close</button>
            </div>{" "}
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

export default AddRolePermission;
