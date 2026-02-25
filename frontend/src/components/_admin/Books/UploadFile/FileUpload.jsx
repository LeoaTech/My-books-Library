import { useRef, useState } from 'react';
import { BASE_URL } from '../../../../utils/baseAPIURL';
import axios from "axios";
import { RxCross1 } from 'react-icons/rx';
import { useQueryClient } from '@tanstack/react-query';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const UploadBookByFileHandler = ({ setUploadFileModal }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const fileInputRef = useRef(null);

    const queryClient = useQueryClient();
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setMessage('');
        setIsError(false);

        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
                setFile(null);
                setIsError(true);
                setMessage(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please select a smaller file.`);

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setIsError(true);

            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setMessage('Uploading...');
        setIsError(false);
        try {
            const response = await axios.post(`${BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true
            });
            setIsError(false);
            setMessage(response.data.message || 'File uploaded successfully!');
            setUploadFileModal(false);
            queryClient.invalidateQueries(["books"]);
        } catch (error) {
            setIsError(true);
            setMessage(error || 'Error uploading file.');
            // console.error('Error uploading file:', error);
            setFile(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-1">
            <div className="w-full max-w-md">
                <label
                    htmlFor="file-upload"
                    className="block text-sm font-medium text-text mb-2"
                >
                    Select CSV or Excel File to Import
                </label>
                <div className={`mt-1 flex justify-center px-2 pt-3 pb-2 border-2 ${isError ? 'border-red-300 bg-red-50' : 'border-gray-300'} border-dashed rounded-md`}>                    <div className="space-y-1 text-center">
                    <svg
                        className={`mx-auto h-12 w-12 ${isError ? 'text-red-400' : 'text-gray-400'}`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="flex text-sm text-text">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                            <span className='p-1'>Choose a file</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-text">CSV, XLS, or XLSX up to {MAX_FILE_SIZE_MB}MB</p>                    </div>
                </div>
            </div>
            {file && <div className="mt-4 text-sm text-gray-500">{file.name}</div>}
            <button
                onClick={handleFileUpload}
                className="mt-4 flex items-center border-2 border-border gap-2 bg-background text-text px-5 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200"
            >
                Upload
            </button>
            {message && <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
                {message}
            </p>}
        </div>
    );
};


const ImportFileModal = ({ setUploadFileModal }) => {
    return (
        <div className= "fixed inset-0 overflow-y-auto h-full w-full flex items-center justify-center bg-[#64748B] bg-opacity-75 transition-opacity z-50" >
            <div className="relative w-[90%]  max-w-md bg-surface border-border p-10 rounded-md shadow-lg">
                <div className="absolute top-4 right-4">
                    <RxCross1
                        style={{
                            height: 18,
                            width: 23,
                            cursor: "pointer",
                            color: "#FFF !IMPORTANT",
                            strokeWidth: 2,
                        }}
                        onClick={() => setUploadFileModal(false)}
                    />
                </div>

                <div className="flex flex-col bg-surface justify-between items-center gap-5">
                    <div className="rounded-sm p-3 bg-surface border-b border-border py-4 px-6.5">
                        <h3 className="font-bold text-text">
                            Import Books From a File
                        </h3>
                    </div>
                    <div className="max-h-[600px] px-12 w-full overflow-hidden overflow-y-auto text-text">
                        <UploadBookByFileHandler setUploadFileModal={setUploadFileModal} />
                    </div>
                </div>
            </div>
        </div >
    );
}
export default ImportFileModal;