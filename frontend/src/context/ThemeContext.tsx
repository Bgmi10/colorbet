import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {}
});

export default function ThemeProvider ({ children }: { children: any }){

    const [theme, setTheme] = useState(() => {
        const data = localStorage.getItem('theme');
        return data ? data : 'dark'
    });

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    }

    useEffect(() => {
        if(theme === "dark"){
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark')
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light')
        }
    },[theme]);

    return (
        <>
        
          <ThemeContext.Provider
          value={{theme, toggleTheme}} >
            {children}
          </ThemeContext.Provider>
        </>
    )
} 