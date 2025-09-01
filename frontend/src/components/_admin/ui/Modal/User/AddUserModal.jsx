import { useForm } from "react-hook-form";
import { useFetchRoles } from "../../../../../hooks/users/roles/useFetchRole.js";
import { useQueryClient } from "@tanstack/react-query";
import { RxCross1 } from "react-icons/rx";
import LoadingSpinner from "../../../Loader/LoadingSpinner.jsx";
import Loader from "../../../Loader/Loader.jsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthContext } from "../../../../../hooks/useAuthContext.js";
import { BASE_URL } from "../../../../../utiliz/baseAPIURL.js";
import { toast } from "react-toastify";


const AddUserModal = ({ setOpenModal }) => {
  const { auth } = useAuthContext();
  const { isPending, data, error } = useFetchRoles();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(z.object({
      name: z.string().min(1, { message: 'Name is required' }),
      address: z.string(),//.min(1, { message: 'address is required' }),
      city: z.string(),//.min(1, { message: 'City is required' }),
      country: z.string(),//.min(1, { message: 'Country is required' }),
      phone: z.string(),//.min(1, { message: 'Phone is required' }).regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }),
      email: z.string().email({ message: 'Invalid email address' }),
      role_id: z
        .string()
        .min(1, { message: 'Role is required' })
        .refine(
          (val) => data.roles.some((role) => role.role_id.toString() == val),
          { message: 'Invalid role selected' }
        ),
      password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    })),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      country: '',
      phone: '',
      email: '',
      password: '',
      role_id: '',
    },
  });


  console.log(errors, "Errors")
  const onSubmit = async (data) => {
    try {

      // Form Payload
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
        role_id: data?.role_id
      };

      // Call API to create user and assign a role
      const response = await fetch(`${BASE_URL}/users/create-new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // console.log(response, "Add User API response");

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const result = await response.json();
      console.log('user created:', result);
      toast.success('user added successfully!');
      reset();
      queryClient.invalidateQueries("users")
      setOpenModal((prev) => !prev)
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to Create new User');
      reset();
      setOpenModal((prev) => !prev)
    }
  };

  // console.log(data, isPending, error);



  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/75 lg:left-[18rem]">
        <div className="relative bg-neutral-50 overflow-y-auto dark:border-[#2E3A47] dark:bg-[#24303F] p-10 rounded-md shadow-lg">
          {/* Modal Close button */}
          <div className="absolute top-4 right-4">
            <RxCross1
              style={{
                height: 18,
                width: 23,
                cursor: "pointer",
                color: "#FFF",
                strokeWidth: 2,
              }}
              onClick={() => setOpenModal(prev => !prev)}
            />
          </div>

          <div className="flex flex-col justify-between items-center gap-5">
            <h3 className="mb-5 font-bold text-[#313D4A] dark:text-white">
              Create User
            </h3>
            <div>
              <Loader />
            </div>

          </div>

        </div></div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/65 lg:left-[18rem]">
        <div className="relative bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-10 rounded-md shadow-lg">
          {/* Modal Close button */}
          <div className="absolute top-4 right-4">
            <RxCross1
              style={{
                height: 18,
                width: 23,
                cursor: "pointer",
                color: "#FFF",
                strokeWidth: 2,
              }}
              onClick={() => setOpenModal(prev => !prev)}
            />
          </div>

          <div className="flex flex-col justify-between items-center gap-5">
            <h3 className="mb-5 font-bold text-[#313D4A] dark:text-white">
              Create User
            </h3>
            <div>
              <Loader />
            </div>

          </div>

        </div></div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/65 lg:left-[18rem]">
      <div className="relative bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-10 rounded-md shadow-lg ">
        {/* Modal Close button */}
        <div className="absolute top-4 right-4">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "#FFF",
              strokeWidth: 2,
            }}
            onClick={() => setOpenModal(prev => !prev)}
          />
        </div>

        <div className="flex flex-col justify-between items-center gap-5  overflow-hidden">
          <h3 className="mb-5 font-bold text-[#313D4A] dark:text-white">
            Add New User
          </h3>

          <div className="flex justify-between h-[500px] md:h-full overflow-hidden rounded-sm border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47] ">
            <div className="flex-1 overflow-y-auto p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                  <div className="w-full" autoFocus>
                    <label htmlFor="name" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Full Name
                    </label>
                    <input

                      id="name" {...register('name')}
                      className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="w-full">
                    <label htmlFor="email" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Email
                    </label>
                    <input id="email" type="email" {...register('email')} className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                  <div className="w-full">
                    <label htmlFor="password" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Password
                    </label>
                    <input id="password" type="password" {...register('password')} className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="w-full">
                    <label htmlFor="phone" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Phone
                    </label>
                    <input id="phone" {...register('phone')}
                      className="w-full mb-4 rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="address"

                    className="mb-2.5 block text-[#0284c7] dark:text-white">
                    Address
                  </label>
                  <textarea id="address" {...register('address')} className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                  <div>
                    <label htmlFor="city" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      City
                    </label>
                    <input id="city" {...register('city')}
                      className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="country" className="mb-2.5 block text-[#0284c7] dark:text-white">
                      Country
                    </label>
                    <input id="country" {...register('country')}
                      className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                  </div>
                </div>

                <div className="w-full mb-10">
                  <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                    Roles
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                    <select
                      className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      {...register("role_id")}
                    >
                      <option disabled value="">Select</option>
                      {data &&
                        data?.roles?.map((role) => (
                          <option value={role?.role_id} key={role?.role_id}
                            disabled={auth.role_name == "owner" && role.name === auth.role_name}>
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
                  {errors?.role_id && <p className="text-red-500 text-xs mt-1">{errors?.role_id?.message}</p>}

                </div>


                <button type="submit" disabled={isSubmitting}

                  className="w-full mt-4  bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                >
                  {isSubmitting ? <LoadingSpinner /> : 'Create User'}
                </button>
              </form>
              </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AddUserModal;
