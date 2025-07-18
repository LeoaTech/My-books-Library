import React, { useRef } from 'react';
import {
    FaFileAlt,
    FaFileImage,
    FaFileVideo,
    FaFileAudio,
    FaFile,
    FaPlus,
    FaTrash,
    FaTimes,
} from 'react-icons/fa';

export default function FileUpload({ imagesList, setImagesList }) {
    const inputRef = useRef(null);

    const handleFileSelect = async (e) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files);

        // Filter to only add new files (non-duplicates)
        const existingNames = imagesList
            ?.filter((item) => item?.name) // only new File objects have .name
            ?.map((f) => f.name) || [];

        const uniqueNewFiles = newFiles.filter(
            (f) => !existingNames?.includes(f.name)
        );



        if (!uniqueNewFiles.length) return;

        const base64Files = await Promise.all(
            uniqueNewFiles.map(async (file) => {
                const base64 = await fileToBase64(file);
                return {
                    base64,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                };
            })
        );
        setImagesList((prev) => [...prev, ...base64Files]);

        if (inputRef.current) inputRef.current.value = '';
    };


    // Convert Raw File object to base64

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // data URL string
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        })
    const removeFile = (indexToRemove) => {
        setImagesList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const getFileName = (file) =>
        file instanceof File
            ? file.name
            : file.secure_url?.split('/')?.pop() || 'Uploaded Image';

    const getFileSize = (file) =>
        file instanceof File ? formatFileSize(file.size) : '';

    const getFilePreview = (file) => {

        if (file instanceof File && file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        } else if (file.secure_url && file.secure_url.match(/\.(jpeg|jpg|png|gif)/)) {
            return file.secure_url;
        }
        return null;
    };

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-[#2c3745] dark:text-white">Select Media</h2>
            <div className="flex gap-2">
                <FileInput inputRef={inputRef} onFileSelect={handleFileSelect} />
                <button
                    onClick={() => setImagesList([])}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    disabled={imagesList?.length === 0 || imagesList?.length == 5}
                >
                    <FaTrash size={16} />
                    Clear All
                </button>
            </div>

            {imagesList?.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-semibold">Selected Media:</h3>
                    {imagesList?.map((file, idx) => {
                        console.log(file, "File");

                        const icon = getFileIcon(
                            file?.type || (file?.secure_url && 'image/') || ''
                        );
                        const previewUrl = getFilePreview(file);

                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-gray-800 text-white p-3 rounded-md"
                            >
                                <div className="flex items-center gap-3">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                    ) : (
                                        React.createElement(icon, {
                                            size: 36,
                                            className: 'text-blue-400',
                                        })
                                    )}
                                    <div>
                                        <div className="font-medium">{getFileName(file)}</div>
                                        <div className="text-sm text-gray-400">
                                            {getFileSize(file)}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="text-white hover:text-red-400"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}



// Display Selected Files




function FileInput({ inputRef, onFileSelect }) {
    return (
        <>
            <input
                type="file"
                ref={inputRef}
                onChange={onFileSelect}
                multiple
                className="hidden"
                id="file-upload"
                accept="image/*,video/*,audio/*"
            />
            <label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white hover:opacity-90"
            >
                <FaPlus size={16} />
                Select Files
            </label>
        </>
    );
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return FaFileImage;
    if (mimeType.startsWith('video/')) return FaFileVideo;
    if (mimeType.startsWith('audio/')) return FaFileAudio;
    if (mimeType === 'application/pdf') return FaFileAlt;
    return FaFile;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}
