import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const BranchForm = ({
    initialData,
    saveBranch,
    onCancel
}) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(z.object({
            name: z.string().min(1, { message: 'Name is required' }),
            address: z.string().optional(),
            city: z.string().optional(),
            country: z.string().optional(),
            phone: z.string().optional(),

        })),
        defaultValues: {
            name: initialData?.name || '',
            city: initialData?.city || '',
            country: initialData?.country || '',
            address: initialData?.address || "",
            phone: initialData?.phone || ""
        },
    });

    const onSubmit = async (data) => {
        const loadingText = initialData ? "Updating branch data.." : "Creating branch";
        const toastId = toast.loading(loadingText)
        try {// console.log(data, "Branch");
            // Form Payload
            const payload = {
                name: data.name,
                address: data.address,
                city: data.city,
                country: data.country,
                phone: data.phone

            };
            await saveBranch(payload);
            if (initialData) {
                toast.update(toastId, {
                    render: 'Branch updated successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                toast.update(toastId, {
                    render: 'Branch created successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.update(toastId, {
                render: `Error: ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 1000,
            });
        }

    };
    return (
        <div className=" md:mx-20">
            {/* Form Heading */}
            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                    {initialData ? 'Edit Branch' : 'Create Branch'}
                </h3>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-1">
                    <label htmlFor="address" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Branch Name</label>
                    <input
                        id="name"
                        {...register('name', { required: true })}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

                </div>

                <div className="mb-1" >
                    <label htmlFor="address" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Address
                    </label>
                    <input

                        id="address" {...register('address')}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div className="mb-1" >
                    <label htmlFor="city" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        City
                    </label>
                    <input

                        id="city" {...register('city')}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div className="mb-1">
                    <label htmlFor="phone" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Phone
                    </label>
                    <input id="phone" {...register('phone')}
                        className="w-full mb-4 rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
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
                <div className="mt-4 px-4 py-3 sm:flex sm:flex-row-reverse gap-3 sm:px-6">
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        {isSubmitting ? "Saving" : "Save"}
                    </button>
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BranchForm