import React from 'react'
import { RxCross1 } from 'react-icons/rx'

const SkeletonModal = ({title,close,actionButton}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#64748B]/75 dark:bg-slate-300/65 lg:left-[18rem]">
            <div className="relative w-[90%] max-w-md bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-10 rounded-md shadow-lg">
                {/* Modal Close Button */}
                <div className="absolute top-4 right-4">
                    <RxCross1
                        style={{
                            height: 18,
                            width: 23,
                            cursor: "pointer",
                            color: "#FFF",
                            strokeWidth: 2,
                        }}
                        onClick={close}
                    />
                </div>

                <div className="flex flex-col justify-between items-center gap-5">
                    <h3 className="mb-5 font-bold text-[#313D4A] dark:text-white">
                        {title}
                    </h3>
                    <div className="flex justify-between rounded-sm border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]">
                        <form >
                            <div className="p-6.5 m-5.5 sm:overflow-auto">


                                {/* Submit or Close button */}
                                <div className="mt-20 bg-gray-50 dark:bg-[#24303F] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        // disabled={!isDirty || isSubmitting || !isValid}
                                        className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
                                    >
                                        {actionButton}
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={close}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonModal