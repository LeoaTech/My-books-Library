import { useForm } from "react-hook-form";
import { useChangeUserRole } from "../../../../../hooks/users/roles/useUpdateRole";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const PermissionCard = ({ permission }) => {
  return (
    <span className="flex justify-between items-center gap-4">
      {permission}
    </span>
  );
};
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
    <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity">
      {/* <div className="relative p-5 bg-[#F5F7FD] rounded-sm"> */}
      <div className="flex justify-center items-center fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="">
          {/* <!--User Details Form --> */}
          <div className="relative rounded-sm border py-8 px-20 border-[#E2E8F0] bg-white shadow-default dark:border-[#E2E8F0] dark:bg-[#AEB7C0]">
            <h3 className="mb-5 font-bold text-[#313D4A] dark:text-white">
              User Details
            </h3>
            <div className="flex justify-between rounded-md border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#E2E8F0]">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-4.5 m-5.5 sm:overflow-auto">
                  {/* first Row fields */}
                  <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:gap-9 mb-6">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Email
                      </label>
                      <input
                        type="text"
                        readOnly
                        {...register("email")}
                        className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Role ID
                      </label>
                      <input
                        type="text"
                        readOnly
                        {...register("role_id")}
                        className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                    </div>
                  </div>

                  {/*Second Row fields  */}

                  <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:gap-9 mb-6">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        {...register("name")}
                        className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Phone
                      </label>
                      <input
                        type="text"
                        readOnly
                        {...register("phone")}
                        placeholder="22 333 234234"
                        className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                    </div>
                  </div>

                  {/* Third row fields */}
                  <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:gap-9 mb-6">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Address
                      </label>
                      <input
                        type="text"
                        readOnly
                        placeholder="NYC, USA"
                        {...register("address")}
                        className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                    </div>
                  </div>

                  {/* Submit or Close button */}
                  <div className="mt-20 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      disabled={!isDirty || isSubmitting || !isValid}
                      className="inline-flex w-full justify-center rounded-md bg-[#dd3d21] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setDetails(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default ViewUserDetails;
