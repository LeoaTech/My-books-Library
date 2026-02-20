import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../../utils/baseAPIURL';


const defaultColors = {
    primary: '#3b82f6',
    secondary: '#93c5fd',
    background: '#eff6ff',
    surface: '#ffffff',
    text: '#1e3a8a',
    border: '#bfdbfe',
    page: '#f0f9ff',
};

const defaultDarkColors = {
    primary: '#60a5fa',
    secondary: '#1e40af',
    background: '#0c1e35',
    surface: '#1e293b',
    text: '#e0f2fe',
    border: '#1e40af',
    page: '#0a1628',
};
   const colorKeys = [
        'primary', 'secondary', 'background', 'surface', 'text', 'border', 'page'
    ];
const AddCustomThemeForm = ({ libraryId, isEditing, themeData, onThemeAdded, onThemeUpdated, onCancel }) => {
    const [themeName, setThemeName] = useState('');
    const [lightModeColors, setLightModeColors] = useState(defaultColors);

    const [darkModeColors, setDarkModeColors] = useState({
        primary: '#60a5fa',
        secondary: '#1e40af',
        background: '#0c1e35',
        surface: '#1e293b',
        text: '#e0f2fe',
        border: '#1e40af',
        page: '#0a1628',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

 

    const handleColorChange = (mode, key, value) => {
        if (mode === 'light') {
            setLightModeColors(prev => ({ ...prev, [key]: value }));
        } else {
            setDarkModeColors(prev => ({ ...prev, [key]: value }));
        }
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[`${mode}.${key}`];
            return newErrors;
        });
    };

    useEffect(() => {
        if (isEditing && themeData) {
            setThemeName(themeData.name);
            setLightModeColors(themeData.colors.light);
            setDarkModeColors(themeData.colors.dark);
        } else {
            setThemeName('');
            setLightModeColors(defaultColors);
            setDarkModeColors(defaultDarkColors);
        }
        setErrors({}); 
    }, [isEditing, themeData]);



    const handleThemeNameChange = (e) => {
        setThemeName(e.target.value);
        setErrors(prev => {
            const newErrors = { ...prev };
            if (e.target.value.trim()) delete newErrors.themeName;
            return newErrors;
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!themeName.trim()) {
            newErrors.themeName = 'Theme name is required.';
        }

        ['light', 'dark'].forEach(mode => {
            const colors = mode === 'light' ? lightModeColors : darkModeColors;
            colorKeys.forEach(key => {
                if (!colors[key] || !colors[key].trim()) {
                    newErrors[`${mode}.${key}`] = `${key} color for ${mode} mode is required.`;
                } else if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colors[key])) {
                    newErrors[`${mode}.${key}`] = `Invalid hex color for ${key} in ${mode} mode.`;
                }
            });
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        setLoading(true);
        const newThemeData = {
            name: themeName.trim(),
            colors: {
                light: lightModeColors,
                dark: darkModeColors,
            },
        };

        try {
            const url = isEditing
                ? `${BASE_URL}/colors/${libraryId}/${themeData.id}`
                : `${BASE_URL}/colors/${libraryId}`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newThemeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} custom theme.`);
            }

            const result = await response.json();

            if (isEditing) {
                onThemeUpdated(result.scheme);
            } else {
                onThemeAdded(result.scheme);
            }

            setThemeName('');
            setLightModeColors(defaultColors);
            setDarkModeColors(defaultDarkColors);
            setErrors({});
        } catch (error) {
            console.error("Error saving custom theme:", error);
            toast.error(error.message || "Failed to add custom theme. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const ColorInput = ({ mode, colorKey, value, onChange, error }) => (
        <div className="mb-2">
            <label htmlFor={`${mode}-${colorKey}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {colorKey.replace(/([A-Z])/g, ' $1')} Color:
            </label>
            <div className="flex items-center gap-2 mt-1">
                <input
                    type="color"
                    id={`${mode}-${colorKey}-picker`}
                    value={value}
                    onChange={(e) => onChange(mode, colorKey, e.target.value)}
                    className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                    type="text"
                    id={`${mode}-${colorKey}`}
                    value={value}
                    onChange={(e) => onChange(mode, colorKey, e.target.value)}
                    className={`block w-full rounded-md shadow-sm border ${error ? 'border-red-500' : 'border-border'} bg-background text-text focus:ring-primary sm:text-sm p-2`}
                    placeholder={`#RRGGBB`}
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto my-auto">
                <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Custom Theme' : 'Add Custom Theme'}</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="md:col-span-2 mb-4">
                        <label htmlFor="themeName" className="block text-sm font-medium text-text">
                            Theme Name:
                        </label>
                        <input
                            type="text"
                            id="themeName"
                            value={themeName}
                            onChange={handleThemeNameChange}
                            className={`mt-1 block w-full rounded-md shadow-sm border ${errors.themeName ? 'border-red-500' : 'border-border'} focus:outline-none focus:ring-2 focus:ring-primary bg-background text-text sm:text-sm p-2`}
                            placeholder="e.g., Ocean Breeze, Dark Forest"
                        />
                        {errors.themeName && <p className="mt-1 text-xs text-red-600">{errors.themeName}</p>}
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Light Mode Colors</h4>
                        {colorKeys.map(key => (
                            <ColorInput
                                key={`light-${key}`}
                                mode="light"
                                colorKey={key}
                                value={lightModeColors[key]}
                                onChange={handleColorChange}
                                error={errors[`light.${key}`]}
                            />
                        ))}
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Dark Mode Colors</h4>
                        {colorKeys.map(key => (
                            <ColorInput
                                key={`dark-${key}`}
                                mode="dark"
                                colorKey={key}
                                value={darkModeColors[key]}
                                onChange={handleColorChange}
                                error={errors[`dark.${key}`]}
                            />
                        ))}
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-surface text-text hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : isEditing ? 'Update Theme' : 'Save Custom Theme'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomThemeForm;
