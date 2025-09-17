import React, { useEffect, useMemo, useState } from "react";
import {
  MdLocalAirport,
  MdLocalPhone,
  MdLocationCity,
  MdOutlineCalendarMonth,
  MdOutlineDeleteOutline,
  MdOutlineLocalPhone,
  MdShoppingBag,
} from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { Controller, useController, useForm } from "react-hook-form";
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
import { bookItemsSchema, selectOptionSchema } from "../../../../../schemas/books";
import Select from "react-select"
import { getCustomSelectStyles } from "../../../shared/CreatableSelectCustomStyles";
// Booking Form Schema
const bookingSchema = z.object({
  bookingDuration: z.coerce.number().min(1, "Duration must be at least 1 day.").optional(),
  borrow_date: z.date({
    required_error: "Borrow date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  user_id: z.coerce.number({
    required_error: "Please select a user.",
    invalid_type_error: "User ID must be a number."
  }).min(1, { message: "Please select a user ID." }),
  // user_id:  z.coerce.number().min(1, { message: "Please Select a User ID" }) || z.string().min(1, { message: "User must be selected" }) || z.unknown(),
  status: z.enum(["issued", "returned", "overdue"]).default("issued"),
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
    if (data.borrow_date && data.return_due) {
      const duration = differenceInDays(data.return_due, data.borrow_date);
      return duration <= 15;
    }
    return true;
  }, {
    message: "Duration cannot exceed 15 days.",
    path: ["return_due"],
  });

const BookIssue = ({ onClose }) => {
  const queryClient = useQueryClient();
  const theme = localStorage.getItem("color-theme")?.replace(/"/g, '') || "light";
  const selectStyles = useMemo(() => getCustomSelectStyles(theme), [theme]);

  const { createBooking, error, isLoading } = useBookingApi();

  const { data: students, isLoading: isLoadingStudents } = useFetchUserRoles();
  const { isPending, error: isBookFetchingError, data: booksData } = useFetchBooks();
  const [selectedBooks, setSelectedBooks] = useState([]); //for book items in the order
  const { isPending: isPendingVendors, data: vendorsData } = useFetchVendors();

  const {
    register,
    handleSubmit,
    reset,
    watch, control, setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    defaultValues: {
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
  const bookingStatus = ["issued", "returned", "overdue"];
  const borrowDate = watch("borrow_date");
  const returnDue = watch("return_due");

  const usersOptions = useMemo(
    () =>
      students?.data?.map((user) => ({
        value: user.user_id,
        label: user.name,
      })) ?? [],
    [students?.data]
  );
  

  // handle the calculation for date range selection
  useEffect(() => {
    // verify if both (start and end) dates are selected and are valid Date objects
    if (borrowDate instanceof Date && returnDue instanceof Date) {
      // get the duration in days from both dates
      const duration = differenceInDays(returnDue, borrowDate);
      // Set the calculated  value of duration 
      setValue("bookingDuration", duration, { shouldValidate: true });

    } else {
      // Clear the duration when dates are not valid
      setValue("bookingDuration", null, { shouldValidate: true });

    }
  }, [borrowDate, returnDue, setValue]);


  // Mutation to create new order 
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


  const handleAddBook = (bookId) => {
    if (bookId) {
      const currentBooks = watch('items');

      const book = booksData?.books?.find((b) => b.id == bookId);
      if (book && !selectedBooks.some((b) => b.id == bookId)) {
        setValue("items", [...currentBooks, book], {
          shouldValidate: true,
        });
        setSelectedBooks([...selectedBooks, book]);
      }
    }
  }

  const handleRemoveBook = (bookId) => {
    const currentBooks = watch("items");
    const filteredBooks = currentBooks.filter((book) => book.id != bookId);
    setValue("items", filteredBooks, {
      shouldValidate: true,
    });
    setSelectedBooks(selectedBooks.filter((book) => book.id != bookId));

  };


  // console.log(isValid, "Form valid");
  // console.log(errors, "Form errors");
  const onSubmit = async (updateData) => {
    // console.log(updateData, "Form");
    const bookingData = {
      ...updateData,
      status: "issued",
      items: selectedBooks,
    };
    console.log(bookingData, "Issue Books Form");

    await createBookingMutation(bookingData);
  };


  // console.log(selectedBooks, "Order Items");

  // console.log(watch("user_id"), "user");

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
                Issue Books
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
                        <select
                          className="relative z-20 w-full appearance-none dark:text-white rounded-sm border border-[#E2E8F0] bg-transparent py-3 pl-5 pr-10 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0] text-sm"
                          disabled={selectedBooks?.length > 4}
                          onChange={(e) => handleAddBook(e.target.value)}
                          style={{

                            maxWidth: "100%", // Ensure select doesn't exceed parent width
                          }}
                          value=""
                        >
                          <option value="">Select a book</option>
                          {booksData?.books?.map((book) => (
                            <option
                              key={book.id}
                              value={book.id}
                              className="truncate"
                              style={{
                                maxWidth: "100%",
                                whiteSpace: "normal",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                wordBreak: "break-all"
                              }}
                            >
                              {book.title}
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
                      {errors.items && (
                        <p className="text-red-600 text-sm mt-1">{errors?.items?.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Booked Items List */}
                  {selectedBooks?.length > 0 && <div className="flex flex-col md:gap-5 my-5">

                    <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                      <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Selected Items List</legend>

                      <ul className="ml-10 mt-3 font-medium text-md text-slate-400">
                        {selectedBooks.map((book, index) => (
                          <li key={book.id} className="mb-2 flex justify-between items-center">
                            <div>
                              <span className="font-semibold flex items-center gap-2 text-slate-500 dark:text-neutral-100">
                                <MdShoppingBag />
                                Book {index + 1}
                              </span>
                              <p className="text-blue-500 ml-8 mt-2 text-lg">{book.title}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveBook(book.id)}
                              className="text-red-500"
                            >
                              <MdOutlineDeleteOutline size={25} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </fieldset>
                  </div>}


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
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Select Duration
                          <span className="text-red-600">*</span>
                          <span className="text-gray-600">(max 15 days)</span>
                        </label>
                        <input
                          {...register("bookingDuration")}
                          placeholder="Duration"
                          readOnly
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        {errors.bookingDuration && (
                          <p className="text-red-600 text-sm mt-1">{errors.bookingDuration.message}</p>
                        )}
                      </div>
                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Select Return Date (Optional)
                        </label>
                        <Controller
                          name="return_date"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              selected={field.value}
                              onChange={(date) => field.onChange(date)}
                              placeholderText="Return Date"
                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              dateFormat="yyyy-MM-dd"
                              minDate={borrowDate || new Date()}
                            // maxDate={borrowDate ? addDays(borrowDate, 15) : null}

                            />
                          )}
                        />
                        {errors.return_date && (
                          <p className="text-red-600 text-sm mt-1">{errors.return_date.message}</p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  {/* Booking Status */}
                  <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
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
                                disabled={status != "issued"}
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
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
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
                          <option disabled value="">Select Vendor</option>
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
                      className="bg-slate-600 text-white font-medium text-md cursor-pointer p-2 px-5 rounded-md "
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isValid || isSubmitting || isLoading}
                      type="submit"
                      className="bg-orange-400 text-white font-medium text-md cursor-pointer disabled:cursor-not-allowed p-2 px-5 rounded-md "
                    >
                      {isLoading ? <LoadingSpinner /> : "Issue Book"}
                    </button>
                  </div>
                </div>   </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookIssue;
