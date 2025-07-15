import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoles } from "../../../../../hooks/users/roles/useRolesApi";
import { RxCross1 } from "react-icons/rx";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/75 lg:left-[18rem]">
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
            onClick={() => setOpenRoleModal(prev => !prev)}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-[17px] font-bold">New Role</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <label className="mb-2.5 block text-blue-500 dark:text-white">
              Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Role Name"
              {...register("name")}
              className="w-full border-green-300 rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            {errors?.name?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}

            <div className="mt-5 flex justify-end gap-4 p-5">
              <button
                className="rounded-md bg-[#FFBA00] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                disabled={!isDirty || !z.isValid || isSubmitting}
              >
                Add Role
              </button>
              <button
                type="button"
                onClick={() => setOpenRoleModal(prev => !prev)}
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {errors?.root?.message && (
              <span className="text-meta-1 text-sm">{errors.root.message}</span>
            )}
          </form>
        </div>
      </div>
    </div>

  );
};

export default NewRole;
