import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoles } from "../../../../../hooks/users/roles/useRolesApi";

const schema = z.object({
  name: z.string().min(2, { message: "Please Enter a Role Name" }),
});

const RoleModal = ({ isEdit, values, close }) => {
  const queryClient = useQueryClient();

  const { updateRole, deleteRole ,deleteRoleText} = useRoles();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty, isValid },
  } = useForm({
    defaultValues: {
      ...values,
    },
    resolver: zodResolver(schema),
  });

  /* Change Role Name Mutation */
  const { mutateAsync: updateRoleMutation } = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["roles"]);
      close();
    },
  });

  const { mutateAsync: deleteRoleMutation } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["roles"]);
      close();
    },
    // onError:()=>{
    //   close();
    // }
  });

  const onSubmit = async (data) => {
    const updateRole = { ...data, role_id: values?.role_id };
    await updateRoleMutation(updateRole);
  };
  return (
    <div className="flex justify-center items-center fixed inset-1 bg-opacity-75  bg-slate-400 transition-opacity">
      <div className="mx-10 bg-white p-10 rounded-md flex flex-col justify-center items-center xs:w-2/3 md:w-1/3 md:mx-20">
        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-[17px] font-bold ">
            {isEdit ? "Update Role" : "Delete Role"}
          </h1>
          {isEdit ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2.5 block text-blue-500 dark:text-white">
                  Role ID
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Role ID"
                  {...register("role_id")}
                  readOnly={true}
                  className="w-full border-green-300 rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {errors?.role_id?.message && (
                  <p className="format-message error">
                    {errors.role_id.message}
                  </p>
                )}
              </div>
              <div>
                <label className=" mt-3 mb-2.5 block text-blue-500 dark:text-white">
                  Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Role Name"
                  {...register("name")}
                  className="w-full border-green-300 rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
                {errors?.name?.message && (
                  <p className="format-message error">{errors.name.message}</p>
                )}
              </div>
              <div className="flex justify-evenly items-center p-5  ">
                {" "}
                <input
                  className="cursor-pointer  text-blue-800 hover:text-blue-400"
                  disabled={!isDirty || !isValid || isSubmitting}
                  type="submit"
                  value="Update"
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
          ) : (
            <>

              <p className="text-[18px] text-gray-700">Are u sure you want to delete the <span className="text-[18px] text-red-400 underline">{`${(values?.name).toUpperCase()} `}</span> Role ?</p>
            
              {/* Action Buttons */}

              <div className="mt-10 flex justify-evenly gap-6">
                <button
                  onClick={() => deleteRoleMutation(values?.role_id)}
                  className="border p-2 px-5 bg-red-400 text-white rounded-md text-[17px] hover:bg-red-600"
                >
                  Yes
                </button>
                <button
                  onClick={close}
                  className="border p-2 px-5 bg-green-400 text-white rounded-md text-[17px] hover:bg-green-600"
                >
                  No
                </button>
              </div>


              
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
