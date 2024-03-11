import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { FetchBookById } from "../../../../api/books";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NoImage from "../../../../assets/no-image.png";
import { useState } from "react";
import { useSaveBook } from "../../../../hooks/books/useSaveBook";
const settings = {
  dots: true,
  lazyLoad: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};
const DeleteBookModal = ({ data, close }) => {
  const [isLoading, setIsLoading] = useState(false);
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
  async function deleteBookID(bookId) {
    setIsLoading(true);

    const imagesIds = bookDetails?.book?.cover_img_url?.map(
      (img) => img.public_id
    );

    const deletedData = { book_id: bookId, cover_img_url: imagesIds };
    await deleteBookMutation(deletedData);
  }

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
    <>
      <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity">
        <div className="relative p-5 rounded-sm">
          <div className="flex items-center justify-center p-5 z-10 w-screen overfow-hidden xs:h-[300px]overflow-y-auto ">
            <div className="flex flex-col">
              {/* <!--Book Details Form --> */}
              <div className="px-5 relative rounded-md border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
                <div className="text-center rounded-sm p-3 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]">
                  <h3 className="text-center font-bold text-[#313D4A] dark:text-white">
                    <span className="text-3xl">
                      {bookDetails?.book?.title?.toUpperCase()}
                    </span>
                  </h3>
                </div>

                <div className="max-h-[500px] px-2 w-[320px] sm:w-[500px] md:w-[650px] overflow-hidden overflow-y-auto ">
                  {/* <div> */}
                  <div className="mb-10 w-full h-[300px] flex justify-center items-center">
                    <Slider {...settings} className="w-[320px] h-[320px]">
                      {bookDetails?.book?.cover_img_url?.map((image) => (
                        <div key={image?.public_id}>
                          <img
                            src={image?.secureURL || NoImage}
                            alt="book_cover"
                            className="w-full h-[300px] object-cover overflow-hidden "
                          />
                        </div>
                      ))}
                    </Slider>
                    {/* </div> */}
                  </div>
                  <div className="flex flex-col gap-3 bg-neutral-100 px-3 dark:bg-slate-900">
                    {/* Content Details  */}
                    <div className="mt-20 flex flex-col gap-2 md:mt-0 ">
                      <span className="text-[#4A5C6A] text-medium font-medium">
                        BOOK AUTHOR
                      </span>
                      <h3 className="text-md text-[#53838e] capitalize dark:text-white font-semibold">
                        {bookDetails?.book?.author_name}
                      </h3>

                      <span className="text-[#4A5C6A] text-medium font-medium">
                        DESCRIPTION
                      </span>

                      <p className="text-md text-[#9BA8AB] dark:text-white font-medium">
                        {bookDetails?.book?.summary}
                      </p>

                      <p className="mb-3 text-md text-[#9BA8AB] dark:text-white font-medium ">
                        <span className="text-[#4A5C6A] text-medium font-medium">
                          CREDIT
                        </span>
                        <span className=" mx-5 py-0.5 px-3 rounded-xl md bg-[#2b4838] text-[#e1edf0] dark:text-white">
                          {bookDetails?.book?.credit}
                        </span>
                      </p>

                      <p className="mb-3 text-md text-[#9BA8AB] dark:text-white font-medium">
                        <span className="text-[#4A5C6A] text-medium font-medium">
                          RENT PRICE
                        </span>
                        <span className=" mx-5 py-0.5 px-3 rounded-xl md bg-[#2b4838] text-[#e1edf0] dark:text-white">
                          {bookDetails?.book?.rental_price}
                        </span>
                      </p>

                      <p className="mb-3 text-md text-[#9BA8AB] dark:text-white font-medium">
                        <span className="text-[#4A5C6A] text-medium font-medium">
                          PURCHASE PRICE
                        </span>
                        <span className=" mx-5 py-0.5 px-3 rounded-xl md bg-[#2b4838] text-[#e1edf0] dark:text-white">
                          {bookDetails?.book?.purchase_price}
                        </span>
                      </p>

                      <div className="flex flex-col justify-between gap-1 mt-5 md:flex-row">
                        <div>
                          <span className="text-[#4A5C6A] text-medium font-medium">
                            PUBLISHER
                          </span>
                          <h4 className="text-md text-[#9BA8AB] dark:text-white font-semibold">
                            {bookDetails?.book?.publisher_name}
                          </h4>
                        </div>

                        <div>
                          <span className="text-[#4A5C6A] text-medium font-medium">
                            PUBLISH YEAR
                          </span>
                          <h5 className="text-md text-[#9BA8AB] dark:text-white font-semibold">
                            {bookDetails?.book?.publish_year}
                          </h5>
                        </div>
                      </div>
                    </div>
                    {/* Other Book Details */}
                    <div className="mt-10 ">
                      <h3 className="text-xl font-bold text-neutral-800 mb-3 dark:text-gray-300">
                        Other Details
                      </h3>
                      <h5 className="mb-3 text-md text-[#9BA8AB] dark:text-white font-medium">
                        <span className="text-[#4A5C6A] text-medium font-medium">
                          ISBN{" "}
                        </span>
                        <span className="bg-neutral-200 text-sm mx-1 py-1 px-2 rounded-xl text-blue-400">
                          {bookDetails?.book?.isbn}
                        </span>
                      </h5>

                      <p className="mb-3 text-md text-[#9BA8AB] dark:text-white font-medium">
                        <span className="text-[#4A5C6A] text-medium font-medium">
                          CATEGORY
                        </span>
                        <span className="bg-neutral-200 text-sm mx-1 py-1 px-2 rounded-xl text-orange-700">
                          {bookDetails?.book?.category_name}
                        </span>
                      </p>

                      <p className="mb-3 text-md text-[#9BA8AB] dark:text-white font-medium">
                        <span className="text-[#4A5C6A] text-medium font-medium">
                          Availble for Sale:{" "}
                        </span>{" "}
                        <span className="bg-neutral-300  py-0.5 text-sm px-2 rounded-xl text-blue-500">
                          {bookDetails?.book?.available
                            ? "IN STOCK"
                            : "OUT OF STOCK"}
                        </span>
                      </p>
                    </div>

                    <div className="mt-2 flex flex-col gap-3 md:flex-row md:gap-5 ">
                      <p className="flex flex-col">
                        <span className="text-[#8b9ead] text-medium font-medium">
                          BRANCH NAME
                        </span>

                        <span className="text-sm text-gray-700] dark:text-white font-semibold">
                          {bookDetails?.book?.branch_name}
                        </span>
                      </p>

                      <p className="flex flex-col">
                        <span className="text-[#8b9ead] text-medium font-medium">
                          VENDOR
                        </span>
                        <span className="text-sm text-gray-700 dark:text-white font-semibold">
                          {bookDetails?.book?.vendor}
                        </span>
                      </p>
                    </div>
                    <div className=" mt-5 flex flex-col md:flex-row md:gap-5 md:items-center">
                      <p className="flex flex-col justify-between gap-1 ">
                        <span className="text-gray-400 text-md font-semibold">
                          {" "}
                          CONDITION{" "}
                        </span>
                        <span className="text-md text-gray-700 dark:text-white font-semibold">
                          {bookDetails?.book?.condition_name}
                        </span>
                      </p>

                      <p className="flex flex-col justify-between gap-1 ">
                        <span className="text-gray-400 text-md font-semibold">
                          COVER
                        </span>
                        <span className="text-md text-gray-700 dark:text-white font-semibold">
                          {bookDetails?.book?.cover_name}
                        </span>
                      </p>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-5">
                      <h1 className="text-xl font-medium">Comments</h1>
                      <div className="flex justify-center item-center bg-neutral-100 rounded-md p-10 m-5 dark:bg-slate-700">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit or Close button */}
                <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    disabled={isLoading}
                    onClick={() => deleteBookID(data)}
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#f1525a] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Delete
                  </button>
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
      </div>
    </>
  );
};

export default DeleteBookModal;
