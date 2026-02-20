import { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../utils/baseAPIURL';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const [colorMode, setColorMode] = useState(() => {
        try {
            const item = window.localStorage.getItem('color-theme');
            if (!item) return 'light';
            try { return JSON.parse(item); } catch { return item; }
        } catch (error) {
            console.error('Error reading color-theme from localStorage:', error);
            return 'light';
        }
    });

    const [themeConfig, setThemeConfig] = useState(null);
    const [customThemes, setCustomThemes] = useState([]);

    // Persist colorMode and switch (dark) class
    useEffect(() => {
        try {
            window.localStorage.setItem('color-theme', JSON.stringify(colorMode));
            const element = window.document.documentElement;
            if (colorMode === 'dark') {
                element.classList.add('dark');
            } else {
                element.classList.remove('dark');
            }
        } catch (error) {
            console.error('Error persisting color-theme:', error);
        }
    }, [colorMode]);

    // Apply styles for higher specificity
    useEffect(() => {
        if (!themeConfig || !themeConfig.colors) return;

        const currentMode = colorMode === 'dark' ? 'dark' : 'light';
        const colors = themeConfig.colors[currentMode];

        // console.log('Applying theme:', { currentMode, colorMode, colors, themeConfig });

        if (colors) {
            const existingStyle = document.getElementById('dynamic-theme-style');
            if (existingStyle) {
                existingStyle.remove(); //remove existing theme style in index.css
            }

            // append new style element with high specificity
            const styleElement = document.createElement('style');
            styleElement.id = 'dynamic-theme-style';
            styleElement.textContent = `
                :root {
                    --color-primary: ${colors.primary} !important;
                    --color-secondary: ${colors.secondary} !important;
                    --color-background: ${colors.background} !important;
                    --color-surface: ${colors.surface} !important;
                    --color-text: ${colors.text} !important;
                    --color-border: ${colors.border} !important;
                    --color-page: ${colors.page} !important;
                    ${themeConfig.radius ? `--radius: ${themeConfig.radius} !important;` : ''}
                }
            `;
            document.head.appendChild(styleElement);
        }
    }, [themeConfig, colorMode]);


    // Fetch if any existing theme config exists in settings and also fetch custom themes
    useEffect(() => {
        const fetchThemes = async () => {
            let currentLibraryId = null;

            // Get library (entity) ID based on route (admin dashboard or subdomain)
            const pathSegments = window.location.pathname?.split('/')?.filter(Boolean);
            const isAdminRoute = pathSegments.includes('admin');
            const excludedRoutes = ['admin', 'signin', 'signup', 'auth', 'dashboard'];

            if (isAdminRoute) {
                try {
                    const authData = localStorage.getItem('user');
                    if (authData) {
                        const { entityId } = JSON.parse(authData);
                        if (entityId) {
                            currentLibraryId = entityId;
                        }
                    }
                } catch (error) {
                    console.error("error for user data:", error);
                }
            } else {
                let identifier = pathSegments?.length > 0 ? pathSegments[0] : null;
                if (identifier && !excludedRoutes.includes(identifier)) {
                    // For customer frontend, fetch library details to get its ID
                    try {
                        const response = await fetch(`${BASE_URL}/library/${identifier}`);
                        if (response.ok) {
                            const data = await response.json();
                            if (data?.id) {
                                currentLibraryId = data.id;
                            }
                            if (data?.theme_config) {
                                setThemeConfig(data.theme_config);
                            }
                        }
                    } catch (error) {
                        console.error("Public theme fetch error:", error);
                    }
                }
            }

            // fetch custom themes if a library ID is found
            if (currentLibraryId) {
                try {
                    const response = await fetch(`${BASE_URL}/colors/${currentLibraryId}`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const customThemesData = await response.json();
                        const formattedCustomThemes = customThemesData.map(ct => ({
                            name: ct.name,
                            id: `custom-${ct.id}`,
                            originalId: ct.id,
                            colors: ct.colors
                        }));
                        setCustomThemes(formattedCustomThemes);
                    }
                } catch (error) {
                    console.error("Error fetching custom themes:", error);
                }
            }
        };

        fetchThemes();
    }, []);

    return (
        <ThemeContext.Provider value={{ themeConfig, setThemeConfig, colorMode, setColorMode, customThemes, setCustomThemes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
