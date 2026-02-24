import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { RxCross1 } from 'react-icons/rx';
import { toast } from 'react-toastify';
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
        const loadingText = initialData ? "Updating author" : "Creating new author";
        const toastId = toast.loading(loadingText)
        try {
            // Form Payload
            const payload = {
                name: data.name,
                links: data.links,
                description: data.description,
            };
            const result = await saveAuthor(payload);

            if (initialData) {
                toast.update(toastId, {
                    render: 'Author updated successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                toast.update(toastId, {
                    render: 'Author created successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            toast.update(toastId, {
                render: `Error: ${error?.message || "Failed to save author"}`,
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
                    <h3 className="font-bold text-text ">
                        {initialData ? 'Edit Author' : 'Create Author'}
                    </h3>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-2">
                        <label htmlFor="links" className="mb-2.5 block text-text">
                            Author Name <span className='text-red-500'>*</span></label>
                        <input
                            id="name"
                            {...register('name', { required: true })}
                            className="w-full rounded-sm border-[1.5px] border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-[#F5F7FD] "
                        />   {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}

                    </div>

                    <div className="mb-2" autoFocus>
                        <label htmlFor="links" className="mb-2.5 block text-text">
                            Add Links
                        </label>
                        <input

                            id="links" {...register('links')}
                            className="w-full rounded-sm border-[1.5px]  border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD]"

                        />
                        {errors.links && <p className="text-red-500 text-xs mt-1">{errors.links.message}</p>}
                    </div>

                    <div className="w-full mb-2" autoFocus>
                        <label htmlFor="description" className="mb-2.5 block text-text">
                            Description
                        </label>
                        <input

                            id="description" {...register('description')}
                            className="w-full rounded-sm border-[1.5px]  border-border bg-background py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD]"

                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="mt-4 px-4 py-3 sm:flex sm:flex-row-reverse gap-3 sm:px-6">
                        <button type="submit" className={`flex items-center border-2 border-border gap-2 bg-background text-text px-4 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}   >
                            {isSubmitting ? "Saving" : "Save"}
                        </button>
                        <button type="button" onClick={onCancel} className="bg-white text-text py-2 px-4 rounded hover:bg-background">
                            Close
                        </button>
                    </div>
                </form>
            </div></>
    );
}

export default AuthorsForm