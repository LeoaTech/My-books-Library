import React from "react";
import { useForm } from "react-hook-form";
import { useFetchRoles } from "../../../../../hooks/users/roles/useFetchRole";

const UpdatRolesModal = ({ setOpenModal, currentUser }) => {
  const { isPending, data } = useFetchRoles();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful, isDirty },
  } = useForm({
    defaultValues: {
      ...currentUser,
    },
  });

  const onSubmit = (data) => {

    console.log(data)
    // await UpdateRoles(data)
  };

  console.log(data);
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-body bg-opacity-75 transition-opacity">
      {/* <div className="relative p-5 bg-whiter rounded-sm"> */}
      <div className="flex justify-center items-center fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="">
          {/* <!--Book Details Form --> */}
          <div className="relative rounded-sm border py-8 px-20 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-5 font-bold text-meta-4 dark:text-white">
              Update Roles
            </h3>
            <div className="flex justify-between rounded-sm border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6.5 m-5.5 sm:overflow-auto">
                  {/* first Row fields */}
                  <div className="mb-4.5 flex flex-col gap-6 md:flex-row md:gap-9 mb-6">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-meta-5 dark:text-white">
                        Email
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your Email Address"
                        {...register("email")}
                        className="w-full rounded-sm border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      />
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-meta-5 dark:text-white">
                        Roles
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          className="relative z-20 w-full appearance-none rounded-sm border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          {...register("role_name")}
                        >
                          {data &&
                            data?.roles?.map((role) => (
                              <option value={role?.id} key={role?.id}>
                                {role?.name}
                              </option>
                            ))}
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit or Close button */}
                  <div className="mt-20 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-meta-6 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpenModal(false)}
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

export default UpdatRolesModal;
