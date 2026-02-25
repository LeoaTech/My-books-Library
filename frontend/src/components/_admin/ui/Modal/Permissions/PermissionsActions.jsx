import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermissions } from "../../../../../hooks/permissions/usePermissions";
import { RxCross1 } from "react-icons/rx";

const schema = z.object({
  name: z.string().min(2, { message: "Please Enter a Permission Name" }),
});

const PermissionModal = ({ isEdit, values, close }) => {
  const queryClient = useQueryClient();
  const { updatePermission, deletePermission, deletePermissionText } = usePermissions();
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

  /* Change Permission Name Mutation */
  const { mutateAsync: updatePermissionMutation } = useMutation({
    mutationFn: updatePermission,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["Permissions"]);
      close();
    },
  });

  const { mutateAsync: deletePermissionMutation } = useMutation({
    mutationFn: deletePermission,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["permissions"]);
      close();
    },
    // onError:()=>{
    //   close();
    // }
  });


  const onSubmit = async (data) => {
    const updatePermission = { ...data, permission_id: values?.permission_id };
    await updatePermissionMutation(updatePermission);
  };
  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-[#64748B] bg-opacity-75 transition-opacity z-50">
      <div className="relative p-5 rounded-md mx-auto my-auto w-full max-w-lg bg-surface">
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
          <h1 className="text-[17px] font-bold ">
            {isEdit ? "Update Permission" : "Delete Permission"}
          </h1>
          {isEdit ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2.5 block texttext">
                  Permission ID <span className="text-sm text-primary">(Readonly)</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  disabled
                  placeholder="Permission ID"
                  {...register("permission_id")}
                  readOnly={true}
                  className="w-full border-border rounded-sm border-[1.5px] border-stroke bg-background text-text py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-surface"
                />
                {errors?.permission_id?.message && (
                  <p className="format-message error">
                    {errors.permission_id.message}
                  </p>
                )}
              </div>
              <div>
                <label className=" mt-3 mb-2.5 block texttext">
                  Name
                </label>
                <input
                  autoFocus
                  type="text"
                  
                  placeholder="Permission Name"
                  {...register("name")}
                  className="w-full border-border rounded-sm border-[1.5px] border-stroke bg-background text-text py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-surface"
                />
                {errors?.name?.message && (
                  <p className="format-message error">{errors.name.message}</p>
                )}
              </div>
              <div className="mt-5 flex gap-4 p-5">
                <button
                  onClick={close}
                  className="w-full rounded-md bg-white hover:bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 "
                  type="button"
                >Close</button>
                <button
                className="rounded-md w-full border-border bg-background text-text px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-50  hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={!isDirty || !isValid || isSubmitting}
                >Update</button>

              </div>{" "}
              {errors && (
                <span className="text-meta-1 text-sm">
                  {errors?.root?.message}
                </span>
              )}
            </form>
          ) : (
            <>

              <p className="text-md font-bold mt-5 text-text">Do you want to delete the <span className="text-sm text-primary underline">{`(${(values?.name).toUpperCase()})`}</span> Permission ?</p>

              {/* Action Buttons */}

              <div className="mt-5 flex justify-end gap-6 p-5">

                <button
                  onClick={close}
                  className="border p-2 px-5 bg-green-400 text-white rounded-md text-[17px] hover:bg-green-600"
                >
                  No
                </button>
                <button
                  onClick={() => deletePermissionMutation(values?.permission_id)}
                  className="rounded-md w-full border-border bg-background text-text px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-50  hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Yes, Delete Permission
                </button>
              </div>



            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
