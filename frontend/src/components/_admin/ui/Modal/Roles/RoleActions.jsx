import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRoles } from "../../../../../hooks/users/roles/useRolesApi";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(2, { message: "Please Enter a Role Name" }),
});

const RoleModal = ({ entityId, isEdit, values, close }) => {
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
    const toastId = toast.loading('Updating role...');

    try {
      const updateRole = { ...data, role_id: values?.role_id, entityId };
      await updateRoleMutation(updateRole);
      toast.update(toastId, {
        render: 'Role updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }
  };



  const handleDelete = () => {
    const toastId = toast.loading('Deleting role...');

    try {
      const deleteRoleData = { role_id: values?.role_id, entityId }
      deleteRoleMutation(deleteRoleData);
      toast.update(toastId, {
        render: 'Role deleted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }
  }


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

        <div className="flex justify-start items-start border-b pb-3 mb-4 ">
          <h1 className="text-lg font-bold ">
            {isEdit ? "Update Role" : "Delete Role"}
          </h1>
        </div>
        <div className="flex flex-col justify-between items-center gap-5">


          {isEdit ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-2.5 block text-text">
                  Role ID
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Role ID"
                  {...register("role_id")}
                  readOnly={true}
                  className="w-full border-border rounded-sm border-[1.5px] border-stroke bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
                {errors?.role_id?.message && (
                  <p className="format-message error">
                    {errors.role_id.message}
                  </p>
                )}
              </div>
              <div>
                <label className=" mt-3 mb-2.5 block text-text">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Role Name"
                  {...register("name", { required: true })}
                  className="w-full border-border bg-background rounded-sm border-[1.5px] border-stroke  py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
                />
                {errors?.name?.message && (
                  <p className="format-message error">{errors.name.message}</p>
                )}
              </div>
              <div className="mt-10 flex flex-col-reverse md:flex-row gap-4 md:gap-2 p-5  ">
                <button
                  onClick={close}
                className="rounded-md bg-white px-6 py-2 text-md font-medium text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50"

                >  Close</button>
                <button
                  className={`flex justify-center items-center border-2 border-border gap-2 bg-background text-text px-3 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`} disabled={!isDirty || !isValid || isSubmitting}
                >Update </button>
              </div>
              {errors && (
                <span className="text-meta-1 text-sm">
                  {errors?.root?.message}
                </span>
              )}
            </form>
          ) : (
            <>

              <p className="text-md mt-2 font-bold text-text">Do you want to delete the <span className="text-sm text-primary underline">{`(${(values?.name).toUpperCase()})`}</span>  role permanently?</p>

              {/* Action Buttons */}

              <div className="mt-10 flex justify-evenly gap-6">
                <button
                  onClick={close}
                  className="border p-2 px-5 bg-green-400 text-white rounded-md text-[17px] hover:bg-green-600"
                >
                  No
                </button>
                <button
                  onClick={handleDelete}
                  className="border-2 p-2 px-5 border-border bg-background text-text rounded-md text-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Yes, Delete Role
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
