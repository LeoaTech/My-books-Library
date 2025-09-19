import {
  MdShoppingBag,
} from "react-icons/md";
import { RxCross1 } from "react-icons/rx";

const ViewBookingDetails= ({ bookingData, close }) => {

  const formatDate = (date) => date ? new Date(date)?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';


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
            onClick={close}
          />
        </div>
        <div className=" md:mx-20">
          <div className=" p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
            <div className=" flex justify-between items-center rounded-sm p-3 bg-slate-100 border border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47] dark:bg-[#2E3A47]">
              <h3 className="font-bold text-[#313D4A] dark:text-white">
                View Booking Details
              </h3>

            </div>
            <div className="max-h-[600px] px-12 w-full overflow-hidden overflow-y-auto text-slate-800">
              <div className="p-6.5 m-5.5 sm:overflow-auto sm:p-2 sm:m-2">

                {/* Select User or (student_id) */}
                <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">User Details</legend>

                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white font-semibold">
                        User Name
                      </label>
                      <p className="ml-5 text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.user_name || 'N/A'}
                      </p>
                    </div>

                  </div>
                </fieldset>

                {/* Booked Items List */}
                {bookingData.items?.length > 0 && (
                  <div className="flex flex-col md:gap-5 my-5">
                    <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                      <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Selected Items List</legend>
                      <ul className="ml-10 mt-3 font-medium text-md text-slate-400">
                        {bookingData.items.map((book, index) => (
                          <li key={book?.id || index + 1} className="mb-2 flex justify-between items-center">
                            <div>
                              <span className="font-semibold flex items-center gap-2 text-slate-500 dark:text-neutral-100">
                                <MdShoppingBag />
                                Book {index + 1}
                              </span>
                              <p className="text-blue-500 ml-8 mt-2 text-lg">{book.title}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </fieldset>
                  </div>
                )}

                <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Booking Info</legend>
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Starting Date
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {formatDate(bookingData.borrow_date)}
                      </p>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Due Date
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {formatDate(bookingData.return_due)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        {bookingData.renewed ? 'Renewed Return Date' : 'Return Date'}
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.renewed ? formatDate(bookingData.renew_return_date) : formatDate(bookingData.return_date)}
                      </p>
                      {/* {bookingData.renewed && (
                        <p style={{ fontSize: '0.8em', marginTop: '10px', color: 'orange' }}>
                          Extended due date by up to 15 days from the original due date.
                        </p>
                      )} */}
                      {!bookingData.renewed && bookingData.return_date && (
                        <p style={{ fontSize: '0.8em', marginTop: '10px', color: 'green' }}>
                          Book items were returned on this date.
                        </p>
                      )}
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Renewed
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.renewed ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </fieldset>

                {/* Booking Status */}
                <fieldset className="border mt-8 border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Booking Status</legend>
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#259AE6] dark:text-white font-semibold">
                        Booking Status
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.booking_status || 'N/A'}
                      </p>
                    </div>
                  </div>
                </fieldset>

                {/* Shipping Details */}
                <fieldset className="border mt-4 border-gray-300 dark:border-gray-600 rounded p-4">
                  <legend className="font-semibold text-md text-[#259AE6] dark:text-gray-300">Shipping Details</legend>
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Shipping Address
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.shipping_address || 'N/A'}
                      </p>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Shipping City
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.shipping_city || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Shipping Country
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.shipping_country || 'N/A'}
                      </p>
                    </div>
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                        Phone Number
                      </label>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {bookingData.shipping_phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </fieldset>

                {/* Vendor and Credits */}
                <div className="mt-8 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                      Vendor
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {bookingData.vendor_name || 'N/A'}
                    </p>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-[#0284c7] dark:text-white font-semibold">
                      Credits Used
                    </label>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {bookingData.credits_used == 0 ? 0 : bookingData?.credits_used||'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              {/* Footer with Action buttons */}
              <button
                type="button"
                className="bg-red-600 mt-6 float-right text-white font-medium text-md cursor-pointer p-2 px-5 rounded-md "
                onClick={close}
              >
                Close
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewBookingDetails;
