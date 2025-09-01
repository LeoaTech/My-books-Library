import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const CoverForm = ({
    initialData,
    saveCover,
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

        })),
        defaultValues: {
            name: initialData?.name || '',
        },
    });

    const onSubmit = async (data) => {
        // console.log(data, "cover");
      
       if(initialData){
         await saveCover({...initialData,name:data.name});
       }else{
         await saveCover(data.name);
       }
    };
    return (
        <div className=" md:mx-20">
            {/* Form Heading */}
            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                    {initialData ? 'Edit Cover' : 'Create Cover'}
                </h3>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="links" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Cover Name</label>
                    <input
                        id="name"
                        {...register('name', { required: true })}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

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

export default CoverForm