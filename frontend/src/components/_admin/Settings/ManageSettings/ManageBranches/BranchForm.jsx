import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RxCross1 } from 'react-icons/rx';
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
        try {
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
        <>
            <div className="flex justify-end items-end ">
                <RxCross1
                    style={{
                        height: 18,
                        width: 18,
                        cursor: "pointer",
                        color: "var(--color-text)",
                        strokeWidth: 2,
                    }}
                    onClick={onCancel}
                />
            </div>
            <div className=" md:mx-20">
                {/* Form Heading */}
                <div className="rounded-sm p-3 mb-8 border-b border-border py-4 px-6.5 ">
                    <h3 className="font-bold text-text">
                        {initialData ? 'Edit Branch' : 'Create Branch'}
                    </h3>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-1">
                        <label htmlFor="address" className="mb-2.5 block text-text">
                            Branch Name</label>
                        <input
                            id="name"
                            {...register('name', { required: true })}
                            className="w-full rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] "
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

                    </div>

                    <div className="mb-1" >
                        <label htmlFor="address" className="mb-2.5 block text-text">
                            Address
                        </label>
                        <input

                            id="address" {...register('address')}
                            className="w-full rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] "

                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>

                    <div className="mb-1" >
                        <label htmlFor="city" className="mb-2.5 block text-text">
                            City
                        </label>
                        <input

                            id="city" {...register('city')}
                            className="w-full rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] "

                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>

                    <div className="mb-1">
                        <label htmlFor="phone" className="mb-2.5 block text-text">
                            Phone
                        </label>
                        <input id="phone" {...register('phone')}
                            className="w-full mb-4 rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] " />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="country" className="mb-2.5 block text-text">
                            Country
                        </label>
                        <input id="country" {...register('country')}
                            className="w-full rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] "

                        />
                        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                    </div>
                    <div className="mt-4 px-4 py-3 sm:flex sm:flex-row-reverse gap-3 sm:px-6">
                        <button type="submit" className={`flex items-center border-2 border-border gap-2 bg-background text-text px-4 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? "Saving" : "Save"}
                        </button>
                        <button type="button" onClick={onCancel} className="bg-white text-text py-2 px-4 rounded hover:bg-background">
                            Cancel
                        </button>
                    </div>
                </form>
            </div></>
    );
}

export default BranchForm