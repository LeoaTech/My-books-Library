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



    // Fetch Theme (color) for a Library
    useEffect(() => {
        const fetchTheme = async () => {
            // 1. get subdomain from URL
            const pathSegments = window.location.pathname?.split('/')?.filter(Boolean);
            let identifier = pathSegments?.length > 0 ? pathSegments[0] : null;
            const excludedRoutes = ['admin', 'signin', 'signup', 'auth', 'dashboard'];

            // for admin route
            const isAdminRoute = pathSegments.includes('admin');

            if (isAdminRoute) {
                // For admin dashboard, get color theme for current library Id
                try {
                    const authData = localStorage.getItem('user');
                    if (authData) {
                        const { entityId } = JSON.parse(authData);
                        if (entityId) {
                            const response = await fetch(`${BASE_URL}/library/${entityId}`, {
                                credentials: 'include'
                            });
                            if (response.ok) {
                                const data = await response.json();
                                if (data?.theme_config) {
                                    setThemeConfig(data.theme_config);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Admin theme fetch error:", error);
                }
            } else if (identifier && !excludedRoutes.includes(identifier)) {
                // For library customer-frontend pages, get theme by its subdomain ID
                try {
                    const response = await fetch(`${BASE_URL}/library/${identifier}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data?.theme_config) {
                            setThemeConfig(data.theme_config);
                        }
                    }
                } catch (error) {
                    console.error("Theme fetch error:", error);
                }
            }
        };

        fetchTheme();
    }, []);


    return (
        <ThemeContext.Provider value={{ themeConfig, setThemeConfig, colorMode, setColorMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
