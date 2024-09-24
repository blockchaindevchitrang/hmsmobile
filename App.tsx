import React from 'react';
import {ThemeProvider} from './src/utils/ThemeProvider'; // Adjust the path as needed
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingScreen from './src/screens/SettingScreen';
import i18n from './src/translation/index';
import {I18nextProvider} from 'react-i18next';
import SignupScreen from './src/screens/SignupScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import {hasNotch} from 'react-native-device-info';
import {COLORS, Fonts} from './src/utils';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from './src/components/Pixel';
import chart from './src/images/dashboards.png';
import bot from './src/images/health.png';
import robot1 from './src/images/appointment.png';
import letter from './src/images/bell.png';
import setting from './src/images/more.png';
import AppointmentScreen from './src/screens/AppointmentScreen';
import DoctorScreen from './src/screens/DoctorScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import {useTheme} from './src/utils/ThemeProvider';
import {MenuProvider} from 'react-native-popup-menu';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
  const {theme} = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="PricePrediction"
      // tabBar={TabBar}
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS == 'ios' ? hp(7.5) : hp(7.5),
          backgroundColor: theme.headerColor,
          borderColor: theme.headerColor,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: Platform.OS == 'ios' ? (hasNotch() ? hp(3.3) : 0) : 0,
          position: 'absolute',
          bottom: hp(1.5),
          left: wp(3),
          right: wp(3),
          borderRadius: hp(2),
          shadowColor: COLORS.black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 3,
        },
      }}>
      <Tab.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.bottomView,
                {backgroundColor: focused ? COLORS.white : theme.headerColor},
              ]}>
              <Image style={styles.imageView} source={chart} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AppointmentScreen"
        component={AppointmentScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.bottomView,
                {
                  backgroundColor: focused ? COLORS.white : theme.headerColor,
                },
              ]}>
              <Image style={styles.imageView2} source={robot1} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DoctorScreen"
        component={DoctorScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.bottomView,
                {
                  backgroundColor: focused ? COLORS.white : theme.headerColor,
                },
              ]}>
              <Image style={styles.imageView1} source={bot} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.bottomView,
                {backgroundColor: focused ? COLORS.white : theme.headerColor},
              ]}>
              <Image style={styles.imageView1} source={letter} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.bottomView,
                {backgroundColor: focused ? COLORS.white : theme.headerColor},
              ]}>
              <Image style={styles.imageView} source={setting} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <MenuProvider>
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
                name="TabStack"
                component={TabStack}
                options={{headerShown: false}}
              />
              {/* <Stack.Screen
                name="DashboardScreen"
                component={DashboardScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SettingScreen"
                component={SettingScreen}
                options={{headerShown: false}}
              /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </I18nextProvider>
      </ThemeProvider>
    </MenuProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  bottomView: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView1: {
    width: wp(12.5),
    height: wp(12.5),
    borderRadius: wp(12.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  AIRoundView: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageView: {
    width: wp(5.5),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  imageView1: {
    width: wp(6.5),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  imageView2: {
    width: wp(6.5),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  imageView3: {
    width: wp(5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
});
