import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSaveBook } from "../../../../hooks/books/useSaveBook";
import { useFetchAuthors } from "../../../../hooks/books/useFetchAuthors";
import CreatableSelect from "react-select/creatable";
import { useAuthor } from "../../../../hooks/books/useSaveAuthor";
import Resizer from "react-image-file-resizer";
import { useFetchConditions } from "../../../../hooks/books/useFetchConditions";
import { useFetchCategories } from "../../../../hooks/books/useFetchCategories";
import { useFetchCovers } from "../../../../hooks/books/useFetchCovers";
import { useFetchPublishers } from "../../../../hooks/books/useFetchPublishers";
import { usePublisher } from "../../../../hooks/books/useAddPublisher";
import { useFetchVendors } from "../../../../hooks/books/useFetchVendors";
import { useFetchBranches } from "../../../../hooks/books/useFetchBranches";
import { fetchBookById } from "../../../../hooks/books/useFetchBooks";

const schema = z.object({
  title: z.string().min(3, { message: "Please Enter a title" }),
  rental_price: z.string().min(1, { message: "Please Enter a price" }),
  purchase_price: z.string().min(1, { message: "Please Enter a price" }),
  condition: z.string(),
  cover: z.string(),
  category: z.string(),
  isbn: z.string().min(8, { message: "Please Enter a ISBN number" }),
  available: z.boolean(),
  vendor_id: z.unknown(),
  branch_id: null || z.unknown(),
  // cover_img_url: z.unknown(),
  discount_percentage: z.string(),
  summary: z.string(),
  publish_year: z.string(),
  publisher: z.unknown(),
  credit: z.unknown(),
  author: z.unknown(),
});
const BookDetailsModal = ({ close, bookValue }) => {
  const { error, message, updateBook } = useSaveBook();
  const queryClient = useQueryClient();
  const [imagesList, setImagesList] = useState([]);
  const [authorValue, setAuthorValue] = useState();
  const [publisherValue, setPublisherValue] = useState();

  const { data: bookDetail } = useQuery({
    queryFn: () => fetchBookById(bookValue),
    queryKey: ["role-permissions", { bookValue }],
  });

  const { addAuthor } = useAuthor();
  const { addPublisher } = usePublisher();
  const {
    isPending: isPendingAuthors,
    isError,
    data: authorsData,
  } = useFetchAuthors();

  const { isPending: isPendingConditions, data: conditionsData } =
    useFetchConditions();

  const { isPending: isPendingCategories, data: categoriesData } =
    useFetchCategories();

  const { isPending: isPendingCovers, data: coversData } = useFetchCovers();

  const { isPending: isPendingPublishers, data: publishersData } =
    useFetchPublishers();

  const { isPending: isPendingVendors, data: vendorsData } = useFetchVendors();

  const { isPendingBranches, data: branchesData } = useFetchBranches();
  const [authors, setAuthors] = useState([]);
  const [publisherList, setPublisherList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [data, setData] = useState();

  const { mutateAsync: addAuthorMutation } = useMutation({
    mutationFn: addAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries(["authors"]); // invalidate books query to refetch
    },
  });

  const { mutateAsync: addPublisherMutation } = useMutation({
    mutationFn: addPublisher,
    onSuccess: () => {
      queryClient.invalidateQueries(["publishers"]); // invalidate publishers query to refetch
    },
  });

  const handleCreate = async (inputValue) => {
    setIsLoading(true);
    const res = await addAuthorMutation(inputValue);
    setTimeout(async () => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setValue(newOption);
    }, 1000);
  };

  const onPublisherCreate = async (inputField) => {
    setIsLoading(true);
    const res = await addPublisherMutation(inputField);
    setTimeout(async () => {
      const newOption = createOption(inputField);
      setIsLoading(false);
      setValue(newOption);
    }, 1000);
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  const onUploadImages = () => {
    const coverImgFiles = document.getElementById("cover_img_url").files;

    let files = Array.from(coverImgFiles);

    files.forEach(async (file) => {
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onloadend = () => {
      //   setImagesList((prev) => [...prev, reader.result]);
      // };

      const newImage = await resizeFile(file);
      setImagesList((prev) => [...prev, newImage]);
    });
  };

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  useEffect(() => {
    if (authorsData) {
      const authorList = authorsData?.authors?.map((author) => ({
        value: author.id,
        label: author.name,
      }));
      setAuthors([...authorList]);

      if (bookDetail) {
        const defaultAuthor = authorsData?.authors?.find(
          (author) => author?.name === bookDetail?.book?.author_name
        );
        setAuthorValue({
          label: defaultAuthor?.name,
          value: defaultAuthor?.id,
        });
      }
    }
  }, [authorsData, bookDetail]);

  useEffect(() => {
    if (publishersData) {
      const publisherList = publishersData?.publishers?.map((publisher) => ({
        value: publisher.id,
        label: publisher.name,
      }));
      setPublisherList([...publisherList]);

      if (bookDetail) {
        const defaultPublisher = publishersData?.publishers?.find(
          (pub) => pub.name === bookDetail?.book?.publisher_name
        );
        setPublisherValue({
          label: defaultPublisher?.name,
          value: defaultPublisher?.id,
        });
      }
    }
  }, [publishersData, bookDetail]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting, isValid, isDirty },
  } = useForm({
    defaultValues: {
      ...bookDetail?.book,
      author: authorValue || {
        label: bookDetail?.book?.author_name,
        value: bookDetail?.book?.author_id,
      },
      publisher: publisherValue,
    },
    resolver: zodResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    reset({
      ...bookDetail?.book,
      author: authorValue,
      publisher: publisherValue,
    });
  }, [bookDetail, authorValue, publisherValue]);

  const selectedAuthor = watch("author");
  const selectedCondition = watch("condition");
  const selectedCategory = watch("category");
  const selectedCover = watch("cover");
  const selectedPublisher = watch("publisher");
  // Mutation to Update Book Details
  const { mutateAsync: updateBookMutation } = useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries(["books"]); // invalidate books query to refetch
      close();
    },
  });

  const onSubmit = async (updateData) => {
    const booksForm = {
      ...updateData,
      bookId: bookValue,
      author: selectedAuthor?.value,
      cover: selectedCover == undefined ? selectedCover : updateData?.cover,
      category:
        selectedCategory == undefined ? selectedCategory : updateData?.category,
      cover_img_url:
        imagesList?.length > 0
          ? [...imagesList]
          : bookDetail?.book?.cover_img_url,
      publisher: selectedPublisher?.value,
      condition:
        selectedCondition == undefined
          ? selectedCondition
          : updateData?.condition,
      imageUpdated: imagesList?.length > 0 ? true : false,
    };
    // const updateFormData = { ...updateData, id: data[0]?.id };
    await updateBookMutation(booksForm);
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
          <div className="flex items-center justify-center p-5 z-10 w-screen overfow-hidden xs:h-[300px]overflow-y-auto ">
            <div className="px-10 relative rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
              <h2>Loading .... Please Wait</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    !authorsData &&
    !categoriesData &&
    !conditionsData &&
    !coversData &&
    !publishersData &&
    !vendorsData &&
    !branchesData
  ) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity">
        <div className="relative p-5 rounded-sm">
          <div className="flex items-center justify-center p-5 z-10 w-screen overfow-hidden xs:h-[300px]overflow-y-auto ">
            <div className="px-10 relative rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
              <h2>Error Loading Data.... Please Try Again</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-center items-center fixed inset-0 bg-[#64748B] bg-opacity-75 transition-opacity dark:bg-slate-50 dark:bg-opacity-75">
        <div className="relative p-5 rounded-sm">
          <div className="flex items-center justify-center p-5 z-10 w-screen overfow-hidden xs:h-[300px]overflow-y-auto ">
            <div className="flex flex-col">
              {/* <!--Book Details Form --> */}
              <div className="px-10 relative rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] md:px-8 md:py-8 ">
                <div className="text-center rounded-sm p-3 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]">
                  <h3 className="font-bold text-[#313D4A] dark:text-white">
                    Update Book Details
                  </h3>
                </div>
                <div className="max-h-[600px] px-4 w-full overflow-hidden overflow-y-auto">
                  {/* Form */}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-6.5 m-5.5 sm:overflow-auto sm:p-2 sm:m-2">
                      {/* first Row fields */}
                      <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Title
                          </label>
                          <input
                            autoFocus
                            type="text"
                            name="title"
                            placeholder="Add Title"
                            {...register("title")}
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.title?.message && (
                            <p className="format-message error">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Author
                          </label>

                          <Controller
                            control={control}
                            name="author"
                            render={({ field }) => (
                              <CreatableSelect
                                {...field}
                                options={authors}
                                isClearable
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused
                                      ? "#3C50E0"
                                      : "#E2E8F0",
                                    padding: 5,
                                  }),
                                }}
                                onChange={(newValue, actionMeta) => {
                                  if (actionMeta.action === "create-option") {
                                    handleCreate(newValue.label);
                                  } else {
                                    field.onChange(newValue);
                                  }
                                }}
                                value={field?.value}
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

                      {/* Second Row Fields */}
                      <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2" autoFocus>
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Rental Price
                          </label>
                          <input
                            type="text"
                            name="rental_price"
                            placeholder="Add Rent Price"
                            {...register("rental_price")}
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.rental_price?.message && (
                            <p className="format-message error">
                              {errors.rental_price.message}
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
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />

                          {errors?.purchase_price?.message && (
                            <p className="format-message error">
                              {errors.purchase_price.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Third Row fields */}
                      <div className="mt-2 mb-4.5 flex flex-col gap-2 md:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2">
                          <label
                            className="mb-2.5 block text-[#0284c7] dark:text-white"
                            htmlFor="condition"
                          >
                            Condition
                          </label>
                          <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                            <select
                              className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              name="condition"
                              {...register("condition")}
                            >
                              <option value={bookDetail?.book?.condition_id}>
                                {bookDetail?.book?.condition_name}
                              </option>
                              {conditionsData?.conditions?.map((condition) => (
                                <option key={condition.id} value={condition.id}>
                                  {condition?.name}
                                </option>
                              ))}
                            </select>
                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                              <svg
                                className="fill-current"
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
                        </div>
                        <div className="w-full xl:w-1/2">
                          <label
                            className="mb-2.5 block text-[#0284c7] dark:text-white"
                            htmlFor="cover"
                          >
                            Cover
                          </label>
                          <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                            <select
                              className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              name="cover"
                              {...register("cover")}
                            >
                              <option value={bookDetail?.book?.cover_id}>
                                {bookDetail?.book?.cover_name}
                              </option>

                              {coversData?.covers &&
                                coversData?.covers?.map((cover) => (
                                  <option key={cover?.id} value={cover?.id}>
                                    {cover?.name}
                                  </option>
                                ))}
                            </select>

                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                              <svg
                                className="fill-current"
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
                        </div>
                      </div>

                      {/* Fourth Row Fields */}
                      <div className="mt-2 mb-4.5 flex flex-col gap-2 md:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2">
                          <label
                            className="mb-2.5 block text-[#0284c7] dark:text-white"
                            htmlFor="category"
                          >
                            Category
                          </label>
                          <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                            <select
                              className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              name="category"
                              {...register("category")}
                            >
                              <option value={bookDetail?.book?.category_id}>
                                {bookDetail?.book?.category_name}
                              </option>
                              {categoriesData?.categories &&
                                categoriesData?.categories?.map((category) => (
                                  <option
                                    key={category?.id}
                                    value={category?.id}
                                  >
                                    {category?.name}
                                  </option>
                                ))}{" "}
                            </select>
                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                              <svg
                                className="fill-current"
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
                        </div>
                        <div className="mb-4.5 w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            ISBN <span className="text-meta-1">*</span>
                          </label>
                          <input
                            name="isbn"
                            type="text"
                            placeholder="Enter ISBN "
                            {...register("isbn")}
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.isbn?.message && (
                            <p className="format-message error">
                              {errors.isbn.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Fifth Row */}
                      <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Publisher
                          </label>

                          <Controller
                            control={control}
                            className="bg-white dark:bg-slate-800"
                            name="publisher"
                            render={({ field }) => (
                              <CreatableSelect
                                {...field}
                                options={publisherList}
                                isClearable
                                isDisabled={isLoading}
                                isLoading={isLoading}
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused
                                      ? "#3C50E0"
                                      : "#E2E8F0",
                                    padding: 5,
                                  }),
                                }}
                                onChange={(newValue, actionMeta) => {
                                  // Use actionMeta.action to check if the change is a creation
                                  if (actionMeta.action === "create-option") {
                                    onPublisherCreate(newValue.label); // Pass the label of the new option
                                  } else {
                                    field.onChange(newValue); // Regular option selected
                                  }
                                }}
                                value={field.value}
                              />
                            )}
                          />

                          {errors?.author?.message && (
                            <p className="format-message error">
                              {errors.author.message}
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
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />

                          {errors?.publish_year?.message && (
                            <p className="format-message error">
                              {errors.publish_year.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Sixth Row */}
                      <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2" autoFocus>
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Discount Percentage
                          </label>
                          <input
                            type="text"
                            name="discount_percentage"
                            placeholder="Add discount_percentage"
                            {...register("discount_percentage")}
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.discount_percentage?.message && (
                            <p className="format-message error">
                              {errors.discount_percentage.message}
                            </p>
                          )}
                        </div>

                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Credits
                          </label>
                          <input
                            type="text"
                            name="credit"
                            placeholder="Add Credits"
                            {...register("credit")}
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.credit?.message && (
                            <p className="format-message error">
                              {errors.credit.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Seventh Row */}
                      <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2" autoFocus>
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Vendor
                          </label>

                          <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                            <select
                              className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              name="vendor_id"
                              {...register("vendor_id")}
                              defaultValue={vendorsData?.vendors?.find(
                                (ven) => {
                                  if (ven.id == bookDetail?.book?.vendor_id)
                                    return ven.id;
                                }
                              )}
                            >
                              {vendorsData?.vendors &&
                                vendorsData?.vendors?.map((vendor) => (
                                  <option key={vendor?.id} value={vendor?.id}>
                                    {vendor?.name}
                                  </option>
                                ))}{" "}
                            </select>
                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                              <svg
                                className="fill-current"
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
                        </div>

                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Branch
                          </label>
                          <div className="relative z-20 bg-transparent dark:bg-[#1d2a39]">
                            <select
                              className="relative z-20 w-full appearance-none rounded-sm border border-[#E2E8F0] bg-transparent py-3 px-5 outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                              name="branch_id"
                              {...register("branch_id")}
                              defaultValue={branchesData?.branches?.find(
                                (branch) => {
                                  if (
                                    branch.name == bookDetail?.book?.branch_name
                                  )
                                    return branch.id;
                                }
                              )}
                            >
                              {branchesData?.branches &&
                                branchesData?.branches?.map((branch) => (
                                  <option key={branch?.id} value={branch?.id}>
                                    {branch?.name}
                                  </option>
                                ))}{" "}
                            </select>
                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                              <svg
                                className="fill-current"
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
                      <div className="mt-4 mb-4.5 flex flex-col gap-2 sm:flex-row md:gap:9">
                        <div className="w-full xl:w-1/2" autoFocus>
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Summary
                          </label>
                          <textarea
                            type="text"
                            name="summary"
                            rows={4}
                            placeholder="Add a summary"
                            {...register("summary")}
                            className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.summary?.message && (
                            <p className="format-message error">
                              {errors.summary.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full xl:w-1/2">
                          <label className="mb-2.5 block text-[#0284c7] dark:text-white">
                            Add Cover Images
                          </label>

                          {/* Display Previously Selected Images */}
                          <ul className="flex flex-wrap space-x-2 rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-1 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]">
                            {bookDetail?.book?.cover_img_url.map(
                              (image, index) => (
                                <li key={index}>
                                  <img
                                    src={image.secureURL}
                                    alt={`Cover Image ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                </li>
                              )
                            )}
                          </ul>
                          <input
                            type="file"
                            id="cover_img_url"
                            multiple
                            name="cover_img_url"
                            placeholder="Add Cover Images"
                            onChange={onUploadImages}
                            // {...register("cover_img_url")}
                            // className="w-full rounded-sm border-[1.5px] border-[#E2E8F0] bg-transparent py-3 px-5 font-medium outline-none transition focus:border-[#3C50E0] active:border-[#3C50E0] disabled:cursor-default disabled:bg-[#F5F7FD] dark:border-form-[#3d4d60] dark:bg-[#1d2a39] dark:focus:border-[#3C50E0]"
                          />
                          {errors?.cover_img_url?.message && (
                            <p className="format-message error">
                              {errors.cover_img_url.message}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Ninth Row */}
                      <div className="block">
                        <div className="mt-4 sm:mt-0">
                          <div className="mt-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                name="available"
                                {...register("available")}
                                className="rounded bg-gray-200 border-transparent h-4 w-4 p-5 ml-2 focus:border-transparent focus:bg-gray-200 text-gray-700 focus:ring-1 focus:ring-offset-2 focus:ring-gray-500"
                              />
                              <span className="ml-2">Available </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      {/* Form Submissions Buttons */}
                      <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-[#FFBA00] px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:w-auto"
                        >
                          {isSubmitting ? "Submitting" : "Submit"}
                        </button>
                        <button
                          disabled={isSubmitting}
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={close}
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
        {/* </div> */}
      </div>
    </>
  );
};

export default BookDetailsModal;
