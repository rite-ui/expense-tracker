import { createContext,useEffect,useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('expensio_theme');
    if (saved) return saved === 'dark' ? 'dark' : 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

 useEffect(() => {
    const root = document.documentElement;
    if (dark === 'dark') {
        root.classList.add('dark');
        localStorage.setItem('expensio_theme', 'dark');
    } else {
        root.classList.remove('dark');
        localStorage.setItem('expensio_theme', 'light');

    }
 }, [dark]);

    const toggleTheme = () => {
        setDark(prev => prev === 'dark' ? 'light' : 'dark');
    }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
