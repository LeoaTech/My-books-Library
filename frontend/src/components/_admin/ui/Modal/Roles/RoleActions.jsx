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

const RoleModal = ({ isEdit, values, close }) => {
  const queryClient = useQueryClient();

  const { updateRole, deleteRole, deleteRoleText } = useRoles();
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
            onClick={close}
          />
        </div>

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
                <button
                  className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] hover:bg-orange-400 px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                  disabled={!isDirty || !isValid || isSubmitting}
                >Update </button>

                <button
                  onClick={close}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white hover:bg-neutral-100 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  sm:mt-0 sm:w-auto"

                >  Close</button>

              </div>{" "}
              {errors && (
                <span className="text-meta-1 text-sm">
                  {errors?.root?.message}
                </span>
              )}
            </form>
          ) : (
            <>

              <p className="text-[18px] text-gray-700 dark:text-gray-300">Are u sure you want to delete the <span className="text-[18px] text-red-400 underline">{`${(values?.name).toUpperCase()} `}</span> Role ?</p>

              {/* Action Buttons */}

              <div className="mt-10 flex justify-evenly gap-6">
                <button
                  onClick={() => deleteRoleMutation(values?.role_id)}
                  className="border-2 p-2 px-5 bg-red-400 text-white rounded-md text-[17px] hover:bg-red-600"
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
