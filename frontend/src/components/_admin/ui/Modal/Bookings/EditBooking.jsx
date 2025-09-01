import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

// Mock: Replace with actual update mutation hook
const useUpdateBooking = () => useMutation({
  mutationFn: async (data) => {
    // Call your API
    console.log("Updating with: ", data);
    return data;
  }
});

const bookingSchema = z.object({
  userName: z.string().min(1),
  userEmail: z.string().email(),
  userAddress: z.string().optional(),

  vendorShop: z.string().min(1),
  vendorName: z.string().min(1),
  vendorEmail: z.string().email(),
  vendorBranch: z.string().optional(),

  bookingDuration: z.string().min(1),
  creationDate: z.string().min(1),
  returnDate: z.string().min(1),
  dueDate: z.string().min(1),

  status: z.string().min(1),
  renewStatus: z.string().min(1),
  creditsUsed: z.coerce.number()
});


const EditBookingDetails = ({ close, bookingValue }) => {
  console.log(bookingValue);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: bookingValue,
  });

  const { mutate: updateBooking, isLoading } = useUpdateBooking();

  useEffect(() => {
    if (bookingValue) {
      reset(bookingValue);
    }
  }, [bookingValue, reset]);

  const onSubmit = (data) => {
    updateBooking(data, {
      onSuccess: () => {
        close();
      }
    });
  };


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
          <h3 className="text-lg font-bold mb-2 text-[#313D4A] dark:text-white">
            Edit Booking - ID: <span className="text-yellow-500">{bookingValue?.booking_id}</span>
          </h3>
          <div className="flex justify-between rounded-sm border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]">
            {/* <form >
              <div className="p-6.5 m-5.5 sm:overflow-auto">


                <div className="mt-20 bg-gray-50 dark:bg-[#24303F] px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    // disabled={!isDirty || isSubmitting || !isValid}
                    className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
                  >
                    Update Booking
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
            </form> */}

            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
              {/* <div className="overflow-y-auto px-4 py-3 space-y-5 flex-1"> */}
              <div className="p-6.5 m-5.5 sm:overflow-auto">

                {/* User Details */}
                <fieldset className="border border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-sm text-gray-600 dark:text-gray-300">User Details</legend>
                  <div className="space-y-2">
                    <input {...register("userName")} placeholder="Name" className="w-full input" />
                    {errors.userName && <p className="text-red-500 text-xs">{errors.userName.message}</p>}

                    <input {...register("userEmail")} placeholder="Email" className="w-full input" />
                    {errors.userEmail && <p className="text-red-500 text-xs">{errors.userEmail.message}</p>}

                    <input {...register("userAddress")} placeholder="Address" className="w-full input" />
                  </div>
                </fieldset>

                {/* Vendor Details */}
                <fieldset className="border border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-sm text-gray-600 dark:text-gray-300">Vendor Details</legend>
                  <div className="space-y-2">
                    <input {...register("vendorShop")} placeholder="Shop" className="w-full input" />
                    <input {...register("vendorName")} placeholder="Vendor Name" className="w-full input" />
                    <input {...register("vendorEmail")} placeholder="Email" className="w-full input" />
                    <input {...register("vendorBranch")} placeholder="Branch" className="w-full input" />
                  </div>
                </fieldset>

                {/* Booking Details */}
                <fieldset className="border border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-sm text-gray-600 dark:text-gray-300">Booking Info</legend>
                  <div className="space-y-2">
                    <input {...register("bookingDuration")} placeholder="Duration" className="w-full input" />
                    <input {...register("creationDate")} placeholder="Booking Creation Date" className="w-full input" />
                    <input {...register("returnDate")} placeholder="Return Date" className="w-full input" />
                    <input {...register("dueDate")} placeholder="Due Date" className="w-full input" />
                  </div>
                </fieldset>

                {/* Status Info */}
                <fieldset className="border border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-sm text-gray-600 dark:text-gray-300">Status</legend>
                  <div className="space-y-2">
                    <input {...register("status")} placeholder="Status" className="w-full input" />
                    <input {...register("renewStatus")} placeholder="Renew Return Date Status" className="w-full input" />
                    <input type="number" {...register("credit_used")} placeholder="Credits Used" className="w-full input" />
                  </div>
                </fieldset>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 dark:bg-[#24303F] px-4 py-3 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
                >
                  {isLoading ? "Updating..." : "Update Booking"}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBookingDetails;
