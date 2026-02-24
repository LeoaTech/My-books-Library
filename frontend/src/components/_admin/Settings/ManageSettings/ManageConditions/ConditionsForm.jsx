import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RxCross1 } from 'react-icons/rx';
import { isDirty, isValid, z } from 'zod';

const ConditionForm = ({
    initialData,
    saveCondition,
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
        if (initialData) {
            await saveCondition({ ...initialData, name: data?.name });
        } else {
            await saveCondition(data?.name);
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
                    <h3 className="font-bold text-text ">
                        {initialData ? 'Edit Condition' : 'Create Condition'}
                    </h3>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label htmlFor="links" className="mb-2.5 block text-text">
                            Title </label>
                        <input
                            id="name"
                            {...register('name', { required: true })}
                            className="w-full rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] "
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

                    </div>


                    <div className="mt-4 px-4 py-3 sm:flex sm:flex-row-reverse gap-3 sm:px-6">
                        <button disabled={!isValid || isSubmitting || !isDirty} type="submit" className={`flex items-center border-2 border-border gap-2 bg-background text-text px-4 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}   >
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

export default ConditionForm