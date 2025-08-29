import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { RxCross1 } from 'react-icons/rx';
import { z } from 'zod';

const AuthorsForm = ({
    initialData,
    saveAuthor,
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
            links: z
                .string()
                .optional()
                .refine((val) => !val || /^https:\/\/.+/.test(val), {
                    message: "URL must start with https://",
                }),
            description: z.string().optional(),
        })),
        defaultValues: {
            name: initialData?.name || '',
            links: initialData?.links || '',
            description: initialData?.description || '',
        },
    });

    const onSubmit = async (data) => {
        console.log(data, "Author");
        // Form Payload
        const payload = {
            name: data.name,
            links: data.links,
            description: data.description,
        };
        await saveAuthor(payload);
    };
    return (
        <div className=" md:mx-20">
            {/* Form Heading */}
            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                    {initialData ? 'Edit Author' : 'Create Author'}
                </h3>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <label htmlFor="links" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Author Name</label>
                    <input
                        id="name"
                        {...register('name', { required: true })}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

                </div>

                <div className="w-full" autoFocus>
                    <label htmlFor="links" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Add Links
                    </label>
                    <input

                        id="links" {...register('links')}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.links && <p className="text-red-500 text-xs mt-1">{errors.links.message}</p>}
                </div>

                <div className="w-full" autoFocus>
                    <label htmlFor="description" className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Description
                    </label>
                    <input

                        id="description" {...register('description')}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"

                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
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

export default AuthorsForm