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
import Select, { components } from "react-select"
import { getCustomSelectStyles } from "../../../shared/CreatableSelectCustomStyles";
import { useFetchSettings } from "../../../../../hooks/settings/useFetchSettings";

let RENEWAL_LIMIT;


const bookItemsSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(3, { message: "Please Enter a title" }),
  member_price: z.string().optional(),
  purchase_price: z.string().optional(),
  condition_name: z.string(),
  cover_name: z.string(),
  category_name: z.string(),
  isbn: z.string().min(8, { message: "Please Enter book ISBN number" }),
  isAvailable: z.boolean().default(false),
  vendor_id: z.unknown().optional(),
  branch_name: z.string(),
  cover_img_url:
    z.unknown() ||
    z
      .array(z.string())
      .max(5, { message: "Maximum 5 images allowed" })
      .optional(),
  discount_percentage: z.string(),
  summary: z.string().optional(),
  publish_year: z.string().optional(),
  publisher_name: z.string() || z.unknown(),
  credit: z.coerce.number() || z.unknown(),
  author_name: z.string() || z.unknown(),
  // Keep track each book renew and return status
  return_due: z.date({
    required_error: "Due date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  return_date: z.date().nullable().optional(),
  renew_return_date: z.date().nullable().optional(),

  renewed: z.boolean().default(false),
  status: z
    .enum(["issued", "returned", "overdue", "renewed"])
    .default("issued"),
  renewal_count: z.coerce.number().default(0),
});

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
  return_due: z.date({
    required_error: "Due date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  return_date: z.date().nullable().optional(),
  renew_return_date: z.date().nullable().optional(),
})
  .refine((data) => data.return_due > data.borrow_date, {
    message: "Due date must be after the borrow date.",
    path: ["return_due"],
  })
  .refine((data) => {
    return true;
  });


//  Calculate booking Status and Due Date 
const deriveBookingStatusAndDueDate = (bookItems) => {
  if (!bookItems || bookItems.length === 0) {
    return { status: 'issued', return_due: null };
  }

  const isAnyIssued = bookItems.some(item => item.status === 'issued');
  const isAnyOverdue = bookItems.some(item => item.status === 'overdue');
  const isAnyRenewed = bookItems.some(item => item.status === 'renewed');
  const allReturned = bookItems.every(item => item.status === 'returned');

  let globalStatus = 'issued';
  let globalReturnDue = null;


  if (allReturned) {
    globalStatus = 'returned';
  } else if (isAnyOverdue) {
    globalStatus = 'overdue';
  } else if (isAnyRenewed) {
    globalStatus = 'renewed';
  } else if (isAnyIssued) {
    globalStatus = 'issued';
  }

  // If all returned, update the return_due with last returned book due date
  if (allReturned) {
    const allDues = bookItems
      .filter(item => item.return_due)
      .map(item => new Date(item.return_due));

    if (allDues.length > 0) {
      globalReturnDue = allDues.reduce((latest, current) => current > latest ? current : latest, allDues[0]);
    }

  } else {
    const nonReturnedDues = bookItems
      .filter(item => item.status !== 'returned' && item.return_due)
      .map(item => new Date(item.return_due));

    if (nonReturnedDues.length > 0) {
      globalReturnDue = nonReturnedDues.reduce((earliest, current) => current < earliest ? current : earliest, nonReturnedDues[0]);
    }
  }

  return { status: globalStatus, return_due: globalReturnDue };
};
const bookingStatus = ["issued", "returned", "overdue", "renewed"];

const BookIssue = ({ mode, onClose, booking }) => {
  const queryClient = useQueryClient();

  const theme = localStorage.getItem("color-theme")?.replace(/"/g, '') || "light";
  const selectStyles = useMemo(() => getCustomSelectStyles(theme), [theme]);

  const { createBooking, updateBooking, error, isLoading } = useBookingApi();

  const { data: students, isLoading: isLoadingStudents } = useFetchUserRoles();
  const { isLoading: isBooksLoading, error: isBookFetchingError, data: booksData } = useFetchBooks();
  const { data: settings, isLoading: isLoadingSettings } = useFetchSettings();
  const bookingSettings = settings?.settings[0];
  RENEWAL_LIMIT = bookingSettings?.consecutive_renewals || 5
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
      items: booking.items?.map(item => ({
        ...item,
        return_due: item.return_due ? new Date(item.return_due) : null,
        return_date: item.return_date ? new Date(item.return_date) : null,
        renew_return_date: item.renew_return_date ? new Date(item.renew_return_date) : null,
        renewed: item.renewed || false,
        status: item.status || "issued",
        renewal_count: item.renewal_count || 0,
      })) || [],
      user_id: booking.user_id || null,
      credits_used: booking.credits_used || 0,
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
  const selectedUser = watch('user_id')
  const bookItems = useMemo(() => watch('items') || [], [watch('items')]);
  const selectedValues = mode == "edit" && bookItems?.map(book => ({
    value: book.id,
    label: book.title,
    ...book,
  }));

  // Inside BookIssue component, near RENEWAL_LIMIT definition
  const initialAvailableRenewals = booking?.available_renewals || 0;

  // Count how many books are currently NOT returned AND not individually maxed out.
  const currentlyRenewableBooks = bookItems.filter(item =>
    item.status !== 'returned' && item.renewal_count < RENEWAL_LIMIT
  );

  const numRenewableBooks = currentlyRenewableBooks.length;

  console.log(numRenewableBooks, "Renewd Books");

  const totalRenewalsUsed = booking?.items?.reduce((sum, item) => {
    return sum + (item.renewal_count || 0);
  }, 0);

  // To Update the Status and Return Due 
  useEffect(() => {
    const { status, return_due } = deriveBookingStatusAndDueDate(bookItems);
    setValue("status", status, { shouldValidate: true });

    // Add a valid return due
    if (return_due instanceof Date && return_due.getTime() !== watch('return_due')?.getTime()) {
      setValue("return_due", return_due, { shouldValidate: true });
    }
  }, [bookItems, setValue, watch]);

  // Calculate total credits_used whenever bookItems change
  useEffect(() => {
    const totalCredits = bookItems.reduce((sum, book) => sum + (book.credit || 0), 0);
    setValue('credits_used', totalCredits, { shouldValidate: true });
  }, [bookItems, setValue]);

  // Filled the shipping details on selecting a user
  useEffect(() => {
    if (selectedUser) {
      const userShippingDetails = students?.data?.find((user) => user.user_id === selectedUser);
      console.log(userShippingDetails);
      setValue('shipping_address', userShippingDetails?.address);
      setValue('shipping_country', userShippingDetails?.country);
      setValue('shipping_city', userShippingDetails?.city);
      setValue('shipping_phone', userShippingDetails?.phone);
    }
  }, [selectedUser, setValue, students?.data])

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

  // console.log(errors, "Form errors");
  const onSubmit = async (updateData) => {

    // console.log(updateData, "Form data");

    const originalItemsMap = new Map(booking?.items?.map(item => [item.id, item]));

    const itemsWithUpdatedRenewalCount = updateData.items.map(item => {
      const originalItem = originalItemsMap.get(item.id);

      let newRenewalCount = item.renewal_count || 0;

      const previousCount = originalItem?.renewal_count || 0;

      const originalDueMs = originalItem?.return_due ? new Date(originalItem.return_due).getTime() : 0;

      const currentDueMs = item.return_due ? item.return_due.getTime() : 0;

      const isRenewedInForm = item.renewed;

      const isDateExtended = currentDueMs > originalDueMs + 1000;

      const isCountConsistent = newRenewalCount === previousCount;
      const isNewRenewalAction = isRenewedInForm && isDateExtended && isCountConsistent;

      if (isNewRenewalAction) {
        if (newRenewalCount < RENEWAL_LIMIT && booking?.available_renewals != 0) {
          newRenewalCount += 1;
        } else {
          console.warn(`Renewal skipped for item ${item.id}: Renewal limit reached.`);
        }
      }

      return {
        ...item,
        renewal_count: newRenewalCount,
      };
    });


    // --- STEP 1: CALCULATE INCREMENTS BASED ON UI INTENT ---

    // const itemsWithUpdatedRenewalCount = updateData.items.map(item => {
    //   const originalItem = originalItemsMap.get(item.id);

    //   let newRenewalCount = item.renewal_count || 0;
    //   const previousCount = originalItem?.renewal_count || 0;

    //   // This is the simplest check: Did the user check 'renewed' AND the count in the form hasn't been incremented yet?
    //   // We trust the UI has enforced the limits.
    //   const isUserRequestingRenewal = (
    //     item.renewed &&
    //     item.status !== 'returned' && // Must not be returned
    //     newRenewalCount === previousCount
    //   );

    //   if (isUserRequestingRenewal) {
    //     // We only increment if the individual limit is respected. 
    //     // The global limit is *assumed* to be handled by the UI.
    //     if (newRenewalCount < RENEWAL_LIMIT && initialAvailableRenewals != 0) {
    //       newRenewalCount += 1;
    //     }
    //   }

    //   return {
    //     ...item,
    //     renewal_count: newRenewalCount,
    //   };
    // });

    const { status: derivedStatus, return_due: derivedReturnDue } = deriveBookingStatusAndDueDate(itemsWithUpdatedRenewalCount);

    let globalReturnDate = null;

    if (derivedStatus === 'returned') {
      const allReturnDates = itemsWithUpdatedRenewalCount
        .filter(item => item.return_date)
        .map(item => new Date(item.return_date));

      if (allReturnDates.length > 0) {
        globalReturnDate = allReturnDates.reduce((latest, current) => current > latest ? current : latest, allReturnDates[0]);
      }
    }
    const totalRenewalsUsed = itemsWithUpdatedRenewalCount.reduce((sum, item) => {
      return sum + (item.renewal_count || 0);
    }, 0);


    // console.log(totalRenewalsUsed, "Total Renewal Count");


    const finalUpdateData = {
      ...updateData,
      items: itemsWithUpdatedRenewalCount,
      status: derivedStatus,
      return_due: derivedReturnDue,
      return_date: globalReturnDate,
      renew_return_date: null,
      available_renewals: (bookingSettings?.consecutive_renewals) - totalRenewalsUsed
    };
    // console.log(finalUpdateData, "Final update Data");


    if (mode == "edit") {
      const bookingData = {
        ...finalUpdateData,
        booking_id: booking?.booking_id
      };
      await updateBookingMutation(bookingData)
    } else {
      const bookingData = {
        ...finalUpdateData,
        status: "issued", // 'issued' for a new booking
        available_renewals: bookingSettings?.consecutive_renewals || 0
      };
      await createBookingMutation(bookingData);
    }
  };

  const currentlyCheckedRenewed = bookItems.filter(item => item.renewed).length;

  // console.log(currentlyCheckedRenewed, "Renewed checked");

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

  // console.log(bookItems, "Items");

  // console.log(watch("credits_used"), "credits used amount");



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
              {mode === "edit" && <p>Available Renewals:  {initialAvailableRenewals}/ {(bookingSettings?.consecutive_renewals || 5)} </p>}
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
                              isDisabled={isBooksLoading || mode == "edit" || field.value?.length >= 5}
                              isLoading={isBooksLoading}
                              styles={selectStyles}
                            />
                          )}
                        />
                        {mode == "edit" &&
                          <p style={{ fontSize: '0.8em', marginTop: "10px", color: 'gray' }}>

                            (Can&apos;t select more books)
                          </p>
                        }

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
                            <li key={book?.id || index + 1} className="mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-semibold flex items-center gap-2 text-slate-500 dark:text-neutral-100">
                                    <MdShoppingBag />
                                    Book {index + 1}
                                  </span>
                                  <p className="text-blue-500 ml-8 mt-2 text-lg">{book.title}</p>
                                  <p className="text-sm ml-8 text-gray-500 dark:text-gray-400">
                                    Current Status: <strong className={`font-bold ${book.status === 'returned' ? 'text-green-500' : book.status === 'overdue' ? 'text-red-500' : 'text-yellow-500'}`}>{mode === "create" ? "issued"?.toUpperCase() : book?.status?.toUpperCase()}</strong>
                                  </p>
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
                              </div>

                              {mode === "edit" && (
                                <div className="ml-8 mt-4 p-3 border rounded border-dashed border-gray-300 dark:border-gray-600">

                                  {/* RENEW Book Checkbox */}
                                  <div className="mb-3">
                                    <label className="inline-flex items-center">
                                      <input
                                        type="checkbox"
                                        {...register(`items.${index}.renewed`)}
                                        disabled={book.status === 'returned' ||
                                          book.renewal_count >= RENEWAL_LIMIT ||
                                          totalRenewalsUsed == RENEWAL_LIMIT
                                          // || (currentlyCheckedRenewed >= initialAvailableRenewals)
                                        }
                                        className="rounded bg-gray-200 border-transparent h-4 w-4 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;
                                          setValue(`items.${index}.renewed`, isChecked, { shouldValidate: true });

                                          if (isChecked) {
                                            if (book.renewal_count >= RENEWAL_LIMIT) return;

                                            setValue(`items.${index}.status`, "renewed", { shouldValidate: true });
                                            setValue(`items.${index}.return_date`, null, { shouldValidate: true });

                                            const currentDue = new Date(book.return_due);
                                            const newDefaultDue = addDays(currentDue, 1); // Extend by 1 day
                                            setValue(`items.${index}.renew_return_date`, newDefaultDue, { shouldValidate: true });
                                            setValue(`items.${index}.return_due`, newDefaultDue, { shouldValidate: true });
                                          } else {
                                            // Reset dates and status if un-renewed

                                            setValue(`items.${index}.renew_return_date`, null, { shouldValidate: true });
                                            const originalItem = booking?.items?.find(item => item.id === book.id);
                                            setValue(`items.${index}.status`, originalItem[index].status, { shouldValidate: true });

                                            if (originalItem?.return_due) {

                                              setValue("status", originalItem.status, { shouldValidate: true });
                                              setValue(`items.${index}.return_due`, new Date(originalItem.return_due), { shouldValidate: true });
                                            } else {
                                              setValue(`items.${index}.return_due`, null, { shouldValidate: true });
                                            }
                                            setValue(`items.${index}.return_date`, null, { shouldValidate: true });
                                          }
                                        }}
                                      />
                                      <span className="ml-2 text-[#0284c7] dark:text-white">
                                        Renew book Return Due (Count: {book.renewal_count})
                                        {/* {book.renewal_count} */}
                                      </span>
                                    </label>
                                    {(book.renewal_count >= RENEWAL_LIMIT || totalRenewalsUsed == RENEWAL_LIMIT && book.status != "returned") && (
                                      <p className="text-red-500 text-xs ml-8 mt-1">Renewal limit reached for this book. Please select a Return Date</p>
                                    )}
                                  </div>

                                  {/* Renew Due Date  and Return Date*/}
                                  <div className="flex gap-4">

                                    {/* Renew Return Date */}
                                    {book.renewed && (totalRenewalsUsed !== RENEWAL_LIMIT
                                      //  && (
                                      //   !(currentlyCheckedRenewed >= initialAvailableRenewals)
                                      // )
                                    ) && book.status !== 'returned' ? (
                                      <div className="w-1/2">
                                        <label className="mb-2.5 block text-[#0284c7] dark:text-white text-sm">New Due Date</label>
                                        <Controller
                                          name={`items.${index}.renew_return_date`}
                                          control={control}
                                          render={({ field }) => (
                                            <DatePicker
                                              selected={field.value}
                                              disabled={totalRenewalsUsed == RENEWAL_LIMIT
                                                || (currentlyCheckedRenewed > initialAvailableRenewals)
                                              }

                                              onChange={(date) => {
                                                const sanitizedDate = date instanceof Date ? date : null;
                                                field.onChange(sanitizedDate);

                                                if (sanitizedDate) {
                                                  setValue(`items.${index}.return_due`, sanitizedDate, { shouldValidate: true });
                                                  setValue(`items.${index}.status`, "renewed", { shouldValidate: true });
                                                } else if (book.renewed) {
                                                  setValue(`items.${index}.status`, "issued", { shouldValidate: true });
                                                }

                                              }}
                                              placeholderText="New Due Date"
                                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-2 px-3 text-sm font-medium outline-none"
                                              dateFormat="yyyy-MM-dd"
                                              // minDate={new Date(book.return_due || new Date())}
                                              minDate={addDays(new Date(book.return_due), 1)}
                                              maxDate={book.return_due ? addDays(book.return_due, (bookingSettings?.default_booking_duration || 15)) : null}
                                            />
                                          )}
                                        />
                                        {errors.items?.[index]?.renew_return_date && (
                                          <p className="text-red-600 text-xs mt-1">{errors.items[index].renew_return_date.message}</p>
                                        )}
                                      </div>
                                    ) :
                                      // Regular Return Date
                                      (

                                        <div className="w-1/2">
                                          <label className="mb-2.5 block text-[#0284c7] dark:text-white text-sm">
                                            {/* Return Date */}
                                            {(
                                              currentlyCheckedRenewed >= initialAvailableRenewals
                                            ) || totalRenewalsUsed === RENEWAL_LIMIT || book.renewal_count >= RENEWAL_LIMIT ? 'Final Return Date' : 'Return Date'}

                                          </label>
                                          <Controller
                                            name={`items.${index}.return_date`}
                                            control={control}
                                            render={({ field }) => (
                                              <DatePicker
                                                selected={field.value}
                                                disabled={book.status === 'returned'}
                                                onChange={(date) => {
                                                  const sanitizedDate = date instanceof Date ? date : null;
                                                  field.onChange(sanitizedDate);
                                                  if (sanitizedDate) {
                                                    setValue(`items.${index}.status`, "returned", { shouldValidate: true });
                                                  } else {
                                                    setValue(`items.${index}.status`, "issued", { shouldValidate: true });
                                                  }
                                                  setValue(`items.${index}.renewed`, false, { shouldValidate: true });
                                                  setValue(`items.${index}.renew_return_date`, null, { shouldValidate: true });

                                                }}
                                                placeholderText="Return Date"
                                                className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-2 px-3 text-sm font-medium outline-none"
                                                dateFormat="yyyy-MM-dd"
                                                minDate={borrowDate || new Date()}
                                              />
                                            )}
                                          />
                                          {errors.items?.[index]?.return_date && (
                                            <p className="text-red-600 text-xs mt-1">{errors.items[index].return_date.message}</p>
                                          )}
                                        </div>

                                      )}
                                    {/* Book Status (Based on renew or return date selection) */}
                                    <div className="w-1/2">
                                      <label className="mb-2.5 block text-[#0284c7] dark:text-white text-sm">Return Due</label>
                                      <Controller
                                        name={`items.${index}.return_due`}
                                        control={control}
                                        render={({ field }) => (
                                          <DatePicker
                                            selected={field.value}
                                            disabled
                                            placeholderText="Due Date"
                                            className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-2 px-3 text-sm font-medium outline-none"
                                            dateFormat="yyyy-MM-dd"
                                          />
                                        )}
                                      />
                                      {errors.items?.[index]?.return_due && (
                                        <p className="text-red-600 text-xs mt-1">{errors.items[index].return_due.message}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </fieldset>
                    </div>
                  )}

                  {/* Booking Dates  */}
                  <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                    <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Booking Info</legend>
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                          Borrow Date
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
                                if (mode !== "edit" && date) {
                                  const newItems = bookItems.map(item => ({
                                    ...item,
                                    return_due: addDays(date, 7), // Default 7 days
                                  }));
                                  setValue("items", newItems, { shouldValidate: true });
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
                          Return Due Date {mode == "edit" && "Global"}
                          <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="return_due"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              disabled={mode == "edit"}
                              selected={field.value}
                              onChange={(date) => {
                                field.onChange(date)
                              }
                              }
                              minDate={addDays(borrowDate, 1)}
                              placeholderText="Return Due Date"
                              className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              dateFormat="yyyy-MM-dd"
                              isClearable
                              maxDate={addDays(borrowDate, (bookingSettings?.default_booking_duration || 15))}
                            />
                          )}
                        />
                        {mode === "edit" && <p style={{ fontSize: '0.8em', marginTop: "10px", color: 'orange' }}>
                          This is the earliest due date among all unreturned books.
                        </p>}
                        {errors.return_due && (
                          <p className="text-red-600 text-sm mt-1">{errors.return_due.message}</p>
                        )}
                      </div>
                    </div>
                  </fieldset>

                  {/* Booking Status  */}
                  <fieldset className="border mt-8 border-gray-300 dark:border-gray-600 rounded p-4">
                    <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Booking Status</legend>
                    <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                      <div className="w-full xl:w-1/2">
                        <label className="mb-2.5 block text-[#259AE6] dark:text-white">
                          Booking Status {mode == "edit" && "Global"}
                          <span className="text-red-600">*</span>
                        </label>
                        <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                          <select
                            className="relative z-20 w-full appearance-none dark:text-white rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                            {...register("status")}
                            disabled
                            style={{
                              maxWidth: "100%",
                            }}
                          >
                            <option disabled value="">Select status</option>
                            {bookingStatus?.map((status) => (
                              <option
                                key={status}
                                value={status}
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
                        <p style={{ fontSize: '0.8em', marginTop: "10px", color: 'green' }}>
                          This status is automatically determined by the status of all books in selected books list.
                        </p>
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

                  {/* Select Credits Info */}
                  <div className="mt-8 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                    <div className="w-full ">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Credits Used
                        <span className="text-orange-600 pl-2">(Read Only)</span>
                      </label>
                      <input
                        type="text"
                        name="credits_used"
                        readOnly
                        value={watch('credits_used') || 0}
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



