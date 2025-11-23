import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useSaveBook } from "../../../../../hooks/books/useSaveBook";
import { useMutation,  useQueryClient } from "@tanstack/react-query";
import { useFetchAuthors } from "../../../../../hooks/books/useFetchAuthors";
import { useAuthor } from "../../../../../hooks/books/useSaveAuthor";
import {
  useFetchConditions,
  useConditionActions,
} from "../../../../../hooks/books/useFetchConditions";
import { useFetchCategories } from "../../../../../hooks/books/useFetchCategories";
import {
  useCoverActions,
  useFetchCovers,
} from "../../../../../hooks/books/useFetchCovers";
import { useFetchPublishers } from "../../../../../hooks/books/useFetchPublishers";
import { usePublisher } from "../../../../../hooks/books/useAddPublisher";
import { useFetchVendors } from "../../../../../hooks/books/useFetchVendors";
import { useFetchBranches } from "../../../../../hooks/books/useFetchBranches";
import { useAuthContext } from "../../../../../hooks/useAuthContext";
import { bookSchema } from "../../../../../schemas/books";
import { RxCross1 } from "react-icons/rx";
import { getCustomSelectStyles } from "../../../shared/CreatableSelectCustomStyles";
import CategoryCreatableSelect from "../../../Books/CategoryCreatableSelect";
import { useCategoryActions } from "../../../../../hooks/books/useCategoriesActions";
import CoversCreatableSelect from "../../../Books/CoversCreatableSelect";
import ConditionsCreatableSelect from "../../../Books/ConditionsCreatableSelect";
import CreatableSelect from "react-select/creatable";
import FileUpload from "../../../shared/FileUpload";
import { toast } from "react-toastify";

import { useDebounce } from 'use-debounce';
import { useBookSearch } from '../../../../../api/useBookSearch';
import LoadingSpinner from "../../../Loader/LoadingSpinner";
import { useBookSearchByIsbn } from "../../../../../api/useBookSearchByIsbn";

const CreateBookModal = ({ setShowModal }) => {
  const { auth } = useAuthContext();
  const queryClient = useQueryClient();

  // Add these new state variables at the top of your component
  const [bookSearchResults, setBookSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const theme = localStorage.getItem("color-theme")?.replace(/"/g, '') || "light";
  const selectStyles = useMemo(() => getCustomSelectStyles(theme), [theme]);


  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      author: null,
      publisher: null,
      category: null,
      cover: null,
      condition: "",
      isbn: "",
      isAvailable: false,
      vendor_id: null,
      branch_id: null,
      cover_img_url: [],
      discount_percentage: "",
      summary: "",
      publish_year: "",
      credit: "",
      edition: "",
      quantity: 1
    },
    resolver: zodResolver(bookSchema),
    mode: "all",
  });

  const { error, message, addBook } = useSaveBook();
  const [imagesList, setImagesList] = useState([]);

  const titleValue = watch('title');
  const IsbnValue = watch('isbn')
  const [debouncedTitle] = useDebounce(titleValue, 2000);
  const [debouncedIsbn] = useDebounce(IsbnValue, 1000);

  const { addAuthor } = useAuthor();
  const { addPublisher } = usePublisher();
  const { addCategory } = useCategoryActions();
  const { addCover } = useCoverActions();
  const { addConditionType } = useConditionActions();

  // Fetch all Authors
  const {
    isPending: isPendingAuthors,
    isError: isAuthorFetchingError,
    data: authorsData,
  } = useFetchAuthors();

  /* Fetch Type of Condition For Books */
  const {
    isPending: isPendingConditions,
    data: conditionsData,
    refetch: refetchCondition,
  } = useFetchConditions();

  /* Fetch Categories List for Books */
  const {
    isPending: isPendingCategories,
    data: categoriesData,
    refetch: refetchCategory,
  } = useFetchCategories();

  /* Fetch Types of Covers For Books */
  const {
    isPending: isPendingCovers,
    data: coversData,
    refetch: refetchCovers,
  } = useFetchCovers();

  /* Fetch Publishers Lists */
  const { isPending: isPendingPublishers, data: publishersData } =
    useFetchPublishers();

  /* Fetch All Existing Vendors List */
  const { isPending: isPendingVendors, data: vendorsData } = useFetchVendors();

  /* Fetch All Branch List */
  const { isPendingBranches, data: branchesData } = useFetchBranches();

  /* Mutation to Create New Author  */
  const { mutateAsync: addAuthorMutation } = useMutation({
    mutationFn: addAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries(["authors"]); // invalidate author query to refetch new results
    },
  });
  /* Mutation to Add New Publisher  */

  const { mutateAsync: addPublisherMutation } = useMutation({
    mutationFn: addPublisher,
    onSuccess: () => {
      queryClient.invalidateQueries(["publishers"]); // invalidate publishers query to refetch
    },
  });

  const { mutateAsync: addCategoryMutation } = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // invalidate publishers query to refetch
    },
  });

  // Memoize options
  const authorOptions = useMemo(
    () =>
      authorsData?.authors?.map((author) => ({
        value: author.id,
        label: author.name,
      })) ?? [],
    [authorsData]
  );

  const publisherOptions = useMemo(
    () =>
      publishersData?.publishers?.map((publisher) => ({
        value: publisher.id,
        label: publisher.name,
      })) ?? [],
    [publishersData]
  );


  const categoryOptions = useMemo(() =>
    categoriesData?.categories?.map(category => ({
      value: category.id,
      label: category.name
    })) || [],
    [categoriesData]
  );


  // Create New Author function for  creatable Author fields
  const handleCreateAuthor = useCallback(
    async (inputValue) => {
      const toastId = toast.loading('Creating new author...');
      try {
        const authorForm = {
          name: inputValue,
          link: "",
          description: "",
        };
        const newAuthor = await addAuthorMutation(authorForm);
        // console.log(newAuthor, "New Author");

        toast.update(toastId, {
          render: 'Author created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });

        return { value: newAuthor?.data?.id, label: newAuthor?.data?.name };

      } catch (error) {
        console.error("Error creating author:", error);
        toast.update(toastId, {
          render: `Error: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 1000,
        });
      }
    },
    [addAuthorMutation]
  );

  /* Create New Category   */
  const handleCreateCategory = useCallback(
    async (inputValue) => {
      // console.log(inputValue, "Value");
      const toastId = toast.loading('Creating new category...');

      try {
        const newCategory = await addCategory(inputValue);
        // console.log(newCategory, "API response");
        toast.update(toastId, {
          render: 'Category created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        await refetchCategory();
        return newCategory.categories;
      } catch (error) {
        toast.update(toastId, {
          render: `Error: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 1000,
        });
        console.error("Error creating category:", error);
        return;
      }
    },
    [addCategory, refetchCategory]
  );
  /* Create New Cover Type   */

  const handleCreateCovers = useCallback(
    async (inputValue) => {
      // console.log(inputValue, "cover value");
      const toastId = toast.loading('Creating new covers...');
      try {
        const newCovers = await addCover(inputValue);
        // console.log(newCovers, "API response");
        toast.update(toastId, {
          render: 'Cover type created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        await refetchCovers();
        return newCovers;
      } catch (error) {
        console.error("Error creating cover:", error);
        toast.update(toastId, {
          render: `Error: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }
    },
    [addCover, refetchCovers]
  );
  /* Create New Condition type for book   */
  const handleCreateConditions = useCallback(
    async (inputValue) => {
      // console.log(inputValue, "condition value");
      const toastId = toast.loading('Creating new condition...');

      try {
        const newCondition = await addConditionType(inputValue);
        // console.log(newCondition, "API response");
        toast.update(toastId, {
          render: 'Condition type created successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        await refetchCondition();
        return newCondition;
      } catch (error) {
        console.error("Error creating condition:", error);
        toast.update(toastId, {
          render: `Error: ${error.message}`,
          type: 'error',
          isLoading: false,
          autoClose: 1000,
        });
        return;
      }
    },
    [addConditionType, refetchCondition]
  );

  // Create New Publisher function for creatable Publisher field
  const onPublisherCreate = useCallback(
    async (inputField) => {
      const toastId = toast.loading('Creating new condition...');

      const publisherForm = {
        name: inputField,
        link: "",
        description: "",
      };
      const newPublisher = await addPublisherMutation(publisherForm);
      toast.update(toastId, {
        render: 'Publisher created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      return newPublisher.publishers;
    },
    [addPublisherMutation]
  );

  /* Add Book Mutation  */

  const { mutateAsync: addBookMutation } = useMutation({
    mutationFn: addBook,
    onSuccess: (data) => {
      reset();
      // console.log(data);
      toast.success(message);
      setShowModal(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["books"]); // invalidate books query to refetch
    },
    onError: () => {
      toast.error(message || "Failed to add book")
    }
  });


  const selectedAuthor = watch("author");
  const selectedCondition = watch("condition");
  const selectedCategory = watch("category");
  const selectedCover = watch("cover");
  const selectedPublisher = watch("publisher");

  // console.log(errors, "Is Book Added Form Valid");


  const findOrCreateAndSet = useCallback(
    async ({ fieldName, apiName, options, mutationFn }) => {
      if (!apiName) return;
      let optionName = apiName?.name || apiName
      const existingOption = options?.find(
        (option) => option?.label?.toLowerCase() == optionName?.toLowerCase()
      );

      if (existingOption) {
        setValue(fieldName, existingOption);
        return existingOption;
      } else {
        try {

          const newObject = await mutationFn(apiName);
          const newOption = {
            value: newObject?.data ? newObject?.data?.id : newObject?.id,
            label: newObject?.data ? newObject?.data?.name : newObject?.name,
          };

          setValue(fieldName, newOption); // Set the form value
          return newOption; // Return the newly created object

        } catch (error) {
          console.error(`Error creating new ${fieldName}:`, error);
          return null;
        }
      }
    },
    [setValue] // Dependency on setValue is crucial
  );
  const { data: searchData, refetch, isLoading: isBookSearchLoading } = useBookSearch(debouncedTitle, {
    enabled: false,
  });

  const { data: searchIsbnData, refetch: refetchIsbn, isLoading: isIsbnSearchLoading } = useBookSearchByIsbn(debouncedIsbn, {
    enabled: false,
  });


  console.log(searchIsbnData, "ISBN Book Search Data");

  const handleSearch = () => {
    setBookSearchResults([]);
    setSelectedBook(null);
    refetch();
  };

  const handleIsbnSearch = () => {
    setBookSearchResults([]);
    setSelectedBook(null);
    refetchIsbn();
  };

  useEffect(() => {
    if (searchData?.items) {
      setBookSearchResults(searchData.items);
    }
  }, [searchData]);

  // console.log(bookSearchResults, "Search by Title Results", selectedBook);

  // Use a separate effect to handle the ISBN search results when they arrive
  useEffect(() => {
    if (searchIsbnData?.items?.length > 0) {
      // Since ISBN search should be exact, we can directly select the first result
      setSelectedBook(searchIsbnData.items[0]?.volumeInfo);
    } else if (searchIsbnData) {
      // Handle the case where the API returns no results
      toast.error('No book found with that ISBN. Please try a different number.');
      setSelectedBook(null); // Clear any previous selection
    }
  }, [searchIsbnData, setSelectedBook]);
  useEffect(() => {
    if (selectedBook) {

      const authorName = selectedBook?.authors?.[0];
      const publisherName = selectedBook?.publisher;
      const categoryName = selectedBook?.categories && selectedBook?.categories?.length > 0 ? selectedBook?.categories[0] : null;
      // console.log(selectedBook, "API Book Data")

      const imageUrl = [
        selectedBook.imageLinks?.thumbnail ||
        selectedBook.imageLinks?.smallThumbnail
      ]
      if (imageUrl) {
        const apiCoverImage = {
          url: imageUrl,
          name: `${selectedBook?.title} Cover Image`,
          type: 'image/jpeg',
        };

        setImagesList([apiCoverImage]);

        setValue('cover_img_url', [imageUrl]);
      } else {
        setImagesList([]);
        setValue('cover_img_url', []);
      }
      setValue('title', `${selectedBook?.title} ${selectedBook?.subtitle || ''}`);
      setValue('summary', selectedBook?.description);
      // Get the ISBN of type isbn_13 from the list
      const isbn13Object = selectedBook.industryIdentifiers?.find(
        (identifier) => identifier.type === 'ISBN_13'
      );
      setValue('isbn', isbn13Object?.identifier || "");
      setValue('publish_year', selectedBook?.publishedDate?.substring(0, 4) || "");
      setValue('cover_img_url', [
        selectedBook.imageLinks?.thumbnail,
        selectedBook.imageLinks?.smallThumbnail
      ].filter(Boolean));
      const createAuthorAndSet = async () => {

        if (authorName) {
          const authorForm = {
            name: authorName,
            link: "",
            description: "",
          };

          const result = await findOrCreateAndSet({
            fieldName: 'author',
            apiName: authorForm,
            options: authorOptions,
            mutationFn: addAuthorMutation,
          });

          if (result) {

            setValue('author', result)
          }
        }
        if (publisherName) {
          const publisherForm = {
            name: publisherName,
            link: "",
            description: "",
          };
          const publisher = await findOrCreateAndSet({
            fieldName: 'publisher',
            apiName: publisherForm,
            options: publisherOptions,
            mutationFn: addPublisherMutation,
          });

          if (publisher) {

            setValue('publisher', publisher || null)
          }
        }
        if (categoryName) {
          const category = await findOrCreateAndSet({
            fieldName: 'category',
            apiName: categoryName,
            options: categoryOptions,
            mutationFn: addCategoryMutation,
          });

          if (category) {

            setValue('category', category || null)
          }
        }
      }

      createAuthorAndSet();
    }
  }, [setValue, selectedBook, addAuthorMutation, addCategoryMutation, findOrCreateAndSet, addPublisherMutation]);

  /* Save Book Details Form function */
  const onSubmit = async (data) => {
    // console.log(data);
    // Create new book
    const booksForm = {
      ...data,
      author: selectedAuthor?.value,
      cover: selectedCover?.value,
      category: selectedCategory?.value,
      cover_img_url: [...imagesList],
      publisher: selectedPublisher?.value,
      condition: selectedCondition?.value,
      vendor_id: data?.vendor_id == "" ? null : data?.vendor_id,
      role_id: auth?.roleId,
      added_by: auth?.role_name,
    };

    // console.log(booksForm, "Form Details of Book");

    await addBookMutation(booksForm); 




  };

  if (
    isPendingAuthors ||
    isPendingCategories ||
    isPendingConditions ||
    isPendingCovers ||
    isPendingPublishers ||
    isPendingVendors ||
    isPendingBranches
  ) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity">
        <div className="relative p-5 rounded-sm">
          <div className="flex items-center justify-center p-5 z-10 overfow-hidden xs:h-[300px]overflow-y-auto ">
            <div className="px-10 relative rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
              <h2>Loading .... Please Wait</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    !authorsData ||
    (isAuthorFetchingError &&
      !categoriesData &&
      !conditionsData &&
      !coversData &&
      !publishersData &&
      !vendorsData &&
      !branchesData)
  ) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity">
        <div className="relative p-5 rounded-sm">
          <div className="flex items-center justify-center p-5 z-10 overfow-hidden xs:h-[300px]overflow-y-auto ">
            <div className="px-10 relative rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
              <h2>Error Loading Data.... Please Try Again</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // console.log(errors, "Form Error", isValid);

  return (
    <div className="fixed left-0 top-0  inset-0 bg-[#64748B] bg-opacity-75 transition-opacity dark:bg-slate-400 dark:bg-opacity-75 lg:left-[18rem]">
      <div className="relative p-5 rounded-md">
        {/* Modal Close Button */}
        <div className="flex justify-end p-5 md:p-10">
          <RxCross1
            style={{
              height: 18,
              width: 23,
              cursor: "pointer",
              color: "#FFF !IMPORTANT",
              strokeWidth: 2,
            }}
            aria-disabled={isSubmitting}
            onClick={() => setShowModal(false)}
          />
        </div>
        <div className=" md:mx-20">
          <div className=" p-10 relative rounded-md border border-[#E2E8F0] bg-white shadow-lg dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
            <div className="rounded-sm p-3 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
              <h3 className="font-bold text-[#313D4A] dark:text-white">
                Create New Book
              </h3>
            </div>

            {/* Book Details Form */}
            <div className="max-h-[600px] px-12 w-full overflow-hidden overflow-y-auto text-slate-800">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-6.5 m-5.5 sm:overflow-auto sm:p-2 sm:m-2">
                  {/* Display the matched book title results to select and populate the Form fields  */}
                  <div>
                    {bookSearchResults?.length > 0 && (
                      <div className="mt-4 mb-4.5 p-4 border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                        <h4 className="text-sm font-bold mb-2 dark:text-white">Suggested Results</h4>
                        <ul>
                          {bookSearchResults?.map((book) => (
                            <li key={book?.id} className="flex justify-between items-center py-1 border-b last:border-0">
                              <span className="text-sm text-slate-800 dark:text-white">
                                {book?.volumeInfo?.title} by {book?.volumeInfo?.authors?.join(', ') || 'Unknown Author'}
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedBook(book.volumeInfo)}
                                className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-sm text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:text-slate-400"
                              >
                                Select
                              </button>
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => setBookSearchResults([])}
                          className="w-full text-md bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-sm text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:text-slate-400"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>

                  {/* first Row fields */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">

                    {/* Search by Title */}
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Title
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="flex gap-2 relative">

                        <input
                          autoFocus
                          type="text"
                          name="title"
                          placeholder="Add Title"
                          {...register("title", { required: true })}
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 pl-5 pr-10 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        <button
                          type="button"
                          onClick={handleSearch}

                          disabled={!titleValue || isBookSearchLoading}
                          className="absolute top-1/2 right-2 -translate-y-1/2"
                        >
                          {isBookSearchLoading ? <LoadingSpinner /> : <svg
                            className="fill-[#64748B] hover:fill-[#3C50E0] dark:fill-[#AEB7C0] dark:hover:fill-[#3C50E0]"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                              fill=""
                            />
                          </svg>}
                        </button>
                      </div>

                    </div>

                    {/* Search By ISBN */}
                    <div className="mb-4.5 w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        ISBN
                        <span className="text-red-600">*</span>
                      </label>
                      <div className="flex gap-2 relative">

                        <input
                          name="isbn"
                          type="text"
                          placeholder="Enter ISBN "
                          {...register("isbn", { required: true })}
                          className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                        />
                        <button
                          type="button"
                          onClick={handleIsbnSearch}
                          disabled={!IsbnValue || isIsbnSearchLoading}
                          className="absolute top-1/2 right-2 -translate-y-1/2"
                        >
                          {isIsbnSearchLoading ? <LoadingSpinner /> : <svg
                            className="fill-[#64748B] hover:fill-[#3C50E0] dark:fill-[#AEB7C0] dark:hover:fill-[#3C50E0]"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                              fill=""
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                              fill=""
                            />
                          </svg>}
                        </button>
                      </div>
                      {errors?.isbn?.message && (
                        <p className="format-message error">
                          {errors.isbn.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Second Row Fields */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Publisher <span className="text-red-600">*</span>
                      </label>

                      <Controller
                        control={control}
                        name="publisher"
                        render={({ field }) => (
                          <CreatableSelect
                            {...field}
                            options={publisherOptions}
                            isClearable
                            isDisabled={isPendingPublishers}
                            isLoading={isPendingPublishers}
                            styles={selectStyles}
                            onChange={async (newValue, actionMeta) => {
                              if (actionMeta.action === "create-option") {
                                const result = await onPublisherCreate(newValue.label);
                                const newOption = { value: result.id, label: result.name }
                                field.onChange(newOption)
                              } else {
                                field.onChange(newValue); //select existing option
                              }
                            }}
                            value={field.value}
                            placeholder="Select or type a publisher..."
                            id="publisher"
                          />
                        )}
                      />

                      {errors?.publisher?.message && (
                        <p className="format-message error">
                          {errors.publisher.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Publish Year
                      </label>
                      <input
                        type="text"
                        name="publish_year"
                        placeholder="Add Publish Year"
                        {...register("publish_year")}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />

                      {errors?.publish_year?.message && (
                        <p className="format-message error">
                          {errors.publish_year.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Third Row fields */}
                  <div className="mt-2 mb-4.5 flex flex-col gap-2 md:flex-row md:gap-9">
                    <CategoryCreatableSelect
                      control={control}
                      errors={errors}
                      isPendingCategories={isPendingCategories}
                      categoriesData={categoriesData}
                      handleCreateCategory={handleCreateCategory}
                      newStyles={selectStyles}

                    />
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Author <span className="text-red-600">*</span>
                      </label>

                      <Controller
                        control={control}
                        name="author"
                        render={({ field }) => (
                          <CreatableSelect
                            {...field}
                            options={authorOptions}
                            isClearable
                            isDisabled={isPendingAuthors}
                            isLoading={isPendingAuthors}
                            styles={selectStyles}
                            onChange={async (newValue, actionMeta) => {
                              if (actionMeta.action === "create-option") {
                                const result = await handleCreateAuthor(newValue.label);
                                if (result) { field.onChange(result); }
                              } else {
                                field.onChange(newValue);
                              }
                            }}
                            value={field.value}
                            placeholder="Select or type an Author..."
                            id="author"
                          />
                        )}
                      />

                      {errors?.author?.message && (
                        <p className="format-message error">
                          {errors.author.message}
                        </p>
                      )}
                    </div>

                  </div>


                  {/* Fourth Row Fields */}
                  <div className="mt-2 mb-4.5 flex flex-col gap-2 md:flex-row md:gap-9">
                    <ConditionsCreatableSelect
                      control={control}
                      errors={errors}
                      isPendingConditions={isPendingConditions}
                      conditionsData={conditionsData}
                      handleCreateConditions={handleCreateConditions}
                      newStyles={selectStyles}
                    />

                    <CoversCreatableSelect
                      control={control}
                      errors={errors}
                      isPendingCovers={isPendingCovers}
                      coversData={coversData}
                      handleCreateCovers={handleCreateCovers}
                      newStyles={selectStyles}
                    />
                  </div>

                  {/* Fifth Row */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Member Price
                      </label>
                      <input
                        type="text"
                        name="member_price"
                        placeholder="Add Member Price"
                        {...register("member_price")}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                      {errors?.member_price?.message && (
                        <p className="format-message error">
                          {errors?.member_price?.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Purchase Price
                      </label>
                      <input
                        type="text"
                        name="purchase_price"
                        placeholder="Add Purchase Price"
                        {...register("purchase_price")}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />

                      {errors?.purchase_price?.message && (
                        <p className="format-message error">
                          {errors.purchase_price.message}
                        </p>
                      )}
                    </div>
                  </div>


                  {/* Sixth Row */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Discount Percentage
                      </label>
                      <input
                        type="text"
                        name="discount_percentage"
                        placeholder="Add discount_percentage"
                        {...register("discount_percentage")}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                      {errors?.discount_percentage?.message && (
                        <p className="format-message error">
                          {errors.discount_percentage.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Credits <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        name="credit"
                        placeholder="Add Credits"
                        {...register("credit", { required: true })}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                      {errors?.credit?.message && (
                        <p className="format-message error">
                          {errors.credit.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Edition
                      </label>
                      <input
                        type="text"
                        name="edition"
                        placeholder="Add Book Edition"
                        {...register("edition")}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                      {errors?.edition?.message && (
                        <p className="format-message error">
                          {errors.edition.message}
                        </p>
                      )}
                    </div>

                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Total Available Items <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        name="quantity"
                        placeholder="Add Quantity"
                        {...register("quantity", { required: true })}
                        className="w-full rounded-sm border-[1.5px] dark:text-white border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                      />
                      {errors?.quantity?.message && (
                        <p className="format-message error">
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Seventh Row */}

                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    {vendorsData?.vendors.length > 0 && <div className="w-full xl:w-1/2" autoFocus>
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Vendor
                      </label>

                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:text-neutral-100 dark:focus:text-neutral-100 dark:focus:border-[#3C50E0]"
                          name="vendor_id"
                          {...register("vendor_id", { required: true })}
                        >
                          <option disabled>Select</option>

                          {vendorsData?.vendors &&
                            vendorsData?.vendors?.map((vendor) => (
                              <option key={vendor?.id} value={vendor?.id}>
                                {vendor?.name}
                              </option>
                            ))}{" "}
                        </select>
                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className=" dark:text-white fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                      {errors?.vendor_id?.message && (
                        <p className="format-message error">
                          {errors.vendor_id.message}
                        </p>
                      )}
                    </div>}
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Branch
                      </label>
                      <div className="relative z-20 bg-transparent dark:bg-form-input">
                        <select
                          className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:text-neutral-100 dark:focus:text-neutral-100 dark:focus:border-[#3C50E0]"
                          name="branch_id"
                          {...register("branch_id", { required: true })}
                        >
                          <option disabled>Select</option>
                          {branchesData?.branches &&
                            branchesData?.branches?.map((branch) => (
                              <option key={branch?.id} value={branch?.id}>
                                {branch?.name}
                              </option>
                            ))}{" "}
                        </select>

                        <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                          <svg
                            className=" dark:text-white fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                fill=""
                              ></path>
                            </g>
                          </svg>
                        </span>
                      </div>
                      {errors?.branch_id?.message && (
                        <p className="format-message error">
                          {errors.branch_id.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Eighth Row */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full ">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Summary
                      </label>
                      <textarea
                        type="text"
                        name="summary"
                        rows={4}
                        placeholder="Add a summary"
                        {...register("summary")}
                        className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:text-neutral-50 dark:focus:border-[#3C50E0]"
                      />
                      {errors?.summary?.message && (
                        <p className="format-message error">
                          {errors.summary.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ninth Row */}
                  <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap-9">
                    <div className="w-full xl:w-1/2">
                      <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                        Add Cover Images
                      </label>
                      <FileUpload
                        setImagesList={setImagesList}
                        imagesList={imagesList}
                      />
                    </div>
                  </div>

                  {/* Tenth Row */}

                  <div className="block">
                    <div className="mt-4 sm:mt-0">
                      <div className="mt-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="isAvailable"
                            {...register("isAvailable")}
                            className="rounded bg-gray-200 border-transparent h-4 w-4 p-5 ml-2 focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                          />
                          <span className="ml-2  text-[#0284c7] dark:text-white">
                            Available{" "}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Form Submissions Buttons */}
                  <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      disabled={
                        !isDirty ||
                        !isValid ||
                        isSubmitting ||
                        imagesList?.length > 5
                      }
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                    >
                      {isSubmitting ? "Submitting" : "Submit"}
                    </button>
                    <button
                      disabled={isSubmitting}
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    {errors && (
                      <span className="text-[#DC3545] text-sm">
                        {error?.root?.message || message}
                      </span>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBookModal;
