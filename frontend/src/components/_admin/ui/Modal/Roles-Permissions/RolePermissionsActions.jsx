import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useFetchRoles } from "../../../../../hooks/users/roles/useFetchRole";
import { useRolesPermissions } from "../../../../../hooks/roles_permissions/useRolesPermissions";
import { fetchPermissionsByRoleID } from "../../../../../hooks/roles_permissions/useFetchRolesPermissions";



const RolesPermissionModal = ({ close }) => {
  const queryClient = useQueryClient();
  const { isPending, data: allRoles } = useFetchRoles();
  const { deleteRolesPermission } = useRolesPermissions();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting,  isDirty },
  } = useForm({});

  const selectedRole = watch("role_id");

  const { data } = useQuery({
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


 
  const onSubmit = async (data) => {
    await deleteRolePermissionMutation(data);
  };
  return (
    <div className="flex justify-center items-center fixed inset-1 bg-opacity-75  bg-slate-400 transition-opacity">
      <div className="mx-10 bg-white p-10 rounded-md flex flex-col justify-center items-center xs:w-2/3 md:w-1/3 md:mx-20">
        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-[17px] font-bold ">Permissions Details</h1>

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
                      className="relative z-20 w-full appearance-none rounded-sm border border-[#abc6e8] bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
            {/* {data?.permissions && ( */}
            <div className=" h-[300px] w-full mt-2 m-3 p-10 overflow-hidden overflow-y-auto ">
              {data?.permissions ? (
                <div className="flex flex-wrap overflow-hidden overflow-y-auto justify-between gap-9 xs:flex-col  ">
                  {data?.permissions &&
                    data?.permissions?.map((permission, index) => (
                      <div key={index} className="flex justify-start gap-2">
                        <input
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
                  Please Select the Role ID to View Permissions{" "}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-evenly items-center p-5  ">
              {" "}
              <input
                className="cursor-pointer  text-blue-800 hover:text-blue-400"
                disabled={!isDirty || isSubmitting}
                type="submit"
                value="Remove Permissions"
              />
              <input
                onClick={close}
                className="cursor-pointer text-red-500 hover:text-red-400"
                type="button"
                value="Close"
              />
            </div>{" "}
            {errors && (
              <span className="text-meta-1 text-sm">
                {errors?.root?.message}
              </span>
            )}
          </form>

          {/* Action Buttons */}

          <div className="mt-10 flex justify-evenly gap-6">
            {/* <button
                  onClick={() => deletePermissionMutation(values?.permission_id)}
                  className="border p-2 px-5 bg-red-400 text-white rounded-md text-[17px] hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={close}
                  className="border p-2 px-5 bg-green-400 text-white rounded-md text-[17px] hover:bg-green-600"
                >
                  No
                </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPermissionModal;
