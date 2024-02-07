import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoles } from "../../../../../hooks/users/roles/useRolesApi";

const schema = z.object({
  name: z.string().min(2, { message: "Please Enter a Role Name" }),
});

const NewRole = ({ setOpenRoleModal }) => {
  const queryClient = useQueryClient();

  const { newRole } = useRoles();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
  } = useForm({ resolver: zodResolver(schema) });

  /* Add New Role Mutation */
  const { mutateAsync: newRoleMutation } = useMutation({
    mutationFn: newRole,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["roles"]);
      setOpenRoleModal(false);
    },
  });

  const onSubmit = async (data) => {
    await newRoleMutation(data);
  };
  return (
    <div className="flex justify-center items-center fixed inset-1 bg-opacity-75  bg-slate-400 transition-opacity">
      <div className="mx-10 bg-white p-10 rounded-md flex flex-col justify-center items-center xs:w-2/3 md:w-1/3 md:mx-20">
        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-[17px] font-bold ">New Role</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2.5 block text-blue-500 dark:text-white">
                Name
              </label>
              <input autoFocus
                type="text"
                placeholder="Role Name"
                {...register("name")}
                className="w-full border-green-300 rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors?.name?.message && (
                <p className="format-message error">{errors.name.message}</p>
              )}
            </div>
            <div className="mt-5 flex justify-evenly items-center p-5  ">
              {" "}
              <input
                className="cursor-pointer  text-blue-800 hover:text-blue-400"
                disabled={!isDirty || !z.isValid || isSubmitting}
                type="submit"
                value="Add Role"
              />
              <input
                onClick={() => setOpenRoleModal((prev) => !prev)}
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
        </div>
      </div>
    </div>
  );
};

export default NewRole;
