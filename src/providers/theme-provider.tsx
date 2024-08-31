import { ReactNode, createContext, useEffect, useState } from 'react';

type DarkMode = 'light' | 'dark';

export const ThemeContext = createContext<{ theme: DarkMode; toggleTheme: () => void }>({
    theme: 'light',
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<DarkMode>('light');

    const toggleTheme = () => {
        const newTheme: DarkMode = theme == 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('lugo-studio-theme', newTheme);
        addDarkClass(newTheme);
    };

    const addDarkClass = (mode: DarkMode) => {
        if (mode == 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    useEffect(() => {
        const localTheme = localStorage.getItem('lugo-studio-theme');
        if (localTheme) {
            const mode: DarkMode = localTheme == 'dark' ? 'dark' : 'light';
            setTheme(mode);
            addDarkClass(mode);
        }
    }, []);

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
