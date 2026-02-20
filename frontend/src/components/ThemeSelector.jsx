import { useState } from 'react';
import { THEME_PRESETS } from '../constants/themePresets';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../utils/baseAPIURL';
import { toast } from 'react-toastify';
import AddCustomThemeForm from './_admin/Settings/CustomColors/AddCustomThemeForm';
import { useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";

const ThemeSelector = () => {
    const { themeConfig, setThemeConfig, customThemes, setCustomThemes } = useTheme(); // Get custom themes from context
    const { auth } = useAuthContext();

    const [showAddForm, setShowAddForm] = useState(false);
    const [currentLibraryId, setCurrentLibraryId] = useState(auth?.entityId || null);
    // Edit color scheme data
    const [isEditing, setIsEditing] = useState(false);
    const [themeToEdit, setThemeToEdit] = useState(null);

    useEffect(() => {
        const fetchLibraryId = async () => {
            const pathSegments = window.location.pathname?.split('/')?.filter(Boolean);
            const isAdminRoute = pathSegments.includes('admin');
            const excludedRoutes = ['admin', 'signin', 'signup', 'auth', 'dashboard'];
            let id = null;

            if (isAdminRoute) {
                try {
                    const authData = localStorage.getItem('user');
                    if (authData) {
                        const { entityId } = JSON.parse(authData);
                        if (entityId) {
                            id = entityId;
                        }
                    }
                } catch (error) {
                    console.error("user data parse error:", error);
                }
            } else {
                let identifier = pathSegments?.length > 0 ? pathSegments[0] : null;
                if (identifier && !excludedRoutes.includes(identifier)) {
                    try {
                        const response = await fetch(`${BASE_URL}/library/${identifier}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data?.id) {
                                id = data.id;
                            }
                        }
                    } catch (error) {
                        console.error("Public library ID fetch error:", error);
                    }
                }
            }
            setCurrentLibraryId(id);
        };

        if (auth?.entityId) {
            setCurrentLibraryId(auth?.entityId)
        } else {
            fetchLibraryId();
        }
    }, [auth]);

    // Update selected color theme in settings
    const handleThemeChange = async (preset) => {
        const newConfig = {
            preset: preset.id,
            colors: preset.colors,
            radius: '0.5rem'
        };
        setThemeConfig(newConfig);

        // save selected color theme config to Backend
        try {
            const response = await fetch(`${BASE_URL}/settings/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    theme_config: newConfig
                })
            });

            if (!response.ok) throw new Error('Failed to save theme');
            toast.success(`Theme updated to ${preset.name}`);

        } catch (error) {
            console.error("Theme save error", error);
            toast.error("Failed to save theme preference");
        }
    };

    const handleNewThemeAdded = (newTheme) => {
        setCustomThemes(prevThemes => [...prevThemes, {
            name: newTheme.name,
            id: `custom-${newTheme.id}`, 
            originalId: newTheme.id,
            colors: newTheme.colors
        }]);
        setShowAddForm(false); 
        toast.success("Custom theme added successfully!");
    };


    const handleThemeUpdated = (updatedTheme) => {
        setCustomThemes(prevThemes => prevThemes.map(theme =>
            theme.originalId === updatedTheme.id
                ? { ...theme, name: updatedTheme.name, colors: updatedTheme.colors }
                : theme
        ));
        setShowAddForm(false);
        setIsEditing(false); 
        setThemeToEdit(null); 
        toast.success("Custom theme updated successfully!");
    };


    const handleEditTheme = (theme) => {
        setShowAddForm(true); // Open the form
        setIsEditing(true); // Set edit mode
        setThemeToEdit({
            ...theme,
            id: theme.originalId // Pass the original DB ID to the form
        });
    };

    // Close the Form
    const handleFormCancel = () => {
        setShowAddForm(false);
        setIsEditing(false);
        setThemeToEdit(null);
    };

    return (

        <div className="p-4 bg-surface rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-text">Select Theme</h3>

            {/* Pre-defined Presets */}
            <div className="mb-6">
                <h4 className="font-medium text-text mb-2">Predefined Themes</h4>
                <div className="flex flex-wrap gap-4">
                    {THEME_PRESETS?.map((preset) => (
                        <div className='flex flex-col items-center gap-2' key={preset.id}>
                            <button
                                onClick={() => handleThemeChange(preset)}
                                className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${themeConfig?.preset === preset.id
                                    ? 'border-blue-600 dark:border-blue-400 scale-110 ring-2 ring-offset-2 ring-blue-500'
                                    : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: preset.colors.light.primary }}
                                title={preset.name}
                                aria-label={`Select ${preset.name} theme`}
                            />
                            <span className="text-sm text-text mt-1">{preset.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newly added Custom Themes for the library */}
            {customThemes.length > 0 && (
                <div className="mt-6 mb-6">
                    <h4 className="font-medium text-xl text-text mb-3">Custom Themes</h4>
                    <div className="flex flex-wrap gap-4">
                        {customThemes?.map((preset) => (
                            <div className='relative flex flex-col items-center gap-2' key={preset.id}>
                                {/* Edit theme color */}
                                <div className="absolute -top-1 -right-1 flex gap-1 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditTheme(preset); }}
                                        className="p-1 bg-gray-200 dark:bg-gray-600 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                                        title={`Edit ${preset.name}`}
                                        aria-label={`Edit ${preset.name} theme`}
                                    >
                                        <svg className="h-3 w-3 text-gray-600 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    
                                </div>
                                <button
                                    onClick={() => handleThemeChange(preset)}
                                    className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${themeConfig?.preset === preset.id
                                        ? 'border-purple-600 dark:border-purple-400 scale-110 ring-2 ring-offset-2 ring-purple-500'
                                        : 'border-transparent'
                                        }`}
                                    style={{ backgroundColor: preset.colors.light.primary }}
                                    title={preset.name}
                                    aria-label={`Select ${preset.name} theme`}
                                />
                                <span className="text-sm text-primary mt-1">{preset.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Add Custom Theme Button and Form */}
            <div className="mt-6 border-t pt-4 borderborder">
                <button
                    onClick={() => {
                        if (showAddForm) {
                            handleFormCancel();
                        } else {
                            setShowAddForm(true);
                            setIsEditing(false);
                            setThemeToEdit(null);
                        }
                    }}
                    className="px-4 py-2 bg-background  text-text rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 "
                >
                    {showAddForm ? 'Cancel' : 'Add New Custom Theme'}
                </button>

                {showAddForm && currentLibraryId && (
                    <AddCustomThemeForm
                        libraryId={auth?.entityId || currentLibraryId}
                        isEditing={isEditing}
                        themeData={themeToEdit}
                        onThemeAdded={handleNewThemeAdded}
                        onThemeUpdated={handleThemeUpdated}
                        onCancel={handleFormCancel}
                    />
                )}
                {!currentLibraryId && showAddForm && (
                    <p className="text-red-500 mt-2">Cannot add themes without a valid library ID.</p>
                )}
            </div>
        </div>

    );
};

export default ThemeSelector;
