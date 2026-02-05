const CardOverdue = ({ overdue }) => {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white py-6 px-7.5 shadow-default dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="flex h-11.5 w-8.5 items-center justify-center rounded-full">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF2F7] dark:bg-[#313D4A]">
          <svg
            className="fill-[#3C50E0] dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill=""
            />
          </svg>
        </span>
      </div>

      <div className="mt-2 ml-4 flex items-center justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black dark:text-white">{overdue}</h4>
          <span className="text-md font-medium opacity-40">Total Overdue Books</span>
        </div>
      </div>
    </div>
  );
};

export default CardOverdue;
