import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import BranchTable from './BranchTable';
import BranchForm from './BranchForm';
import { useBranchActions, useFetchBranches } from '../../../../../hooks/books/useFetchBranches';


function BranchManager() {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false)
    const [value, setValue] = useState(null)
    const queryClient = useQueryClient();

    const { data: branchesData, isLoading } = useFetchBranches();

    const { addBranch, updateBranch, deleteBranch, message, error } = useBranchActions();
    const createMutation = useMutation({
        mutationFn: addBranch,
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
            setShowForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateBranch,
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
            setShowForm(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBranch,
        onSuccess: () => {
            queryClient.invalidateQueries(['branches']);
            setDeleteModal(false);
            setValue(null)
        },

    });

    const handleCreate = () => {
        setEditData(null);
        setShowForm(true);
    };

    const handleEdit = (branch) => {
        const editedBranch = branchesData?.branches?.find((aut) => aut.id == branch);
        setEditData(editedBranch);
        setShowForm(true);
    };

    const handleView = (branch) => {
        const viewBranch = branchesData?.branches?.find((aut) => aut.id == branch);

        setViewData(viewBranch);
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

    const deleteBranchData = (data) => {
        deleteMutation.mutate(data);
    }

    if (isLoading) return <div className="text-center">Loading...</div>;

    return (
        <div>
            <div className="mb-4 flex justify-end items-center">
                <button
                    onClick={handleCreate}
                    className=" bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                    type="button"
                >
                    Create New Branch
                </button>
            </div>

            {(!branchesData || branchesData?.branches?.length === 0) ? (
                <div className="text-center text-gray-500">
                    No data available. Please add new data.
                </div>
            ) : (
                <BranchTable
                    data={branchesData?.branches}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showForm && (
                <div className="fixed inset-0 lg:left-[18rem] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-6 rounded shadow-lg">

                        <BranchForm
                            initialData={editData}
                            saveBranch={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Delete Branch */}
            {deleteModal && (
                <div className="fixed inset-0 lg:left-[18rem] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-6 rounded shadow-lg">



                        <div className=" md:mx-20">
                            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                                    Delete Branch
                                </h3>
                            </div>
                            <p>
                                Are you sure you want to delete this branch?

                            </p>
                            <div className='flex justify-between gap-4'>
                                <button
                                    onClick={() => deleteBranchData(value)}
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
                <div className="fixed inset-0 lg:left-[18rem] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-6 rounded shadow-lg">

                        <div className=" md:mx-20">
                            {/* Form Heading */}
                            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                                    View Branch
                                </h3>
                            </div>
                            <div className='p-2 border bg-slate-100 rounded-md shadow-sm'>
                                <p
                                    className='py-4 px-2'
                                ><strong className='text-gray-700 dark:text-neutral-400 px-2'>Name:</strong> {viewData.name}</p>
                                <p className='py-4 px-2'><strong className='text-gray-700 dark:text-neutral-400 px-2'>Address:</strong> {viewData.address}</p>
                                <p className='py-4 px-2'><strong className='text-gray-700 dark:text-neutral-400 px-2'>City:</strong> {viewData.city}</p>
                                <p className='py-4 px-2'><strong className='text-gray-700 dark:text-neutral-400 px-2'>Country:</strong> {viewData.country}</p>
                                <p className='py-4 px-2'><strong className='text-gray-700 dark:text-neutral-400 px-2'>Phone:</strong> {viewData.phone}</p>


                            </div>
                            <div className='flex justify-between gap-4'>
                                <button
                                    onClick={() => setViewData(null)}
                                    className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
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

export default BranchManager;