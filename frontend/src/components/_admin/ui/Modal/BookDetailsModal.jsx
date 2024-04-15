import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FetchBookById } from "../../../../api/books";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NoImage from "../../../../assets/no-image.png";
import { useState } from "react";
import { useSaveBook } from "../../../../hooks/books/useSaveBook";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineReviews, MdOutlineWbIncandescent } from "react-icons/md";
import { BiCategory, BiBarcode, BiPurchaseTagAlt } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa";
import { AiOutlineStock } from "react-icons/ai";
import { GiBookAura, GiTwoCoins, GiBookCover } from "react-icons/gi";
import {
  BsCalendar2Date,
  BsCreditCard2FrontFill,
  BsPersonWorkspace,
} from "react-icons/bs";
import { PiUserFocusFill } from "react-icons/pi";
import { TbBasketDiscount } from "react-icons/tb";
import { FaStore } from "react-icons/fa";
import { IoDiamondOutline } from "react-icons/io5";

const settings = {
  dots: true,
  lazyLoad: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
const BookDetailsModal = ({ data, close }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const queryClient = useQueryClient();
  const { deleteBook } = useSaveBook();

  const { mutateAsync: deleteBookMutation } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries(["books"]);
      close();
    },
  });

  // Delete Book By ID
  // async function deleteBookID(bookId) {
  //   setIsLoading(true);

  //   const imagesIds = bookDetails?.book?.cover_img_url?.map(
  //     (img) => img.public_id
  //   );

  //   const deletedData = { book_id: bookId, cover_img_url: imagesIds };
  //   await deleteBookMutation(deletedData);
  // }

  /* Fetch Book Details */
  const { isPending: isPendingBook, data: bookDetails } = useQuery({
    queryFn: () => FetchBookById(data),
    queryKey: ["books", { data }],
  });

  if (isPendingBook) {
    <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity">
      <div className="relative p-5 rounded-sm">
        <div className="flex items-center justify-center p-5 z-10 w-screen overfow-hidden xs:w-[350px] xs:h-[300px] overflow-y-auto ">
          <div className="flex flex-col">
            <div className="px-10 relative rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
              <div className="max-h-[600px] px-4 w-full overflow-hidden overflow-y-auto">
                <h1>Loading... Please wait</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
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
          <div className="p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
            <div className="text-center bg-slate-100 shadow-md mb-5 rounded-sm p-3 border-b border-blue-200  py-4 px-6.5 dark:border-[#2E3A47]">
              <h3 className="text-center font-bold text-[#313D4A] dark:text-white">
                <span className="text-3xl">
                  {bookDetails?.book?.title?.toUpperCase()}
                </span>
              </h3>
            </div>

            {/* Book Details Form */}

            <div className="max-h-[500px] px-5 w-full overflow-hidden overflow-y-auto text-slate-800">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-12 overflow-hidden">
                <div className="flex-shrink-0 mb-10 w-full h-[400px] lg:w-[400px] ">
                  <Slider
                    {...settings}
                    className="w-full h-[400px] lg:w-[400px] lg:h-[410px]"
                  >
                    {bookDetails?.book?.cover_img_url?.map((image) => (
                      <div key={image?.public_id}>
                        <img
                          src={image?.secureURL || NoImage}
                          alt="book_cover"
                          className="w-full h-[380px] object-contain overflow-hidden "
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
                <div className="mt-20 py-10 flex flex-col flex-grow gap-2 md:mt-0 ">
                  <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                    <PiUserFocusFill />
                    AUTHOR
                  </span>
                  <h3 className="ml-10 text-md text-[#282b2c] capitalize dark:text-white font-semibold">
                    {bookDetails?.book?.author_name}
                  </h3>

                  <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                    <MdOutlineWbIncandescent />
                    DESCRIPTION
                  </span>

                  <p className="ml-10 text-md text-[#282b2c] dark:text-white font-medium">
                    {/* {bookDetails?.book?.summary} */}
                    {`Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, accusamus. Atque dolorem dolor cum obcaecati repudiandae vel ad corporis, omnis praesentium tenetur aperiam reprehenderit iure magni saepe consequatur, ab magnam nisi vero aut eligendi illum quia! ${
                      showText
                        ? "Rem nesciunt saepe, quas laboriosam ad maiores, cum tempore eum molestiae necessitatibus, qui odio ducimus harum voluptatum tempora expedita omnis sapiente voluptatibus? Voluptatum nihil suscipit mollitia, natus ad, quasi voluptatem quibusdam possimus harum rerum, maxime velit alias earum pariatur unde illum doloribus cupiditate repellat laboriosam et officia dignissimos cum itaque? Totam architecto natus, quia eum minus reiciendis corporis inventore excepturi error ipsa magni delectus soluta adipisci amet quaerat nesciunt quae quasi. Obcaecati ut illo provident! Facilis minima, iste enim eveniet voluptatibus magnam nostrum expedita dignissimos sit! Nihil ad, neque consequatur, laborum blanditiis fuga numquam reiciendis quos deleniti aperiam molestias eos voluptas. Harum totam nisi dolor odio, amet ratione quas tempore accusamus tempora aliquam sed."
                        : ""
                    }
      `}
                    <span
                      className="text-blue-400 cursor-pointer underline"
                      onClick={() => setShowText(!showText)}
                    >
                      {showText ? "Show Less" : "Show More"}
                    </span>
                  </p>

                  <p className="mb-3 text-md text-[#282b2c] dark:text-white font-medium ">
                    <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                      <BsCreditCard2FrontFill /> CREDIT
                    </span>
                    <span className="flex items-center gap-2 mx-10 py-0.5 text-lg rounded-xl text-[#4b5668]  dark:text-white">
                      <GiTwoCoins className="h-22 text-lg" />{" "}
                      {bookDetails?.book?.credit}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 bg-neutral-50 px-3 dark:bg-slate-900">
                {/* Book Details  {Author, Rental Price, Purchase Price etc...} */}
                <div className="mt-20 py-10 flex flex-col gap-2 md:mt-0 ">
                  <h3 className="text-lg font-medium uppercase text-[#434f42] mb-2 dark:text-gray-300">
                    Price
                  </h3>
                  <div className="border-b border-blue-200"></div>

                  <p className="flex items-center gap-2 mb-3 text-md text-[#282b2c] dark:text-white font-medium">
                    <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                      <TbBasketDiscount /> RENT PRICE
                    </span>
                    <span className=" flex items-center gap-2 mx-5 py-0.5 px-3 rounded-xl text-[#434d5d] text-2xl dark:text-white">
                      <FaDollarSign className="text-sm h-12" />{" "}
                      {bookDetails?.book?.rental_price}
                    </span>
                  </p>

                  <p className="flex items-center gap-2 mb-3 text-md text-[#151a1c] dark:text-white font-medium">
                    <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                      <BiPurchaseTagAlt /> PURCHASE PRICE
                    </span>
                    <span className=" flex items-center gap-2 mx-5 py-0.5 px-3 rounded-xl text-[#434d5d] text-2xl dark:text-white">
                      <FaDollarSign className="text-sm h-12" />
                      {bookDetails?.book?.purchase_price}
                    </span>
                  </p>

                  {/* Publisher and Publish date */}
                  <h3 className="mt-4 text-lg font-medium uppercase text-[#434f42] mb-2 dark:text-gray-300">
                    Publish Details
                  </h3>
                  <div className="border-b border-blue-200"></div>
                  <div className="flex flex-col justify-between gap-1 mt-5 md:flex-row">
                    <div>
                      <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                        <GiBookAura /> PUBLISHER
                      </span>
                      <h4 className="ml-10 text-md text-[#282b2c] dark:text-white font-semibold">
                        {bookDetails?.book?.publisher_name}
                      </h4>
                    </div>

                    <div>
                      <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                        <BsCalendar2Date />
                        PUBLISH YEAR
                      </span>
                      <h5 className="ml-10 text-md text-[#282b2c] dark:text-white font-semibold">
                        {bookDetails?.book?.publish_year}
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Other Book Details */}
                <div className="mt-5 mb-5">
                  <h3 className="text-lg font-medium uppercase text-[#434f42] mb-2 dark:text-gray-300">
                    Other Details
                  </h3>
                  <div className="border-b border-blue-200"></div>

                  <h5 className="my-3 text-md text-[#282b2c] dark:text-white font-medium">
                    <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                      <BiBarcode />
                      ISBN{" "}
                    </span>
                    <span className="mt-1 text-md ml-10 ">
                      {bookDetails?.book?.isbn}
                    </span>
                  </h5>

                  <p className="my-3 text-md text-[#282b2c] dark:text-white font-medium">
                    <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                      <BiCategory />
                      CATEGORY
                    </span>
                    <span className="mt-1 text-md ml-10  ">
                      {bookDetails?.book?.category_name}
                    </span>
                  </p>

                  <p className="my-3 text-md text-[#282b2c] dark:text-white font-medium">
                    <span className="flex items-center gap-2 text-[#799db8] text-medium font-medium">
                      <AiOutlineStock />
                      Availble for Sale:{" "}
                    </span>{" "}
                    <span className="mt-1 text-md ml-10 ">
                      {bookDetails?.book?.available
                        ? "IN STOCK"
                        : "OUT OF STOCK"}
                    </span>
                  </p>
                </div>
                <div className="border-b border-blue-200"></div>

                {/* Branch and Vendor Details */}
                <div className="mt-2 flex flex-col gap-3 md:flex-row md:justify-between ">
                  <p className="flex flex-col gap-3">
                    <span className="flex items-center gap-2 text-[#8b9ead] text-medium font-medium">
                      <FaStore />
                      BRANCH NAME
                    </span>

                    <span className="ml-10 text-sm text-gray-700] dark:text-white font-semibold">
                      {bookDetails?.book?.branch_name}
                    </span>
                  </p>

                  <p className="mr-10 flex flex-col gap-3">
                    <span className="flex items-center gap-2 text-[#8b9ead] text-medium font-medium">
                      {/* <span>
                        <img
                          src={marketStore}
                          alt="vendor"
                          height={12}
                          width={14}
                        />
                      </span> */}
                      <BsPersonWorkspace />
                      VENDOR
                    </span>
                    <span className="ml-10 text-sm text-gray-700 dark:text-white font-semibold">
                      {bookDetails?.book?.vendor}
                    </span>
                  </p>
                </div>

                <div className="border-b border-blue-200"></div>

                {/* Condition and Cover type of book */}
                <div className=" mt-5 flex flex-col md:flex-row md:justify-between  ">
                  <p className="flex flex-col justify-between gap-4 ">
                    <span className="flex items-center gap-2 text-gray-400 text-md font-semibold">
                      <IoDiamondOutline />
                      CONDITION
                    </span>
                    <span className="ml-10 text-md text-gray-700 dark:text-white font-semibold">
                      {bookDetails?.book?.condition_name}
                    </span>
                  </p>

                  <p className="mt-4 md:mt-0 flex flex-col justify-between gap-4 mr-20">
                    <span className="flex items-center gap-2 text-gray-400 text-md font-semibold">
                      <GiBookCover /> COVER
                    </span>
                    <span className="ml-10 text-md text-gray-700 dark:text-white font-semibold">
                      {bookDetails?.book?.cover_name}
                    </span>
                  </p>
                </div>
                <div className="border-b border-blue-200"></div>

                {/* Comments Section */}
                <div className="mt-5">
                  <h1 className="text-xl font-medium flex justify-start items-center gap-2">
                    <MdOutlineReviews />
                    Comments
                  </h1>
                  <div className="flex justify-center item-center bg-neutral-100 rounded-md p-10 m-5 dark:bg-slate-700">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>

            {/* Submit or Close button */}
            <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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

export default BookDetailsModal;
