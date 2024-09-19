import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const lightModeColors = {
  text: '#222',
  background: '#fff',
  buttonBackground: '#ddd',
  headerColor: '#31a8a6',
  lightColor: '#56f0ed',
  grayColor: '#c7c7c7',
};

const darkModeColors = {
  text: '#fff',
  background: '#222',
  buttonBackground: '#444',
  headerColor: '#31a8a6',
  lightColor: '#56f0ed',
  grayColor: '#c7c7c7',
};

// Create a context for the theme
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to wrap the entire app
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [colorTheme, setColorTheme] = useState(systemColorScheme);

  useEffect(() => {
    setColorTheme(systemColorScheme);
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setColorTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const theme = colorTheme === 'dark' ? darkModeColors : lightModeColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};