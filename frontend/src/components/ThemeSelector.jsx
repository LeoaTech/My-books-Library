import { THEME_PRESETS } from '../constants/themePresets';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../utils/baseAPIURL';
import { toast } from 'react-toastify';

const ThemeSelector = () => {
    const { themeConfig, setThemeConfig } = useTheme();

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

    return (
        <div className="flex items-center gap-3">
            {THEME_PRESETS?.map((preset) => (
                <div className='flex items-center gap-2' key={preset.id}>
                    <button
                        onClick={() => handleThemeChange(preset)}
                        className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${themeConfig?.preset === preset.id
                            ? 'border-gray-600 dark:border-white scale-110 ring-2 ring-offset-2 ring-primary'
                            : 'border-transparent'
                            }`}
                        style={{ backgroundColor: preset.colors.light.primary }}
                        title={preset.name}
                        aria-label={`Select ${preset.name} theme`}
                    />
                    <span>{preset.name}</span></div>
            ))}
        </div>
    );
};

export default ThemeSelector;
