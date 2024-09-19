import React from 'react';
import {ThemeProvider} from './src/utils/ThemeProvider'; // Adjust the path as needed
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingScreen from './src/screens/SettingScreen';
import i18n from './src/translation/index';
import {I18nextProvider} from 'react-i18next';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignupScreen"
              component={SignupScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DashboardScreen"
              component={DashboardScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SettingScreen"
              component={SettingScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default App;
