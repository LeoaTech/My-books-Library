import Book from "../../../../assets/book01.svg";
import Book1 from "../../../../assets/book0.svg";

const CardBooks = ({ books }) => {


  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white py-6 px-7.5 shadow-default dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="h-11.5 w-8.5 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF2F7] dark:bg-[#313D4A]">
          <svg className="w-6 h-6 text-blue-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.414 9.351 5 8 5H4c-1.105 0-2 .895-2 2v10c0 1.105.895 2 2 2h4c1.351 0 2.832-.414 4-1.253m0-13C13.168 5.414 14.649 5 16 5h4c1.105 0 2 .895 2 2v10c0 1.105-.895 2-2 2h-4c-1.351 0-2.832-.414-4-1.253" />
          </svg>        </span>
      </div>

      <div className=" mt-2 ml-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-2xl font-bold text-black dark:text-white">{books?.count > 0 ? books?.count : 0 || 0}</h4>
          <span className="text-md font-medium opacity-40">Total Books</span>
        </div>
      </div>
    </div>
  );
};

export default CardBooks;
