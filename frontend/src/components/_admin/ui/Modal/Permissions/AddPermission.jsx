import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermissions } from "../../../../../hooks/permissions/usePermissions";
import { RxCross1 } from "react-icons/rx";

const schema = z.object({
  name: z.string().min(2, { message: "Please Enter a Permission Name" }),
});

const NewPermission = ({ setOpenModal }) => {
  const queryClient = useQueryClient();

  const { newPermission } = usePermissions()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
  } = useForm({ resolver: zodResolver(schema) });

  /* Add New Role Mutation */
  const { mutateAsync: NewPermissionMutation } = useMutation({
    mutationFn: newPermission,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["permissions"]);
      setOpenModal(false);
    },
  });



  const onClose = useCallback(() => {
    setOpenModal((prev) => !prev)
  }, [])

  const onSubmit = async (data) => {
    await NewPermissionMutation(data);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/68 lg:left-[18rem]">
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
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-[19px] font-bold text-gray-300 ">New Permission</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2.5 block text-blue-500 dark:text-white">
                Name
              </label>
              <input autoFocus
                type="text"
                placeholder="Permission Title"
                {...register("name")}
                className="w-full border-green-300 rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              />
              {errors?.name?.message && (
                <p className="format-message error">{errors.name.message}</p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-4 p-5">
              {" "}
              <button
                className="rounded-md bg-[#FFBA00] px-4 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
                disabled={!isDirty || !z.isValid || isSubmitting}
              >Create</button>
              <button
                onClick={onClose}
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

export default NewPermission;
