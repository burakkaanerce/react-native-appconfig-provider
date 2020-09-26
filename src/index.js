import React, {
  useState, useEffect, createContext
} from 'react';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  DarkMode, LightMode
} from './Theme';
import Styles from './Theme/styles';
import Dictionary from './Dictionary';

const AppConfigContext = createContext();

export default (props) => {
  const { lightMode: LightModeFromProps, darkMode: DarkModeFromProps, dictionary: DictionaryFromProps, styles: StylesFromProps } = props;

  const defaultLightMode = LightModeFromProps || LightMode;
  const defaultDarkMode = DarkModeFromProps || DarkMode;
  const defaultDictionary = DictionaryFromProps && DictionaryFromProps.length > 0 && DictionaryFromProps[0].words ? DictionaryFromProps : Dictionary;
  const defaultLang = defaultDictionary[0];
  const defaultStyles = StylesFromProps || Styles;

  const [theme, setTheme] = useState(defaultLightMode);
  const [mode, setMode] = useState(false);
  const [dictionary, setDictionary] = useState(defaultLang.words);
  const [dictionaryMode, setDictionaryMode] = useState(defaultLang.short);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let initialMode = 'LIGHT';
      let initialDictionaryMode = defaultLang.short;

      try {
        initialMode = await AsyncStorage.getItem('@lightmode') || 'LIGHT';
      } catch (e) {
        initialMode = 'LIGHT';
      }
      try {
        initialDictionaryMode = await AsyncStorage.getItem('@dictionarymode') || defaultLang.short;
      } catch (e) {
        initialDictionaryMode = defaultLang.short;
      }

      if (initialMode === 'LIGHT') {
        setTheme(defaultLightMode);
        setMode(false);
      } else {
        setTheme(defaultDarkMode);
        setMode(true);
      }
      const newDictionary = defaultDictionary.find((dict) => dict.short === initialDictionaryMode) || defaultDictionary[0]
      setDictionaryMode(initialDictionaryMode);
      setDictionary(newDictionary.words);
    };

    bootstrapAsync();
  }, []);

  const state = {
    dictionary,
    dictionaryMode,
    theme: {
      styles: StyleSheet.create(defaultStyles(theme)),
      ...theme
    },
    mode,
    updateTheme: (newTheme) => {
      setTheme(newTheme === 'DARK' ? DarkMode : LightMode);
      setMode(newTheme === 'DARK');
    },
    onToggleMode: () => {
      const lastMode = !!mode;
      setTheme(!lastMode ? DarkMode : LightMode);
      setMode(!lastMode);

      AsyncStorage.setItem('@lightmode', !lastMode ? 'dark' : 'light', (err) => {
        console.log('AppConfigContextProvider AsyncStorage @lightmode Error: ', err);
      });
    },
    updateDict: (newDict) => {
      const newDictionary = defaultDictionary.find((dict) => dict.short === newDict) || defaultDictionary[0]
      setDictionaryMode(newDict);
      setDictionary(newDictionary.words);

      AsyncStorage.setItem('@dictionarymode', newDict, (err) => {
        console.log('AppConfigContextProvider AsyncStorage @dictionarymode Error: ', err);
      });
    }
  };

  const {
    children
  } = props;
  return (
    <AppConfigContext.Provider
      value={state}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

export {
  AppConfigContext
};
