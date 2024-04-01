import React from "react";
import {
  MdCurrencyExchange,
  MdLocalAirport,
  MdLocalPhone,
  MdLocationCity,
  MdOutlineBook,
  MdOutlineCalendarMonth,
  MdOutlineLocalPhone,
  MdOutlinePerson,
} from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { BsCreditCard2BackFill, BsPerson, BsPersonFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { IoLocation } from "react-icons/io5";
import { GrMapLocation } from "react-icons/gr";
import { FaArrowRightToCity, FaFlag } from "react-icons/fa6";
import { RiFlag2Fill, RiUserLocationFill } from "react-icons/ri";

const OrderDetails = ({ getOrderDetails, onClose }) => {
  console.log(getOrderDetails);
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
            <div className=" flex justify-between items-center rounded-sm p-3 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]">
              <h3 className="font-bold text-[#313D4A] dark:text-white">
                Order Details
              </h3>
              <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-400">
                Order Id: <span className="text-slate-700 font-medium text-md">{getOrderDetails?.id}</span>
              </h5>
            </div>

            {/* Display Order Details  */}

            <div className="max-h-[600px] px-12 w-full overflow-hidden overflow-y-auto text-slate-800">
              {/* Order details */}
              <div className="flex flex-col md:gap-5 my-5 md:flex-row">
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 md:justify-center ">
                  <MdEmail />
                  Email Address
                </h5>
                <span className="ml-10 font-medium text-slate-500">
                  {getOrderDetails?.email}
                </span>
              </div>

               {/* Order Created Details  */}
               <p className="mt-7 text-lg font-semibold text-slate-600 border-b border-blue-100 mb-4">
               Ordered Items List
              </p>
              <div className="flex flex-col justify-start items-start">
                <div className="flex flex-col mb-5">
                  <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                    <MdOutlineBook/>
                    Items
                  </h5>
                  <p className="ml-10 font-medium text-md text-slate-400">
                    {getOrderDetails?.items}
                  </p>

                  <ul>
                    <li>
                      
                    </li>
                  </ul>
                </div>
               
              </div>
              {/* Order Created Details  */}
              <p className="mt-7 text-lg font-semibold text-slate-600 border-b border-blue-100 mb-4">
                Order Placement
              </p>
              <div className="flex flex-col justify-start items-start">
                <div className="flex flex-col mb-5">
                  <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                    <MdOutlinePerson />
                    Order Placed by
                  </h5>
                  <p className="ml-10 font-medium text-md text-slate-400">
                    {getOrderDetails?.order_by}
                  </p>
                </div>
                <div className="flex flex-col mb-5">
                  <h5 className="flex justify-start items-start gap-2 text-md font-semibold text-slate-600 mb-3 ">
                    <MdOutlineCalendarMonth />
                    Created On
                  </h5>
                  <p className="ml-10 font-medium text-md text-slate-400">
                    {new Date(getOrderDetails?.order_on)?.toDateString()} - {new Date(getOrderDetails?.order_on)?.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Paymemt Details */}
              <p className="mt-7 text-lg font-semibold text-slate-600 border-b border-blue-100 mb-4">
                Payment Details
              </p>

              <div className="flex flex-col gap-5 md:flex-row md:gap-22 md:justify-between md:items-center lg:gap-32">
                <div className="flex flex-col md:mb-5">
                  <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 md:justify-center ">
                    <MdCurrencyExchange /> Payment ID
                  </h5>
                  <p className="ml-10 font-medium text-md text-slate-400">
                    {getOrderDetails?.payment_id}
                  </p>
                </div>

                <div className="flex-flex-col mb-5">
                  <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3  md:justify-center">
                    <BsCreditCard2BackFill /> Payment Mode
                  </h5>

                  <p className="ml-10 font-medium text-md text-slate-400">
                    {getOrderDetails?.mode_of_payment}
                  </p>
                </div>
              </div>

              {/* Discounts details */}
              <p className="text-lg font-semibold text-slate-600 border-b border-blue-100 mb-4">
                Discount Details
              </p>
              <div className="flex flex-col justify-between gap-5 md:flex-row md:gap-22 lg:gap-32">
                <div className="flex flex-col mb-5">
                  <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 md:justify-center ">
                    <BiSolidDiscount />
                    Discount Code
                  </h5>
                  <p className="ml-10 font-medium text-md text-slate-400">
                    {getOrderDetails?.discount_code}
                  </p>
                </div>

                <div className="flex-flex-col mb-5">
                  <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 md:justify-center ">
                    <LiaMoneyCheckAltSolid />
                    Discount Value
                  </h5>

                  <p className="ml-10 font-medium text-md text-slate-400">
                    {getOrderDetails?.discount_value}
                  </p>
                </div>
              </div>

              {/* <div className="flex flex-col justify-between items-start gap-5 md:items-center md:flex-row md:gap-22 lg:gap-32 mb-5"> */}
              {/* Customer Info */}

              <div className="flex flex-col gap-3 ">
                <p className="flex justify-start items-center gap-2 font-bold text-lg  border-b border-[#E2E8F0] text-slate-500 pt-7 my-5">
                  {" "}
                  <RiUserLocationFill />
                  Customer Info
                </p>
                {/* <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  {" "}
                  <BsPerson />
                  Name
                </h5>
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.name}
                </p> */}
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  <IoLocation /> Address
                </h5>
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.address}
                </p>
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  {" "}
                  <MdLocationCity />
                  City
                </h5>{" "}
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.city}
                </p>
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  <RiFlag2Fill />
                  Country
                </h5>{" "}
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.country}
                </p>
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3">
                  <MdLocalPhone />
                  Phone Number
                </h5>{" "}
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.phone}
                </p>
              </div>

              {/* Shipping Info */}
              <div className="flex flex-col gap-3 ">
                <p className="flex justify-start items-center gap-2 font-bold text-lg border-b border-[#E2E8F0] text-slate-500 pt-10 my-5">
                  {" "}
                  <MdLocalAirport />
                  Shipping Details
                </p>
                {/* <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  {" "}
                  <BsPersonFill />
                  Name
                </h5>
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.name}
                </p> */}
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  <GrMapLocation />
                  Address
                </h5>
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.shipping_address}
                </p>
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  {" "}
                  <FaArrowRightToCity />
                  City
                </h5>{" "}
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.shipping_city}
                </p>
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3 ">
                  <FaFlag />
                  Country
                </h5>{" "}
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.shipping_country}
                </p>
                <h5 className="flex justify-start items-center gap-2 text-md font-semibold text-slate-600 mb-3">
                  <MdOutlineLocalPhone />
                  Phone Number
                </h5>{" "}
                <p className="ml-10 text-md font-medium text-slate-400">
                  {getOrderDetails?.shipping_phone}
                </p>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
