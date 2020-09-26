# React Native AppConfig Context Provider

This provider puts the application under one roof and prepares a suitable environment for both language and theme control.

## Installation

```bash
$ npm install --save react-native-appconfig-provider

$ yarn add react-native-appconfig-provider
```

## Usage

Use `AppConfigContextProvider` to wrap your app container:

```js
import React from 'react';
import AppConfigContextProvider from 'react-native-appconfig-provider';

export default () => (
  <AppConfigContextProvider
    /*  Default:
        {
          colors: {
            primary: '#333333',
            background: '#fff',
          }
        }
    */
    lightMode={Object}

    /*  Default:
        {
          colors: {
            primary: '#fff',
            background: '#333333',
          }
        }
    */
    darkMode={Object}
    
    /* Default:
      (theme) => (
        {
          textCenter: {
            color: theme.colors.primary,
            textAlign: 'center',
            textAlignVertical: 'center',
          },
        }
      )
    */
    styles={Function}

    /* Default:
      [
        {
          "name": "Türkçe",
          "short": "TR",
          "words": {
            "helloWorld": "Merhaba Dünya !"
          }
        },
        {
          "name": "English",
          "short": "EN",
          "words": {
            "helloWorld": "Hello World !"
          }
        }
      ]
    */
    dictionary={Array}
  >
    <YourApp />
  </AppConfigContextProvider>
);
```

And use `AppConfigContext` for each component, if you want to use theme and dictionary constant, or change theme and dictionary:

```js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AppConfigContext } from 'react-native-appconfig-provider';

export default (props) => {
  const { theme, dictionary, dictionaryMode, mode, onToggleMode, updateDict } = useContext(AppConfigContext);

  return (
    <View>
      <TouchableOpacity 
        onPress={() => {
          updateDict('EN');
        }}
      >
        <Text>
          ENGLISH
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => {
          updateDict('TR');
        }}
      >
        <Text>
          TURKISH
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={() => {
          onToggleMode();
        }}
      >
        <Text>
          DARK / LIGHT MODE
        </Text>
      </TouchableOpacity>
    </View>
  )
};
```