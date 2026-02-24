import { lazy, Suspense, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
const AuthorsTable = lazy(() => import('./AuthorsTable'));
const AuthorsForm = lazy(() => import('./AuthorsForm'));
import { useFetchAuthors } from '../../../../../hooks/books/useFetchAuthors';
import { useAuthor } from "../../../../../hooks/books/useSaveAuthor";
import SkeletonTable from '../../../../Loader/SkeletonTable';
import SkeletonModal from '../../../../Loader/SkeletonModal';
import { RxCross1 } from 'react-icons/rx';


function AuthorManager() {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false)
    const [value, setValue] = useState(null)
    const queryClient = useQueryClient();

    const { data: authorsData, isLoading } = useFetchAuthors();

    const { addAuthor, updateAuthor, deleteAuthor } = useAuthor();
    const createMutation = useMutation({
        mutationFn: addAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries(['authors']);
            setShowForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries(['authors']);
            setShowForm(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries(['authors']);
            setDeleteModal(false);
            setValue(null)
        },
    });

    const handleCreate = () => {
        setEditData(null);
        setShowForm(true);
    };

    const handleEdit = (author) => {
        const editedAuthor = authorsData?.authors?.find((aut) => aut.id == author);
        setEditData(editedAuthor);
        setShowForm(true);
    };

    const handleView = (author) => {
        const viewAuthor = authorsData?.authors?.find((aut) => aut.id == author);

        setViewData(viewAuthor);
    };

    const handleDelete = (id) => {
        setDeleteModal(true);
        setValue(id)
    };

    const handleSubmit = (data) => {
        if (editData) {
            updateMutation.mutate({ ...data, id: editData.id });
        } else {
            createMutation.mutate(data);
        }
    };

    const deleteAuthorData = (data) => {


        deleteMutation.mutate(data);
    }

    if (isLoading) return <div className="text-center">Loading...</div>;

    return (
        <div>
            <div className="mb-4 flex justify-end items-center">
                <button
                    onClick={handleCreate}
                    className="rounded-md border-border gap-2 bg-background text-text px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-50  hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    type="button"
                >
                    Create New Author
                </button>
            </div>

            {(!authorsData || authorsData?.authors?.length === 0) ? (
                <div className="text-center text-gray-500">
                    No data available. Please add new data.
                </div>
            ) : (
                <Suspense fallback={<SkeletonTable columns={4} rows={2} />}>
                    <AuthorsTable
                        data={authorsData?.authors}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Suspense>
            )}

            {showForm && (
                <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-[#64748B] bg-opacity-75 transition-opacity z-50">
                    <div className="bg-surface p-6 shadow-lg  rounded-md w-full mx-auto my-auto max-w-2xl">
                        <Suspense fallback={<SkeletonModal />}>
                            <AuthorsForm
                                initialData={editData}
                                saveAuthor={handleSubmit}
                                onCancel={() => setShowForm(false)}
                            /></Suspense>
                    </div>
                </div>
            )}

            {/* Delete Author */}
            {deleteModal && (
                <div className="fixed inset-0 lg:left-[18rem] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-6 rounded shadow-lg">

                        <div className="flex justify-end items-end ">
                            <RxCross1
                                style={{
                                    height: 18,
                                    width: 23,
                                    cursor: "pointer",
                                    color: "var(--color-text)",
                                    strokeWidth: 2,
                                }}
                                onClick={() => setShowForm(false)}
                            />
                        </div>

                        <div className=" md:mx-20">
                            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                                    Delete Author
                                </h3>
                            </div>
                            <p>
                                Are you sure you want to delete this author?

                            </p>
                            <div className='flex justify-between gap-4'>
                                <button
                                    onClick={() => deleteAuthorData(value)}
                                    className="mt-4  bg-red-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteModal(null)}
                                    className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {viewData && (
                <div className="fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-[#64748B] bg-opacity-75 transition-opacity z-50">
                    <div className="bg-surface p-6 shadow-lg  rounded-md w-full mx-auto my-auto max-w-2xl">
                        <div className="flex justify-end items-end ">
                            <RxCross1
                                style={{
                                    height: 18,
                                    width: 23,
                                    cursor: "pointer",
                                    color: "var(--color-text)",
                                    strokeWidth: 2,
                                }}
                                onClick={() => setViewData(false)}
                            />
                        </div>
                        <div className=" md:mx-20">
                            {/* Form Heading */}
                            <div className="rounded-sm p-3 mb-8 bg-surface border-b border-border py-4 px-6.5 ">
                                <h3 className="font-bold text-text ">
                                    View Author
                                </h3>
                            </div>
                            <div className='p-2 border bg-background rounded-md shadow-sm'>
                                <p
                                    className='py-4 px-2'
                                ><strong className='text-text px-2'>Name:</strong> {viewData.name}</p>
                                <p className='py-4 px-2'><strong className='text-text px-2'>Links:</strong> {viewData.links}</p>
                                <p className='py-4 px-2'><strong className='text-text px-2'>Description:</strong> {viewData.description}</p>


                            </div>
                            <div className='flex justify-between gap-4'>
                                <button
                                    onClick={() => setViewData(null)}
                                    className="mt-4 bg-white text-text py-2 px-4 rounded hover:bg-background"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AuthorManager;