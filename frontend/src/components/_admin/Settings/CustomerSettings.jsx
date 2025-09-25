
import { useEffect } from 'react';
import { BASE_URL } from "../../../utils/baseAPIURL"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isDirty, z } from 'zod';
import { useFetchSettings } from '../../../hooks/settings/useFetchSettings';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';


const settingsSchema = z.object({
    settings: z.array(
        z.object({
            label: z.string(),
            dbKey: z.string(),
            value: z.union([
                z.boolean(),
                z.number().min(0, 'Value must be non-negative'),
            ]),
            type: z.enum(['toggle', 'number']),
            min: z.number().optional(),
            max: z.number().optional(),
        })
    ),
}).transform((data) => {
    const dbData = {};
    data.settings.forEach((setting) => {
        dbData[setting.dbKey] = setting.value;
    });
    return dbData;
});

// Initial settings
const dummySettings = [
    { label: 'Allow User to Select Booking Date', dbKey: 'allow_select_booking_date', value: true, type: 'toggle' },
    { label: 'Default Booking Date', dbKey: 'default_booking_duration', value: 14, type: 'number', min: 0 },
    { label: 'Allow to Purchase', dbKey: 'allow_purchase', value: true, type: 'toggle' },
    { label: 'Allow to Borrow', dbKey: 'allow_borrow', value: true, type: 'toggle' },
    { label: 'Fine for late returns', dbKey: 'late_returns_fine', value: 0, type: 'number', min: 0 },
    {
        label: 'Consecutive Renewal Returns Date',
        dbKey: 'consecutive_renewals',
        value: 0,
        type: 'number',
        min: 0,
        max: 5,
    },]
const CustomerSettings = () => {
    const { data: settings, isLoading } = useFetchSettings();

    const mergeSettings = (dbSettings) => {
        console.log('Step1: ', dbSettings);
        if (!dbSettings?.settings || dbSettings.settings.length === 0) {
            console.log('No settings found, using dummySettings');
            return dummySettings;
        }
        const dbSetting = dbSettings.settings[0]; // Single settings object
        console.log('Step2: ', dbSetting['default_booking_duration']);
        return dummySettings.map((defaultSetting) => ({
            ...defaultSetting,
            value: dbSetting[defaultSetting.dbKey] !== undefined
                ? dbSetting[defaultSetting.dbKey]
                : defaultSetting.value,
        }));
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues, reset
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            settings: dummySettings
        },
    });
    const queryClient = useQueryClient()


    useEffect(() => {
        if (!isLoading && settings) {
            const mergedSettings = mergeSettings(settings);
            console.log('Merged Settings: ', mergedSettings);
            reset({ settings: mergedSettings });
        }
    }, [settings, isLoading, reset]);
    console.log(settings, "Settings");

    //  Save or Update Settings
    const onSubmit = async (data) => {

        const toastId = toast.loading("Updating settings..")

        try {
            // console.log('Saving settings to database:', data);
            // Simulate API call
            const response = await fetch(`${BASE_URL}/settings/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(data),
            });


            console.log(response, "Response");

            const settings = await response.json();

            if (response.ok) {
                queryClient.invalidateQueries("settings")
                toast.update(toastId, {
                    render: 'Settings Updated successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000,
                });
            }

            // console.log(settings, "Data Settings");

        } catch (error) {
            console.error('Error saving settings:', error);
            toast.update(toastId, {
                render: `Error: ${error || "Failed to Update settings"}`,
                type: 'error',
                isLoading: false,
                autoClose: 1000,
            });
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="overflow-x-auto mt-5 shadow-md bg-slate-100 dark:border-[#2E3A47] dark:bg-[#24303F]">
                    <table className="min-w-full bg-white rounded-lg">
                        <thead className="bg-gray-800 text-white dark:bg-gray-300 dark:text-black">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Setting
                                </th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {getValues('settings').map((setting, index) => (
                                <tr
                                    className="hover:bg-blue-100 bg-slate-100 dark:border-[#2E3A47] dark:bg-[#24303F]"
                                    key={setting.label}
                                >
                                    <td className="py-2 px-4 dark:text-white">{setting.label}</td>
                                    <td className="py-2 px-4">
                                        {setting.type === 'toggle' ? (
                                            <label className="inline-flex relative items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    {...register(`settings.${index}.value`)}
                                                />
                                                <div
                                                    className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                          transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                          after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                          peer-checked:bg-blue-600"
                                                ></div>
                                            </label>
                                        ) : (
                                            <div>
                                                <input
                                                    type="number"
                                                    className={`px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:border-blue-500 ${errors.settings?.[index]?.value
                                                        ? 'border-red-500'
                                                        : ''
                                                        }`}
                                                    {...register(`settings.${index}.value`, {
                                                        valueAsNumber: true,
                                                    })}
                                                    min={setting.min}
                                                    max={setting.max}
                                                />
                                                {errors.settings?.[index]?.value && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.settings[index].value.message}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end items-end my-6 mr-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isDirty}
                            className={`flex items-center gap-2 bg-[#758aae] text-white px-4 py-2 rounded-md 
                hover:bg-[#80CAEE] focus:outline-none focus:ring-2 focus:ring-[#758aae] 
                transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            aria-label="save settings"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CustomerSettings;