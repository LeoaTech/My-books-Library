import Book from "../../../../assets/book01.svg";
import Book1 from "../../../../assets/book0.svg";
import { useEffect, useState } from "react";

const CardBooks = () => {
  const [theme, setTheme] = useState();
  const val = localStorage.getItem("color-theme");

  useEffect(() => {
    setTheme(localStorage.getItem("color-theme"));
  }, [theme]);

  console.log(theme);

  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white py-6 px-7.5 shadow-default dark:border-[#2E3A47] dark:bg-[#24303F]">
      <div className="h-11.5 w-8.5 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EFF2F7] dark:bg-[#313D4A]">
          {/* {theme === "dark" ? ( */}
          <img src={Book1} alt="book" className="h-7 w-8 " />
          {/* ) : (
            <img src={Book} alt="book" className="h-7 w-8 " />
          )} */}

         
        </span>
      </div>

      <div className=" mt-2 ml-4 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-xl font-bold text-black dark:text-white">2300</h4>
          <span className="text-sm font-medium opacity-40">Total Books</span>
        </div>
      </div>
    </div>
  );
};

export default CardBooks;
