import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RxCross1 } from "react-icons/rx";
import { useSaveBook } from "../../../../hooks/books/useSaveBook";

const DeleteBook = ({ book, close }) => {
  const queryClient = useQueryClient();
  const { deleteBook, isLoading } = useSaveBook();

  /* Delete Book Mutation */
  const { mutateAsync: deleteBookMutation } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      close();
    },
    onError: (err) => {
      // console.log(err,"Error deleting Book")
      close();
    }
  });

  return (
    <div className="fixed left-0 top-0  inset-0 bg-[#64748B] bg-opacity-75 transition-opacity dark:bg-slate-300 dark:bg-opacity-75 lg:left-[18rem]">
      <div className="relative p-5 rounded-md">
        {/* Modal Close Button */}
        <div className="flex justify-end p-5 md:p-10 ">
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
        <div className="my-5 rounded-md flex justify-center items-center z-70  overflow-hidden xs:h-[400px] overflow-y-auto ">
          <div className="mt-10 p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
            <div className="flex justify-between items-center rounded-sm p-3 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]">
              <h3 className="font-bold text-[#313D4A] dark:text-white">
                Delete Book{" "}
              </h3>
            </div>

            <p className="mt-10 text-xl text-blue-500">
              {`Are u sure you want to delete the Book ${book?.title}?`}
            </p>

            <div className="mt-10 flex justify-evenly gap-2">
              <button
                onClick={() => deleteBookMutation(book?.id)}
                className="border p-2 px-10 text-medium text-md bg-slate-600 text-white rounded-md text-[17px] hover:bg-slate-400"
              >
                {isLoading ? "Removing" : "Yes"}
              </button>
              <button
                onClick={close}
                className="border p-2 px-10 text-medium text-xl bg-slate-600 text-white rounded-md text-[17px] hover:bg-slate-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
