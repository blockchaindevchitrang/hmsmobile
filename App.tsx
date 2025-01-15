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
import setting from './src/images/more.png';
import people from './src/images/people.png';
import duplicate from './src/images/duplicate.png';
import patient from './src/images/patient.png';
import AppointmentScreen from './src/screens/AppointmentScreen';
import DoctorScreen from './src/screens/DoctorScreen';
import {useTheme} from './src/utils/ThemeProvider';
import {MenuProvider} from 'react-native-popup-menu';
import UsersScreen from './src/screens/UsersScreen';
import BillingScreen from './src/screens/BillingScreen';
import BedScreen from './src/screens/BedScreen';
import BloodBankScreen from './src/screens/BloodBankScreen';
import PrescriptionScreen from './src/screens/PrescriptionScreen';
import DiagnosisScreen from './src/screens/DiagnosisScreen';
import EnquiriesScreen from './src/screens/EnquiriesScreen';
import FinanceScreen from './src/screens/FinanceScreen';
import FrontOfficeScreen from './src/screens/FrontOfficeScreen';
import HospitalChargesScreen from './src/screens/HospitalChargesScreen';
import IPDScreen from './src/screens/IPDScreen';
import MedicineScreen from './src/screens/MedicineScreen';
import {PatientsScreen} from './src/screens/PatientsScreen';
import VaccinationScreen from './src/screens/VaccinationScreen';
import DocumentsScreen from './src/screens/DocumentsScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import PathologyScreen from './src/screens/PathologyScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import RadiologyScreen from './src/screens/RadiologyScreen';
import ServiceScreen from './src/screens/ServiceScreen';
import SMSScreen from './src/screens/SMSScreen';
import LiveConsultationScreen from './src/screens/LiveConsultationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import useOrientation from './src/components/OrientationComponent';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
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
                isPortrait ? styles.bottomView : styles.bottomView1,
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
                isPortrait ? styles.bottomView : styles.bottomView1,
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
                isPortrait ? styles.bottomView : styles.bottomView1,
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
        name="UsersScreen"
        component={UsersScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                isPortrait ? styles.bottomView : styles.bottomView1,
                {backgroundColor: focused ? COLORS.white : theme.headerColor},
              ]}>
              <Image style={styles.imageView1} source={people} />
            </View>
          ),
        }}
      />
      {!isPortrait && (
        <Tab.Screen
          name="IPDScreen"
          component={IPDScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View
                style={[
                  isPortrait ? styles.bottomView : styles.bottomView1,
                  {
                    backgroundColor: focused ? COLORS.white : theme.headerColor,
                  },
                ]}>
                <Image style={styles.imageView1} source={duplicate} />
              </View>
            ),
          }}
        />
      )}
      {!isPortrait && (
        <Tab.Screen
          name="PatientsScreen"
          component={PatientsScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View
                style={[
                  isPortrait ? styles.bottomView : styles.bottomView1,
                  {backgroundColor: focused ? COLORS.white : theme.headerColor},
                ]}>
                <Image style={styles.imageView1} source={patient} />
              </View>
            ),
          }}
        />
      )}
      <Tab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={[
                isPortrait ? styles.bottomView : styles.bottomView1,
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

function SettingStack() {
  return (
    <Stack.Navigator initialRouteName="SettingScreen">
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BillingScreen"
        component={BillingScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BedScreen"
        component={BedScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BloodBankScreen"
        component={BloodBankScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrescriptionScreen"
        component={PrescriptionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DiagnosisScreen"
        component={DiagnosisScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EnquiriesScreen"
        component={EnquiriesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FinanceScreen"
        component={FinanceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FrontOfficeScreen"
        component={FrontOfficeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HospitalChargesScreen"
        component={HospitalChargesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="IPDScreen"
        component={IPDScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MedicineScreen"
        component={MedicineScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PatientsScreen"
        component={PatientsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VaccinationScreen"
        component={VaccinationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DocumentsScreen"
        component={DocumentsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PathologyScreen"
        component={PathologyScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RadiologyScreen"
        component={RadiologyScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TransactionsScreen"
        component={TransactionsScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ServiceScreen"
        component={ServiceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SMSScreen"
        component={SMSScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LiveConsultationScreen"
        component={LiveConsultationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <MenuProvider>
      <Provider store={store}>
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
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                  options={{headerShown: false}}
                />
                {/* <Stack.Screen
                  name="SettingScreen"
                  component={SettingScreen}
                  options={{headerShown: false}}
                /> */}
              </Stack.Navigator>
              <FlashMessage position={'top'} />
            </NavigationContainer>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
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
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1.5),
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
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  imageView3: {
    width: wp(5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
});
