import { useForm } from "react-hook-form";
import { useChangeUserRole } from "../../../../../hooks/users/roles/useUpdateRole";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RxCross1 } from "react-icons/rx";


const ViewUserDetails = ({ setDetails, userData }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm({
    defaultValues: {
      ...userData,
    },
  });
  const { isLoading, deleteUser } = useChangeUserRole();

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["users"]);
      setDetails(false);
    },
  });

  const onSubmit = async (data) => {
    await deleteUserMutation(data);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-[#64748B] bg-opacity-75 transition-opacity z-50">
      <div className="relative bg-surface shadow-lg p-5 rounded-md w-full mx-auto my-auto max-w-xl ">
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
            onClick={() => setDetails(prev => !prev)}
          />
        </div>

        <div className="flex justify-start items-start gap-5">
          <h3 className="mb-10 font-bold text-text text-lg">
            User Details
          </h3></div>
        <div className="flex justify-center items-center rounded-sm border-b border-border py-4 px-6.5 ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4.5 m-5.5 sm:overflow-auto">
              {/* first Row fields */}
              <div className="mb-4.5 flex flex-col gap-6 mb-6">
                <div className="w-full " autoFocus>
                  <label className="mb-2.5 block text-text">
                    Email
                  </label>
                  <input
                    type="text"
                    readOnly
                    {...register("email")}
                    className="w-full rounded-sm border-[1.5px] border-border text-text bg-background py-3 px-5 font-medium outline-none transition focus:border-border active:border-border disabled:cursor-default disabled:bg-border"
                  />
                </div>

                <div className="w-full ">
                  <label className="mb-2.5 block text-text">
                    Role ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    {...register("role_id")}
                    className="w-full rounded-sm border-[1.5px] border-border text-text bg-background py-3 px-5 font-medium outline-none transition focus:border-border active:border-border disabled:cursor-default disabled:bg-border"
                  />
                </div>
              </div>

              {/*Second Row fields  */}

              <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:gap-9 mb-6">
                <div className="w-full " autoFocus>
                  <label className="mb-2.5 block text-text">
                    Name
                  </label>
                  <input
                    type="text"
                    readOnly
                    {...register("name")}
                    className="w-full rounded-sm border-[1.5px] border-border text-text bg-background py-3 px-5 font-medium outline-none transition focus:border-border active:border-border disabled:cursor-default disabled:bg-border"
                  />
                </div>
              </div>
              {/* <div className="w-full ">
                    <label className="mb-2.5 block text-text">
                      Phone
                    </label>
                    <input
                      type="text"
                      readOnly
                      {...register("phone")}
                      placeholder="22 333 234234"
                      className="w-full rounded-sm border-[1.5px] border-border text-text bg-background py-3 px-5 font-medium outline-none transition focus:border-border active:border-border disabled:cursor-default disabled:bg-border"
                    />
                  </div>
               

                {/* Third row fields */}
              {/* <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:gap-9 mb-6">
                  <div className="w-full " autoFocus>
                    <label className="mb-2.5 block text-text">
                      Address
                    </label>
                    <input
                      type="text"
                      readOnly
                      placeholder="NYC, USA"
                      {...register("address")}
                      className="w-full rounded-sm border-[1.5px] border-border text-text bg-background py-3 px-5 font-medium outline-none transition focus:border-border active:border-border disabled:cursor-default disabled:bg-border"
                    />
                  </div>
                </div>  */}
              {/* Submit or Close button */}
              <div className="mt-10 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {/* <button
                      type="submit"
                      disabled={!isDirty || isSubmitting || !isValid}
                      className="inline-flex w-full justify-center rounded-md bg-[#dd3d21] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
                    >
                      Delete
                    </button> */}
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-text shadow-sm ring-1 ring-inset ring-border hover:bg-border sm:mt-0 sm:w-auto"
                  onClick={() => setDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>

  );
};

export default ViewUserDetails;
