import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { useSaveBook } from "../../../../../hooks/books/useSaveBook";

const DeleteBook = ({ book, close }) => {
  const queryClient = useQueryClient();
  const { deleteBook, isLoading } = useSaveBook();

  /* Delete Book Mutation */
  const { mutateAsync: deleteBookMutation } = useMutation({
    mutationFn: deleteBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["books"]);
      toast.success(data?.message || "Book deleted successfully");
      close();
    },
    onError: (err) => {
      // console.log(err,"Error deleting Book")
      toast.error(err?.message || "Failed to delete book");
      close();
    }
  });

  return (
    <div className="fixed inset-0 overflow-y-auto h-full w-full  bg-[#64748B] bg-opacity-75 transition-opacity z-50">
      <div className="relative p-5 rounded-md w-full mx-auto my-auto max-w-5xl ">
        {/* Modal Close Button */}
        <div className="flex justify-center items-center p-5 md:p-10 ">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "var(--color-text)",
              strokeWidth: 2,
            }}
            onClick={close}
          />
        </div>
        <div className="my-5 rounded-md flex justify-center items-center z-70  overflow-hidden xs:h-[400px] overflow-y-auto ">
          <div className="mt-10 p-10 relative rounded-md border border-border bg-surface shadow-lg md:px-8 md:py-8 ">
            <div className="flex justify-between items-center rounded-sm p-3  border-b border-primary py-4 px-6.5 ">
              <h3 className="font-bold text-text">
                Delete Book{" "}
              </h3>
            </div>

            <p className="mt-10 text-xl sm:w-[500px] text-text md:break-all">
              {`Are u sure you want to delete the Book `}<span className="font-bold text-[17px] text-orange-400">{`${book?.title}`}</span> {` from the library?`}
            </p>
            <div className="mt-10 flex flex-col md:flex-row justify-end items-end gap-2">

              <button
                onClick={close}
                className="`flex items-center gap-2 border-2 border-border py-2 px-4 font-medium text-md bg-white text-black rounded-md  hover:bg-secondary"
              >
                No
              </button>
              <button
                onClick={() => deleteBookMutation(book?.id)}
                className={`flex items-center border-2 border-border gap-2 bg-background text-text px-4 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200 
                  }`}
              // className="border p-2 px-10 text-medium text-md bg-slate-600 text-white rounded-md text-[17px] hover:bg-slate-400"
              >
                {isLoading ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
