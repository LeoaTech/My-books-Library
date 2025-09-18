import React, { useEffect, useMemo, useState } from "react";
import {
  MdOutlineDeleteOutline,
  MdShoppingBag,
} from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBookingApi } from "../../../../../hooks/bookings/useBookingsApi";
import LoadingSpinner from "../../../Loader/LoadingSpinner";
import { useFetchUserRoles } from "../../../../../hooks/users/useFetchUserRoles";
import { useFetchBooks } from "../../../../../hooks/books/useFetchBooks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as z from "zod";
import { addDays, differenceInDays } from "date-fns";
import { useFetchVendors } from "../../../../../hooks/books/useFetchVendors";
import { bookItemsSchema } from "../../../../../schemas/books";
import Select, { components } from "react-select"
import { getCustomSelectStyles } from "../../../shared/CreatableSelectCustomStyles";

// Booking Form Schema
const bookingSchema = z.object({
  borrow_date: z.date({
    required_error: "Borrow date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  user_id: z.coerce.number({
    required_error: "Please select a user.",
    invalid_type_error: "User ID must be a number."
  }).min(1, { message: "Please select a user ID." }),
  status: z.enum(["issued", "returned", "overdue", "renewed"]).default("issued"),
  shipping_address: z.string(),//.min(1, { message: "Shipping Address must be required" }),
  shipping_city: z.string(),//.min(1, { message: "Shipping City must be required" }),
  shipping_country: z.string(),//.min(1, { message: "Shipping Country must be required" }),
  shipping_phone: z.string(),//.min(1, { message: "Phone Number must be required" }),
  credits_used: z.coerce.number().default(0) || z.unknown(),
  renewed: z.boolean().optional().default(false),
  items: z.array(bookItemsSchema)
    .min(1, { message: "1 Book must be selected" }),

  vendor_id: z.coerce.number().min(1, { message: "Please Select a Vendor ID" }) || z.string().min(1, { message: "Vendor ID must be required" }),
  return_due: z.date({
    required_error: "Due date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  return_date: z.date().optional(),
  renew_return_date: z.date().optional(),
})
  .refine((data) => data.return_due > data.borrow_date, {
    message: "Due date must be after the borrow date.",
    path: ["return_due"],
  })
  .refine((data) => {
    if (data.borrow_date && data.return_due && !data?.renewed) {
      const duration = differenceInDays(data.return_due, data.borrow_date);
      return duration <= 15;
    }
    return true;
  }, {
    message: "Duration cannot exceed 15 days.",
    path: ["return_due"],
  });
const bookingStatus = ["issued", "returned", "overdue", "renewed"];

const BookIssue = ({ mode, onClose, booking }) => {
  const queryClient = useQueryClient();

  const theme = localStorage.getItem("color-theme")?.replace(/"/g, '') || "light";
  const selectStyles = useMemo(() => getCustomSelectStyles(theme), [theme]);

  const { createBooking, updateBooking, error, isLoading } = useBookingApi();

  const { data: students, isLoading: isLoadingStudents } = useFetchUserRoles();
  const { isLoading: isBooksLoading, error: isBookFetchingError, data: booksData } = useFetchBooks();
  const { isPending: isPendingVendors, data: vendorsData } = useFetchVendors();

  const {
    register,
    handleSubmit,
    reset,
    watch, control, setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    defaultValues: booking && mode == "edit" ? {
      ...booking,
      borrow_date: booking.borrow_date ? new Date(booking.borrow_date) : null,
      return_due: booking.return_due ? new Date(booking.return_due) : null,
      return_date: booking?.return_date ? new Date(booking.return_date) : undefined,
      renew_return_date: booking?.renew_return_date ? new Date(booking?.renew_return_date) : undefined,
      items: booking.items || [],
      user_id: booking.user_id || null,
      vendor_id: booking.vendor_id || null,
      credits_used: booking.credits_used || 0,
      renewed: booking.renewed || false,
      shipping_address: booking.shipping_address || "",
      shipping_city: booking.shipping_city || "",
      shipping_country: booking.shipping_country || "",
      shipping_phone: booking.shipping_phone || "",
      status: booking.booking_status || "issued",
    } : {
      items: [],
      status: "issued",
      bookingDuration: null,
      borrow_date: null,
      return_due: null,
      return_date: undefined,
      renew_return_date: undefined,
      credits_used: 0,
      vendor_id: undefined,
      shipping_city: "",
      shipping_country: "",
      shipping_address: "",
      shipping_phone: "",
      user_id: null,
    },
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  const borrowDate = watch("borrow_date");
  const returnDue = watch("return_due");
  const renewed = watch("renewed");
  const bookItems = watch('items') || [];
  const returnDate = watch("return_date");

  const selectedValues = mode == "edit" && bookItems?.map(book => ({
    value: book.id,
    label: book.title,
    ...book,
  }));


  useEffect(() => {
    // when the renewed checkbox is selected
    if (renewed) {
      setValue("return_date", undefined, { shouldValidate: true });
      setValue("status", "renewed", { shouldValidate: true });

      if (booking?.renew_return_date) {
        setValue("return_due", new Date(booking.renew_return_date), { shouldValidate: true });
      }
    } else {
      // clear the date selections 
      setValue("renew_return_date", undefined, { shouldValidate: true });
      setValue("return_date", undefined, { shouldValidate: true });

      if (mode === "edit" && booking) {
        // reset original values
        setValue("return_due", new Date(booking.return_due), { shouldValidate: true });
        setValue("status", booking.booking_status, { shouldValidate: true });
        setValue("return_date", undefined, { shouldValidate: true });
      }
    }
  }, [renewed, setValue, mode, booking])


  useEffect(() => {
    if (returnDate instanceof Date) {
      setValue("status", "returned", { shouldValidate: true });
    }
  }, [returnDate, setValue]);

  const usersOptions = useMemo(
    () =>
      students?.data?.map((user) => ({
        value: user.user_id,
        label: user.name,
      })) ?? [],
    [students?.data]
  );

  const booksOptions = useMemo(
    () =>
      booksData?.books?.map((book) => ({
        value: book.id,
        label: book.title,
        ...book
      })) ?? [],
    [booksData?.books]
  );

  // Mutation to create new booking 
  const { mutateAsync: createBookingMutation } = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["bookings"]);
      onClose();
    },
    onError: (err) => {
      console.error("Error creating new booking:", err);
      onClose();
    },
  });

  const { mutateAsync: updateBookingMutation } = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["bookings"]);
      onClose();
    },
    onError: (err) => {
      console.error("Error updating booking:", err);
      onClose();
    },
  });

  console.log(errors, "Form errors");
  const onSubmit = async (updateData) => {
    // console.log(updateData, "Form");
    if (mode == "edit") {
      const bookingData = {
        ...updateData,
        booking_id: booking?.booking_id
      };
          // console.log(bookingData, "Form with id");

      await updateBookingMutation(bookingData)
    } else {
      const bookingData = {
        ...updateData,
        status: "issued",
      };
      // console.log(bookingData, "Issue Books Form");

      await createBookingMutation(bookingData);
    }
  };


  // To hide the selected book items displaying in the input field
  const NoopMultiValue = (props) => {
    return null;
  };

  const CustomValueContainer = ({ children, ...props }) => {
    const filteredChildren = React.Children.toArray(children).filter(child => {
      return child.type != components.MultiValue;
    });
    return <components.ValueContainer {...props}>{filteredChildren}</components.ValueContainer>;
  };

  console.log(booking);

  // console.log(watch("items"), "items");



  return (
    <div className="fixed left-0 top-0  inset-0 bg-[#64748B] bg-opacity-75 transition-opacity dark:bg-slate-300 dark:bg-opacity-75 lg:left-[18rem]">
      <div className="relative p-5 rounded-md">
        {/* Modal Close Button */}
        <div className="flex justify-end p-5 md:p-10  ">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "#FFF",
              strokeWidth: 2,
            }}
            onClick={onClose}
          />
        </div>
        <div className=" md:mx-20">
          <div className=" p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
            <div className=" flex justify-between items-center rounded-sm p-3 bg-slate-100 border border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47] dark:bg-[#2E3A47]">
              <h3 className="font-bold text-[#313D4A] dark:text-white">
                {mode == "edit" ? "Edit Booking" : "Issue Books"}
              </h3>

            </div>



            <div className="max-h-[600px] px-12 w-full overflow-hidden overflow-y-auto text-slate-800">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6.5 m-5.5 sm:overflow-auto sm:p-2 sm:m-2">

                  {/* Select User or (student_id) */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Select User
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                        <Controller
                          name="user_id"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={usersOptions}
                              isClearable
                              isDisabled={isLoadingStudents}
                              isLoading={isLoadingStudents}
                              styles={selectStyles}
                              placeholder="Search for a user..."
                              value={usersOptions?.find(option => option.value == field.value) || null}
                              onChange={(option) => {
                                field.onChange(option ? option.value : null);
                              }}
                              className="text-sm"
                              classNamePrefix="react-select"
                            />
                          )}
                        />

                      </div>
                      {errors?.user_id && <p className="text-red-500 text-xs mt-1">{errors?.user_id?.message}</p>}

                    </div>
                    {/* Select Books items for students */}
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                        Select Books
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">

                        <Controller
                          name="items"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={booksOptions}
                              placeholder="Search for books..."
                              isMulti
                              components={{
                                MultiValue: NoopMultiValue,
                                ValueContainer: CustomValueContainer
                              }}
                              value={mode == "edit" ? selectedValues : field.value || []}
                              onChange={(options) => {
                                field.onChange(options || []);
                              }}
                              className="text-sm"
                              classNamePrefix="react-select"
                              isClearable
                              isDisabled={isBooksLoading || field.value?.length >= 5}
                              isLoading={isBooksLoading}
                              styles={selectStyles}
                            />
                          )}
                        />
                      </div>
                      {errors.items && (
                        <p className="text-red-600 text-sm mt-1">{errors?.items?.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Booked Items List */}
                  {bookItems?.length > 0 && (
                    <div className="flex flex-col md:gap-5 my-5">
                      <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                        <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Selected Items List</legend>

                        <ul className="ml-10 mt-3 font-medium text-md text-slate-400">
                          {bookItems?.map((book, index) => (
                            <li key={book?.id || index + 1} className="mb-2 flex justify-between items-center">
                              <div>
                                <span className="font-semibold flex items-center gap-2 text-slate-500 dark:text-neutral-100">
                                  <MdShoppingBag />
                                  Book {index + 1}
                                </span>
                                <p className="text-blue-500 ml-8 mt-2 text-lg">{book.title}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const filteredIds = bookItems.filter(b => b.id != book.id);
                                  setValue("items", filteredIds, { shouldValidate: true });
                                }}
                                className="text-red-500"
                              >
                                <MdOutlineDeleteOutline size={25} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </fieldset>
                    </div>
                  )}


                  {/* Booking Duration and Date Selections  */}

                  <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                    <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Booking Info</legend>
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Select Starting Date
                          <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="borrow_date"
                          control={control}

                          render={({ field }) => (
                            <DatePicker
                              disabled={mode === "edit"}
                              selected={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                                if (date) {
                                  setValue("return_due", addDays(date, 7), { shouldValidate: true });
                                }
                              }}
                              placeholderText="Borrow Date"
                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              dateFormat="yyyy-MM-dd"
                              minDate={new Date()}
                              isClearable

                            />
                          )}
                        />
                        {errors.borrow_date && (
                          <p className="text-red-600 text-sm mt-1">{errors.borrow_date.message}</p>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Select Due Date
                          <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="return_due"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={mode === "edit"}
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              placeholderText="Due Date"
                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              dateFormat="yyyy-MM-dd"
                              isClearable
                              minDate={borrowDate || new Date()}
                              maxDate={borrowDate ? addDays(borrowDate, 15) : null}

                            />
                          )}
                        />
                        {errors.return_due && (
                          <p className="text-red-600 text-sm mt-1">{errors.return_due.message}</p>
                        )}
                      </div>
                    </div>
                    {mode === "edit" && <div className="mt-8 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                      {/* Select if user want to renew the returning or not */}
                      <div className="w-full">

                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="renewed"
                            {...register("renewed")}
                            className="rounded bg-gray-200 border-transparent h-4 w-4 p-5 ml-2 focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                          />
                          <span className="ml-2  text-[#0284c7] dark:text-white">
                            Do you want to extend the return date?
                          </span>
                        </label>
                      </div>

                    </div>


                    }
                    {mode === "edit" && <div className="mt-6 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      {/* If renewed is selected, select the new return date */}
                      {renewed ? <div className="w-full ">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Select Renew Return Date
                        </label>
                        <Controller
                          name="renew_return_date"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={!renewed}
                              selected={field.value}
                              onChange={(date) => {
                                field.onChange(date);

                                if (date) {
                                  setValue("return_due", date, { shouldValidate: true });
                                }
                              }}
                              placeholderText="New Return Date"
                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              dateFormat="yyyy-MM-dd"
                              minDate={returnDue || new Date()}
                              maxDate={returnDue ? addDays(returnDue, 15) : null} //extend return date for 15 days

                            />
                          )}
                        />
                        <p style={{ fontSize: '0.8em', marginTop: "10px", color: 'orange' }}>
                          Extends the due date by up to 15 days from the original due date.
                        </p>
                        {errors.renew_return_date && (
                          <p className="text-red-600 text-sm mt-1">{errors.renew_return_date.message}</p>
                        )}
                      </div> : <div className="w-full ">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Select Return Date
                        </label>
                        <Controller
                          name="return_date"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={renewed}
                              selected={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                                if (date) {
                                  setValue("status", "returned", { shouldValidate: true });
                                }
                              }}
                              placeholderText="Return Date"
                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              dateFormat="yyyy-MM-dd"
                              minDate={borrowDate || new Date()}
                              maxDate={addDays(returnDue, 30) || returnDue}

                            />
                          )}
                        />
                        <p style={{ fontSize: '0.8em', marginTop: "10px", color: 'green' }}>
                          Use this field to record when the book items were returned.
                        </p>
                        {errors.return_date && (
                          <p className="text-red-600 text-sm mt-1">{errors.return_date.message}</p>
                        )}
                      </div>}
                    </div>}


                  </fieldset>

                  {/* Booking Status */}
                  <fieldset className="border mt-8 border-gray-300 dark:border-gray-600 rounded p-4">
                    <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Booking Status</legend>
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                          Select Booking Status
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                          <select
                            className="relative z-20 w-full appearance-none dark:text-white rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                            {...register("status")}
                            style={{
                              maxWidth: "100%",
                            }}
                          >
                            <option disabled value="">Select status</option>
                            {bookingStatus?.map((status) => (
                              <option
                                key={status}
                                value={status}
                                disabled={mode === "create" && status != "issued"}
                                className="truncate"
                                style={{
                                  maxWidth: "100%",
                                  whiteSpace: "normal",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  wordBreak: "break-all"
                                }}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                          <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                            <svg
                              className="fill-[#64748B] hover:fill-[#3C50E0] dark:fill-[#AEB7C0] dark:hover:fill-[#3C50E0]"
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
                        {errors?.status &&
                          <p className="text-red-500 text-xs mt-1">{errors?.status?.message}</p>}

                      </div>
                    </div>
                  </fieldset>


                  {/* Shipping Info */}
                  <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                    <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Shipping Details</legend>
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Shipping Address
                          {/* <span className="text-red-600">*</span> */}
                        </label>

                        <input
                          type="text"
                          name="shipping_address"
                          {...register("shipping_address")}
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        {errors?.shipping_address &&
                          <p className="text-red-500 text-xs mt-1">{errors?.shipping_address?.message}</p>}

                      </div>
                      <div className="w-full xl:w-1/2">

                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Shipping City
                          {/* <span className="text-red-600">*</span> */}
                        </label>



                        <input
                          type="text"
                          name="shipping_city"
                          {...register("shipping_city")}
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        {errors?.shipping_city && <p className="text-red-500 text-xs mt-1">{errors?.shipping_city?.message}</p>}

                      </div>
                    </div>
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Shipping Country
                          {/* <span className="text-red-600">*</span> */}
                        </label>


                        <input
                          type="text"
                          name="shipping_country"
                          {...register("shipping_country")}
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        {errors?.shipping_country && <p className="text-red-500 text-xs mt-1">{errors?.shipping_country?.message}</p>}

                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Phone Number
                          {/* <span className="text-red-600">*</span> */}
                        </label>

                        <input
                          type="text"
                          name="shipping_phone"
                          {...register("shipping_phone")}
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        {errors?.shipping_phone && <p className="text-red-500 text-xs mt-1">{errors?.shipping_phone?.message}</p>}

                      </div>
                    </div>
                  </fieldset>

                  {/* Select Vendor and Credits Info */}
                  <div className="mt-8 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">

                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Select Vendor
                        <span className="text-red-600">*</span>

                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          className="relative z-20 w-full appearance-none dark:text-white rounded-sm border border-[#E2E8F0] bg-transparent dark:text-white py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          {...register("vendor_id", { required: true })}
                        >
                          <option value="">Select Vendor</option>
                          {vendorsData?.vendors &&
                            vendorsData?.vendors?.map((vendor) => (
                              <option key={vendor?.id} value={vendor?.id}>
                                {vendor?.name}
                              </option>
                            ))}
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className=" dark:text-white fill-current"
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
                      </div> {errors?.vendor_id?.message && (
                        <p className="format-message error">
                          {errors?.vendor_id?.message}
                        </p>
                      )}

                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Credits Used
                        <span className="text-gray-600">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="credits_used"
                        {...register("credits_used")}

                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                    </div>
                  </div>
                  {/* Footer with Action buttons */}
                  <div className="flex justify-end gap-10 mt-10 mb-10">
                    <button
                      type="button"
                      className="bg-slate-600 text-white font-medium text-md cursor-pointer p-2 px-5 rounded-md "
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isDirty || isSubmitting || isLoading}
                      type="submit"
                      className="bg-orange-400 text-white font-medium text-md cursor-pointer disabled:cursor-not-allowed p-2 px-5 rounded-md "
                    >
                      {isLoading ? <LoadingSpinner /> : mode === "edit" ? "Update Booking" : "Issue Book"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default BookIssue;
