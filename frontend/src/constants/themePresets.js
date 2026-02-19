export const THEME_PRESETS = [
    {
        name: 'Blue (Default)',
        id: 'blue',
        colors: {
            light: {
                primary: '#3b82f6',      //  buttons/links
                secondary: '#93c5fd',    //  secondary elements
                // background: '#eff6ff',   //  inputs/cards
                                background: '#a9cbf7ff',   //  inputs/cards

                surface: '#ffffff',      //  sidebar/header
                text: '#1e3a8a',        //  text (good contrast)
                border: '#bfdbfe',      //  border
                page: '#f0f9ff',        //  page background
            },
            dark: {
                primary: '#60a5fa',      //  accent
                secondary: '#1e40af',    //  Deep blue
                background: '#0c1e35',   //  sidebar
                surface: '#1e293b',      //  surface (header/cards)
                text: '#e0f2fe',        //  text color
                border: '#1e40af',      // border
                page: '#0a1628',        //  page background
            }
        }
    },
    {
        name: 'Green',
        id: 'green',
        colors: {
            light: {
                primary: '#10b981',      
                secondary: '#6ee7b7',    //  secondary elements
                background: '#ecfdf5',   //  inputs/cards
                surface: '#ffffff',      //  sidebar/header
                text: '#064e3b',        //  text (good contrast)
                border: '#a7f3d0',      //  border
                page: '#f0fdf4',        // Subtle green page background
            },
            dark: {
                primary: '#34d399',      
                secondary: '#065f46',    
                background: '#0a1f1a',   // sidebar 
                surface: '#14532d',      //  surface (header/cards)
                text: '#d1fae5',        //  text color
                border: '#166534',      //  border
                page: '#052e16',        //  page background
            }
        }
    },
    {
        name: 'Purple',
        id: 'purple',
        colors: {
            light: {
                primary: '#a855f7',      //  buttons/links
                secondary: '#d8b4fe',    //  secondary elements
                background: '#faf5ff',   //  inputs/cards
                surface: '#ffffff',      //  sidebar/header
                text: '#581c87',        //  text (good contrast)
                border: '#e9d5ff',      //  border
                page: '#fdf4ff',        //  page background
            },
            dark: {
                primary: '#c084fc',      //  accent
                secondary: '#7e22ce',    // 
                background: '#1a0a2e',   //  sidebar
                surface: '#3b0764',      //  surface (header/cards)
                text: '#f3e8ff',        //  text color
                border: '#6b21a8',      //  border
                page: '#2e1065',        //  page background
            }
        }
    },
    {
        name: 'Red',
        id: 'red',
        colors: {
            light: {
                primary: '#ef4444',      // buttons/links
                secondary: '#fca5a5',    //  secondary elements
                background: '#fef2f2',   //  inputs/cards
                surface: '#ffffff',      //  sidebar/header
                text: '#7f1d1d',        //  text (good contrast)
                border: '#fecaca',      //  border
                page: '#fff5f5',        //  page background
            },
            dark: {
                primary: '#f87171',      //  accent
                secondary: '#991b1b',    // 
                background: '#1a0a0a',   //  sidebar
                surface: '#450a0a',      //  surface (header/cards)
                text: '#fee2e2',        //  text color
                border: '#7f1d1d',      //  border
                page: '#2d0a0a',        //  page background
            }
        }
    }
];
