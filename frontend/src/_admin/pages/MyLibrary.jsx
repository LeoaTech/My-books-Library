import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { MdLibraryBooks, MdCloudUpload, MdDelete } from 'react-icons/md';
import { useAuthContext } from '../../hooks/useAuthContext';
import { BASE_URL } from '../../utils/baseAPIURL';
import { useFetchLibraryDetails } from '../../hooks/myLibrary/useFetchLibrary';

const librarySchema = z.object({
    name: z.string().min(1, 'Library Name is required'),
    subdomain: z.string().min(1, 'Subdomain is required').regex(/^[a-z0-9-]+$/, 'Subdomain must be lowercase alphanumeric (a-z, 0-9, -) without dots or extensions like .com'),
    type_of_books: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    description: z.string().optional(),
    hasMultipleBranches: z.boolean().optional(),
    deliverIntercity: z.boolean().optional(),
    library_logo: z.string().optional(),
});

const MyLibrary = () => {
    const { auth } = useAuthContext();
    const entityId = auth?.entityId;

    // Fetch Library Details by entity ID
    const { data: libraryDetails, isLoading, error, refetch } = useFetchLibraryDetails(entityId);

    const [logoPreview, setLogoPreview] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty, isSubmitting },
    } = useForm({
        resolver: zodResolver(librarySchema),
        defaultValues: {
            name: libraryDetails?.name || '',
            subdomain: libraryDetails?.subdomain || '',
            type_of_books: libraryDetails?.type_of_books || '',
            address: libraryDetails?.address || '',
            phone: libraryDetails?.phone || '',
            city: libraryDetails?.city || '',
            country: libraryDetails?.country || '',
            description: libraryDetails?.description || '',
            deliverIntercity: false,
            hasMultipleBranches: false,
            library_logo: ''
        },
    });

    useEffect(() => {
        if (libraryDetails) {
            reset({
                name: libraryDetails?.name || '',
                subdomain: libraryDetails?.subdomain || '',
                type_of_books: libraryDetails?.type_of_books || '',
                address: libraryDetails?.address || '',
                phone: libraryDetails?.phone || '',
                city: libraryDetails?.city || '',
                country: libraryDetails?.country || '',
                description: libraryDetails?.description || '',
                deliverIntercity: libraryDetails?.deliver_inter_city || false,
                hasMultipleBranches: libraryDetails?.multiple_branches || false,
                library_logo: libraryDetails?.library_logo?.secure_url || ''
            });
            setLogoPreview(libraryDetails?.library_logo?.secure_url || null);
        }

    }, [libraryDetails, reset]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                setValue('library_logo', reader.result, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        setLogoPreview(null);
        setValue('library_logo', '', { shouldDirty: true });
    };

    const onSubmit = async (data) => {
        if (!entityId) {
            toast.error("Library ID not found");
            return;
        }

        const toastId = toast.loading("Updating library details...");
        try {
            const response = await fetch(`${BASE_URL}/library/${entityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                toast.update(toastId, {
                    render: 'Library details updated successfully',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
                refetch();
            } else {
                throw new Error(result.message || 'Failed to update');
            }
        } catch (error) {
            console.error('Error updating library details:', error);
            toast.update(toastId, {
                render: error.message || 'Failed to update library details',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    if (!entityId) {
        return <div className="p-6">Loading or Library ID needed...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <MdLibraryBooks className="text-3xl text-primary" />
                <h1 className="text-2xl font-bold text-secondary dark:text-text">My Library</h1>
            </div>


            <div className="bg-surface shadow-md rounded-lg p-6 border border-border">



                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Library Logo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-2">
                            Library Logo
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 border-2 border-solid border-border rounded-lg flex items-center justify-center overflow-hidden bg-background">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <MdCloudUpload className="text-text/40 text-3xl" />
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20 transition-colors text-sm font-medium">
                                    Upload Logo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                                {logoPreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveLogo}
                                        className="flex items-center justify-center gap-1 text-red-500 text-sm hover:text-red-700"
                                    >
                                        <MdDelete /> Remove
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-text/60 mt-1">Max size: 5MB.</p>
                    </div>

                    {/* Library Name */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Library Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text ${errors.name ? 'border-red-500' : 'border-border'
                                }`}
                            placeholder="e.g. City Library"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Subdomain */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Subdomain <span className="text-red-600">*</span>
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                {...register('subdomain', { required: true })}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text ${errors.subdomain ? 'border-red-500' : 'border-border'
                                    }`}
                                placeholder="my-library"
                            />
                        </div>
                        {errors.subdomain && (
                            <p className="text-red-500 text-sm mt-1">{errors.subdomain.message}</p>
                        )}
                    </div>

                    {/* Type of Books */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Book Types
                        </label>
                        <select
                            {...register("type_of_books")}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"

                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select Book Type
                            </option>
                            <option value="Hardcover">Hard Cover</option>
                            <option value="Softcover">Soft Cover</option>
                            <option value="Both">Both</option>
                        </select>

                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Phone
                        </label>
                        <input
                            type="text"
                            {...register('phone')}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
                            placeholder="+1 234 567 890"
                        />
                    </div>

                    {/* City & Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                {...register('city')}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
                                placeholder="New York"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                {...register('country')}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
                                placeholder="USA"
                            />
                        </div>
                    </div>


                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Address
                        </label>
                        <textarea
                            {...register('address')}
                            rows="3"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
                            placeholder="123 Library St, Booktown"
                        ></textarea>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text mb-1">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows="4"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text"
                            placeholder="Enter a brief description of your library..."
                        ></textarea>
                    </div>

                    {/* Other details */}
                    <div className="flex flex-col  gap-6 mt-4">
                        <label className="flex items-center">
                            <input
                                {...register("deliverIntercity")}
                                type="checkbox"
                                className="mr-2 accent-primary"
                            />
                            <span className="text-text">Enable Inter-city Delivery</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                {...register("hasMultipleBranches")}
                                type="checkbox"
                                className="mr-2 accent-primary"
                            />
                            <span className="text-text">Has Multiple Branches</span>
                        </label>
                    </div>

                    {/* Save Form */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={!isDirty || isSubmitting}
                            className={`flex items-center border-2 border-border gap-2 bg-background text-text px-4 py-2 rounded-md 
                hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary 
                transition-colors duration-200  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyLibrary;
