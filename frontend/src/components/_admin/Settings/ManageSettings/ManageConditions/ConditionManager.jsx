import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConditionTable from './ConditionTable';
import ConditionForm from './ConditionsForm';
import {useFetchConditions, useConditionActions} from "../../../../../hooks/books/useFetchConditions"

function ConditionManager() {
    const [showForm, setShowForm] = useState(false);
    const [editData, setEditData] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false)
    const [value, setValue] = useState(null)
    const queryClient = useQueryClient();

    const {
        isPending: isPendingConditions,
        data: conditionData,
    } = useFetchConditions();

    const { addConditionType, updateCondition, deleteCondition } = useConditionActions();


    const createMutation = useMutation({
        mutationFn: addConditionType,
        onSuccess: () => {
            queryClient.invalidateQueries(['conditions']);
            setShowForm(false);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateCondition,
        onSuccess: () => {
            queryClient.invalidateQueries(['conditions']);
            setShowForm(false);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCondition,
        onSuccess: () => {
            queryClient.invalidateQueries(['conditions']);
            setDeleteModal(false);
            setValue(null)
        },
    });

    const handleCreate = () => {
        setEditData(null);
        setShowForm(true);
    };

    const handleEdit = (condition) => {
        const editedData = conditionData?.conditions?.find((cat) => cat.id == condition);
        setEditData(editedData);
        setShowForm(true);
    };

    const handleView = (condition) => {
        const viewCondition = conditionData?.conditions?.find((cat) => cat.id == condition);
        setViewData(viewCondition);
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

    const deleteConditionData = (data) => {
        deleteMutation.mutate(data);
    }

    if (isPendingConditions) return <div className="text-center">Loading...</div>;

    return (
        <div>
            <div className="mb-4 flex justify-end items-center">
                <button
                    onClick={handleCreate}
                    className=" bg-[#758aae] text-white active:bg-[#80CAEE] 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3 "
                    type="button"
                >
                    New Condition
                </button>
            </div>

            {(!conditionData || conditionData?.conditions?.length === 0) ? (
                <div className="text-center text-gray-500">
                    No data available. Please add new data.
                </div>
            ) : (
                <ConditionTable
                    data={conditionData?.conditions}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showForm && (
                <div className="fixed inset-0 lg:left-[18rem] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-6 rounded shadow-lg">

                        <ConditionForm
                            initialData={editData}
                            saveCondition={handleSubmit}
                            onCancel={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Delete Condition */}
            {deleteModal && (
                <div className="fixed inset-0 lg:left-[18rem] bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-neutral-50 dark:border-[#2E3A47] dark:bg-[#24303F] p-6 rounded shadow-lg">



                        <div className=" md:mx-20">
                            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                                    Delete Condition
                                </h3>
                            </div>
                            <p>
                                Are you sure you want to remove this condition?

                            </p>
                            <div className='flex justify-between gap-4'>
                                <button
                                    onClick={() => deleteConditionData(value)}
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
                            <div className="rounded-sm p-3 mb-8 bg-slate-100 border-b border-[#E2E8F0] py-4 px-6.5 dark:border-[#2E3A47]  dark:bg-[#2c3745]">
                                <h3 className="font-bold text-[#313D4A] dark:text-white ">
                                    View Condition
                                </h3>
                            </div>
                            <div className='p-2 border bg-slate-100 rounded-md shadow-sm'>
                                <p
                                    className='py-4 px-2'
                                ><strong className='text-gray-700 dark:text-neutral-400 px-2'>Name:</strong> {viewData.name}</p>

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

export default ConditionManager;