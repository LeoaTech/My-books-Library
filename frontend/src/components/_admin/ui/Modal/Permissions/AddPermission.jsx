import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePermissions } from "../../../../../hooks/permissions/usePermissions";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

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
    const toastId = toast.loading('Creating new permission...');

    try {
      await NewPermissionMutation(data);
      toast.update(toastId, {
        render: 'Permission added successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error)
      toast.update(toastId, {
        render: `Error: ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }
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
            onClick={onClose}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5">
          <h1 className="text-md font-bold text-text ">New Permission</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2.5 block text-text">
                Name <span className="text-red-500">*</span>
              </label>
              <input autoFocus
                type="text"
                placeholder="Permission Title"

                {...register("name", {
                  required: "Resource Name is Required",
                })}
                className="w-full border-border rounded-sm border-[1.5px] border-stroke bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter "
              />
              <p style={{ fontSize: '0.8em', color: 'var(--color-primary)', marginTop: '5px' }}>Only Enter Resource Name such as branch, role, or author</p> {/* Helper text */}

              {errors?.name?.message && (
                <p className="format-message error">{errors.name.message}</p>
              )}
            </div>
            <div className="mt-5 flex float-right gap-2 md:gap-4 p-5">
              <button
                onClick={onClose}
                className="rounded-md flex items-center border-2 border-gray-200 justify-center bg-transparent px-6 py-2 text-md text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:border-primary"
              >Close</button>
              <button
                className={`flex items-center border-2 border-border gap-2 bg-background text-text px-4 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={!isDirty || !z.isValid || isSubmitting}
              >Add Permission</button>
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

export default NewPermission;
