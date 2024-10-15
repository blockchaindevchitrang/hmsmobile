// import React, {createContext, useContext, useState, useEffect} from 'react';
// import {useColorScheme} from 'react-native';

// const lightModeColors = {
//   text: '#222',
//   background: '#fff',
//   buttonBackground: '#ddd',
//   headerColor: '#5eead4',
//   lightColor: '#ccfff0',
//   grayColor: '#c7c7c7',
//   purpleColor: '#d1b5f5',
// };

// const darkModeColors = {
//   text: '#fff',
//   background: '#222',
//   buttonBackground: '#444',
//   headerColor: '#5eead4',
//   lightColor: '#ccfff0',
//   grayColor: '#c7c7c7',
//   purpleColor: '#d1b5f5',
// };

// // Create a context for the theme
// const ThemeContext = createContext();

// // Custom hook to use the ThemeContext
// export const useTheme = () => useContext(ThemeContext);

// // ThemeProvider component to wrap the entire app
// export const ThemeProvider = ({children}) => {
//   const systemColorScheme = useColorScheme();
//   const [colorTheme, setColorTheme] = useState(systemColorScheme);

//   useEffect(() => {
//     setColorTheme(systemColorScheme);
//   }, [systemColorScheme]);

//   const toggleTheme = () => {
//     setColorTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
//   };

//   const theme = colorTheme === 'dark' ? darkModeColors : lightModeColors;

//   return (
//     <ThemeContext.Provider value={{theme, toggleTheme, colorTheme}}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightModeColors = {
  text: '#222',
  background: '#fff',
  buttonBackground: '#ddd',
  headerColor: '#5eead4', // Default header color
  lightColor: '#ccfff0',
  grayColor: '#c7c7c7',
  purpleColor: '#e8c9fa',
  lightRedColor: '#fad7d2',
  redColor: '#f95252',
  lightBlue: '#8dd3f5',
  lightGreen: '#56e756',
};

const darkModeColors = {
  text: '#fff',
  background: '#222',
  buttonBackground: '#444',
  headerColor: '#5eead4', // Default header color
  lightColor: '#ccfff0',
  grayColor: '#c7c7c7',
  purpleColor: '#e8c9fa',
  lightRedColor: '#fad7d2',
  redColor: '#f95252',
  lightBlue: '#8dd3f5',
  lightGreen: '#56e756',
};

// AsyncStorage keys
const THEME_KEY = 'appTheme';
const CUSTOM_COLORS_KEY = 'customColors';

// Create a context for the theme
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to wrap the entire app
export const ThemeProvider = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [colorTheme, setColorTheme] = useState(systemColorScheme);
  const [customColors, setCustomColors] = useState({});

  useEffect(() => {
    // Load theme and custom colors from AsyncStorage when the app starts
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        const savedCustomColors = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);

        if (savedTheme) {
          setColorTheme(savedTheme); // Set saved theme (light/dark)
        } else {
          setColorTheme(systemColorScheme); // Fallback to system theme if no saved theme
        }

        if (savedCustomColors) {
          setCustomColors(JSON.parse(savedCustomColors)); // Set saved custom colors
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, [systemColorScheme]);

  // Function to toggle between light and dark mode
  const toggleTheme = async () => {
    const newTheme = colorTheme === 'light' ? 'dark' : 'light';
    setColorTheme(newTheme);

    try {
      AsyncStorage.setItem(THEME_KEY, newTheme); // Save theme to AsyncStorage
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  // Function to set custom header color
  const setCustomHeaderColor = color => {
    console.log('Get Color Value>>>', color);
    const updatedColors = {...customColors, headerColor: color};
    setCustomColors(updatedColors);

    try {
      AsyncStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(updatedColors)); // Save custom colors to AsyncStorage
    } catch (error) {
      console.error('Failed to save custom colors', error);
    }
  };

  // Merge system theme with custom colors
  const theme = {
    ...(colorTheme === 'dark' ? darkModeColors : lightModeColors),
    ...customColors,
  };

  return (
    <ThemeContext.Provider
      value={{theme, toggleTheme, colorTheme, setCustomHeaderColor}}>
      {children}
    </ThemeContext.Provider>
  );
};
