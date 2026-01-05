import { useColorScheme } from "react-native";
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

// this approch is to have real-time change
const themes = {
  light: {
    mode: 'light',
    background: '#FAFBFC',
    textColor: '#003361',
    primaryLighBlue: '#00B8DF',//verify name
    accentColor: '#00B8DF',
    borderColor: '#EDECF4',
    darkGrey: '#939598',
    textFieldBG: '#FFFFFF',
    backgroundAccent: '#DFF7FD',
    textAccent: '#A22222'
  },
  dark: {
    mode: 'dark',
    background: '#00192F',//done
    textColor: '#E0E0E0',//done
    primaryLighBlue: '#00B8DF',
    accentColor: '#A22222',
    borderColor: '#C8C8C8',//done
    darkGrey: '#939598', //done
    textFieldBG: '#00203B',//done
    backgroundAccent:'#511e29',
    textAccent: '#E0E0E0'
  },
};

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme || 'light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        setTheme(colorScheme || 'light');
      }
    };
    loadTheme();
  }, [colorScheme]);

   const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
