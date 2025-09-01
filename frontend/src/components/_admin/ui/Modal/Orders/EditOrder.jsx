import React, { useEffect, useState } from "react";
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
import { MdEmail } from "react-icons/md";
import { BiInfoCircle, BiSolidDiscount } from "react-icons/bi";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { IoLocation } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { FaArrowRightToCity, FaFlag } from "react-icons/fa6";
import { RiFlag2Fill, RiUserLocationFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "../../../../../schemas/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrdersApi } from "../../../../../hooks/orders/useOrdersApi";
import LoadingSpinner from "../../../Loader/LoadingSpinner";
const EditOrder = ({ getOrderDetails, onClose }) => {
  console.log(getOrderDetails);
  const queryClient = useQueryClient();
  const { updateOrder, error, isLoading } = useOrdersApi();
  const [editableItems, setEditableItems] = useState(getOrderDetails?.items || []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting, isValid, isDirty },
  } = useForm({
    defaultValues: {
      ...getOrderDetails,
      order_on: new Date(getOrderDetails?.order_on)?.toLocaleString(),
    },
    resolver: zodResolver(schema),
    mode: "all",
  });


  useEffect(() => {
    reset({
      ...getOrderDetails,
      order_on: new Date(getOrderDetails?.order_on)?.toLocaleString(),
    });
    setEditableItems(getOrderDetails?.items || []);

  }, [getOrderDetails]);

  // Mutation to Update Book Details
  const { mutateAsync: updateOrderMutation } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["orders"]); // invalidate books query to refetch
      onClose();
    },
    onError: () => {
      onClose();
    }
  });


  const handleRemoveItem = (bookIdToRemove) => {
    if (editableItems.length === 1) {
      alert("You cannot remove the last item from the order.");
      return;
    }
    setEditableItems((prevItems) =>
      prevItems.filter((item) => item.id !== bookIdToRemove)
    );
  };

  // console.log(isValid, "Form valid");
  // console.log(errors, "Form errors");
  const onSubmit = async (updateData) => {
    console.log(updateData, "Form");
    const updateFormData = { ...updateData, items: editableItems, id: getOrderDetails?.id };
    await updateOrderMutation(updateFormData);
  };

  //  if Order status is Not "Packed or Shipped" then it won't let any user-role to edit the order

  const isEditOrderShippingDetails = getOrderDetails?.order_status.toLowerCase() === "packed" || getOrderDetails?.order_status.toLowerCase() === "shipped";

  useEffect(() => {
    if (isSubmitSuccessful) {
      if (error) {
        console.log(error)
      } else {
        console.log("Updated Successfully");

      }
    }
  }, [isSubmitSuccessful, error])
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
        {/* my-5 rounded-md flex justify-center items-center z-70  overflow-hidden xs:h-[400px] overflow-y-auto */}
        <div className=" md:mx-20">
          <div className=" p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
            <div className=" flex justify-between items-center rounded-sm p-3 bg-slate-100 border border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47] dark:bg-[#2E3A47]">
              <h3 className="font-bold text-[#313D4A] dark:text-white">
                Update Order Details
              </h3>
              <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-400">
                Order Id:{" "}
                <span className="text-slate-700  dark:text-neutral-100 font-medium text-md">
                  {getOrderDetails?.id}
                </span>
              </h5>
            </div>

            <div className="flex justify-between items-center gap-2 bg-yellow-200 p-2 mb-3 ">
              <span className="flex justify-center items-center gap-2 text-blue-500 text-lg font-bold" >              <BiInfoCircle />
                Order Status </span>
              <span className="text-slate-700 font-bold dark:text-blue-400 text-lg">
                {getOrderDetails?.order_status.toUpperCase()}
              </span>

            </div>
            {/* Display Order Details  */}

            <div className="max-h-[600px] px-12 w-full overflow-hidden overflow-y-auto text-slate-800">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Order details */}
                <div className="flex flex-col md:gap-5 my-5 ">
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    <MdEmail />
                    Email Address
                  </h5>
                  {/* <span className="ml-10  font-medium text-slate-500"> */}
                  {/*   */}
                  <input
                    type="email"
                    name="email"
                    id="email"
                    {...register("email")}
                    autoFocus
                    disabled
                    className="w-full md:w-[400px] md:ml-10 rounded-sm border-[#E2E8F0] border bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  {/* </span> */}
                </div>

                {/* Order Created Details  */}
                <p className="mt-7 text-lg font-semibold text-slate-400 border-b border-blue-100 mb-4">
                  Ordered Items List
                </p>
                <div className="">
                  <div className=" mb-5">

                    <ul className="ml-10 font-medium text-md text-slate-400 ">
                      {editableItems?.map((book, index) => (
                        <li key={book?.id} className="mb-2 flex justify-between items-center">
                          <div>
                            <span className="font-semibold flex items-center gap-2 text-slate-500 dark:text-neutral-100">
                              <MdShoppingBag />
                              Order Item {index + 1}
                            </span>
                            <p className="text-blue-500 ml-8 mt-2 text-lg">{book?.title}</p>
                          </div>

                          <div>
                            {editableItems.length === 1 ?
                              <div className="group relative w-40 m-2 flex justify-center">
                                <span className="absolute -top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-red-500 group-hover:scale-100">
                                  Order's List cannot be empty
                                </span>
                                <button disabled className="text-red-500">
                                  <MdOutlineDeleteOutline size={25} />
                                </button>
                              </div> : <button
                                onClick={() => handleRemoveItem(book.id)}
                                className="text-red-500 disabled:text-red-200"
                                disabled={isEditOrderShippingDetails}
                              >
                                <MdOutlineDeleteOutline size={25} />
                              </button>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Order Created Details  */}
                <p className="mt-10 text-lg font-semibold text-slate-400 border-b-2 w-2/3 border-blue-100 mb-4">
                  Order Placement
                </p>
                <div className="flex flex-col justify-start items-start">
                  {/* <div className="flex flex-col mb-5">
                    <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                      <MdOutlinePerson />
                      Order Placed by
                    </h5>
                    <input
                      type="text"
                      name="order_by"
                      {...register("order_by")}
                      className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                  </div> */}
                  <div className="flex flex-col mb-5">
                    <h5 className="flex justify-start items-start gap-2 text-md font-normal text-blue-500 mb-3 ">
                      <MdOutlineCalendarMonth />
                      Created On
                    </h5>
                    {/* <p className="ml-10  font-medium text-md text-slate-400"> */}
                    <input
                      type="text"
                      name="order_on"
                      disabled
                      {...register("order_on")}
                      className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    {/* </p> */}
                  </div>
                </div>

                {/* Paymemt Details */}
                {/* <p className="mt-7 text-lg font-semibold 4 border-b-2 w-2/3 border-blue-100 mb-4">
                  Payment Details
                </p>

                <div className="flex flex-col gap-5 md:flex-row md:gap-26 md:items-center lg:gap-32">
                  <div className="flex flex-col md:mb-5">
                    <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                      <MdCurrencyExchange /> Payment ID
                    </h5>
                    <input
                      type="text"
                      name="payment_id"
                      {...register("payment_id")}
                      className="w-full  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                    <p className="ml-10  font-medium text-md text-slate-400">
                      {getOrderDetails?.payment_id}
                    </p>
                  </div>

                  <div className="flex-flex-col mb-5">
                    <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3  ">
                      <BsCreditCard2BackFill /> Payment Mode
                    </h5>

                    <p className="ml-10  font-medium text-md text-slate-400">
                      {getOrderDetails?.mode_of_payment}
                    </p>

                    <input
                      type="text"
                      name="mode_of_payment"
                      {...register("mode_of_payment")}
                      className="w-full   rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                  </div>
                </div> */}

                {/* Discounts details */}
                <p className="mt-10 text-lg text-slate-400 font-semibold 4 border-b-2 w-2/3 border-blue-100 mb-4">
                  Discount Details
                </p>
                <div className="flex flex-col  gap-5 md:flex-row md:gap-22 lg:gap-32">
                  <div className="flex flex-col mb-5">
                    <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                      <BiSolidDiscount />
                      Discount Code
                    </h5>
                    {/* <p className="ml-10  font-medium text-md text-slate-400">
                      {getOrderDetails?.discount_code}
                    </p> */}
                    <input
                      type="text"
                      name="discount_code"
                      {...register("discount_code")}
                      className="w-full rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />
                  </div>

                  <div className="flex-flex-col mb-5">
                    <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3  ">
                      <LiaMoneyCheckAltSolid />
                      Discount Value
                    </h5>

                    <input
                      type="text"
                      name="discount_value"
                      {...register("discount_value")}
                      className="w-full  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                    />

                  </div>
                </div>

                {/* Customer Info */}

                <div className="flex flex-col gap-3 ">
                  <p className="flex justify-start items-center gap-2 font-bold text-lg  border-b-2 border-[#E2E8F0] text-slate-500 pt-7 my-5">
                    {" "}
                    <RiUserLocationFill />
                    Customer Details
                  </p>
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    <IoLocation /> Address
                  </h5>

                  <input
                    type="text"
                    name="address"
                    disabled
                    {...register("address")}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    {" "}
                    <MdLocationCity />
                    City
                  </h5>{" "}

                  <input
                    type="text"
                    name="city"
                    disabled
                    {...register("city")}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    <RiFlag2Fill />
                    Country
                  </h5>{" "}

                  <input
                    type="text"
                    name="phone"
                    disabled
                    {...register("phone")}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3">
                    <MdLocalPhone />
                    Phone Number
                  </h5>{" "}

                  <input
                    type="text"
                    name="country"
                    disabled
                    {...register("country")}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                </div>

                {/* Shipping Info */}
                <div className="flex flex-col gap-3 ">
                  <p className="flex justify-start items-center gap-2 font-bold text-lg border-b-2 border-[#E2E8F0] text-slate-500 pt-10 my-5">
                    <MdLocalAirport />
                    Shipping Details
                  </p>
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    <GrMapLocation />
                    Adress
                  </h5>

                  <input
                    type="text"
                    name="shipping_address"
                    {...register("shipping_address")}
                    disabled={isEditOrderShippingDetails}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    {" "}
                    <FaArrowRightToCity />
                    City
                  </h5>{" "}

                  <input
                    type="text"
                    name="shipping_city"
                    {...register("shipping_city")}
                    disabled={isEditOrderShippingDetails}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3 ">
                    <FaFlag />
                    Country
                  </h5>{" "}
                  {/* <p className="ml-10  text-md font-medium text-slate-400">
                    {getOrderDetails?.shipping_country}
                  </p> */}
                  <input
                    type="text"
                    name="shipping_country"
                    {...register("shipping_country")}
                    disabled={isEditOrderShippingDetails}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                  <h5 className="flex justify-start items-center gap-2 text-md font-normal text-blue-500 mb-3">
                    <MdOutlineLocalPhone />
                    Phone Number
                  </h5>{" "}
                  {/* <p className="ml-10  text-md font-medium text-slate-400">
                    {getOrderDetails?.shipping_phone}
                  </p> */}
                  <input
                    type="text"
                    name="shipping_phone"
                    disabled={isEditOrderShippingDetails}
                    {...register("shipping_phone")}
                    className="w-full md:w-[400px] md:ml-10  rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 font-medium text-slate-400 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                  />
                </div>
                {/* </div> */}

                <div className="flex justify-end gap-10 mt-10 mb-10">
                  <button
                    className="bg-slate-600 text-white font-medium text-md cursor-pointer p-2 px-5 rounded-md "
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!isDirty || isSubmitting || isLoading || isEditOrderShippingDetails}
                    type="submit"
                    className="bg-orange-400 text-white font-medium text-md cursor-pointer disabled:cursor-not-allowed p-2 px-5 rounded-md "
                  >
                    {isLoading ? <LoadingSpinner /> : "Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
