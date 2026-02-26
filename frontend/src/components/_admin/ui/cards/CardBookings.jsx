const CardBookings = ({ booking }) => {
  return (
    <div className="rounded-lg border border-border bg-background py-6 px-7.5 shadow-default ">
      <div className="flex h-11.5 w-8.5 items-center justify-center rounded-full">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface">
          <svg
            className="fill-text "
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 4H18V3C18 2.45 17.55 2 17 2C16.45 2 16 2.45 16 3V4H8V3C8 2.45 7.55 2 7 2C6.45 2 6 2.45 6 3V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM9 14H7V12H9V14ZM13 14H11V12H13V14ZM17 14H15V12H17V14ZM9 18H7V16H9V18ZM13 18H11V16H13V18ZM17 18H15V16H17V18Z"
              fill=""
            />
          </svg>
        </span>
      </div>

      <div className="mt-2 ml-4 flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold text-text">
            {booking?.count ? booking?.count : 0 || 0}
          </h4>
          <span className="text-md font-medium opacity-40">Total Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default CardBookings;
