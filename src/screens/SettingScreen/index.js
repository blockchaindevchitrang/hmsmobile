import React, {useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import {COLORS, Fonts} from '../../utils';
import SelectDropdown from 'react-native-select-dropdown';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogoutPopup} from '../../components/LogoutPopup';
import useOrientation from '../../components/OrientationComponent';
import {useSelector, useDispatch} from 'react-redux';
import {fetchRolePermission} from '../../redux/reducer';

const rangeArray = [
  '#5eead4',
  '#8dd3f5',
  '#65b6f6',
  '#65f69c',
  '#b5f58d',
  '#f4c4f6',
  '#f665bf',
  '#f66595',
  '#f57979',
  '#c68df5',
  '#f5cf8d',
  '#f5a38d',
];

export const SettingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const rolePermission = useSelector(state => state.rolePermission);
  console.log('Get Role Array Value', rolePermission.modules);
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const scrollY = useRef(new Animated.Value(0)).current;
  const {t, i18n} = useTranslation();
  // const {theme, toggleTheme, colorTheme} = useTheme();
  const {theme, setCustomHeaderColor, toggleTheme, colorTheme} = useTheme();
  const [selectedColor, setSelectedColor] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const menuList = [
    {
      id: 1,
      title: 'Dark Mode',
      onPress: '',
    },
    {
      id: 2,
      title: 'Color Theme',
      onPress: '',
    },
    {
      id: 3,
      title: 'Billings',
      onPress: 'BillingScreen',
    },
    {
      id: 4,
      title: 'Bed Management',
      onPress: 'BedScreen',
    },
    {
      id: 5,
      title: 'Blood Bank',
      onPress: 'BloodBankScreen',
    },
    {
      id: 6,
      title: 'Prescriptions',
      onPress: 'PrescriptionScreen',
    },
    {
      id: 7,
      title: 'Diagnosis',
      onPress: 'DiagnosisScreen',
    },
    {
      id: 8,
      title: 'Enquiries',
      onPress: 'EnquiriesScreen',
    },
    {
      id: 9,
      title: 'Finance',
      onPress: 'FinanceScreen',
    },
    {
      id: 10,
      title: 'Front Office',
      onPress: 'FrontOfficeScreen',
    },
    {
      id: 11,
      title: 'Front CMS',
      onPress: '',
    },
    {
      id: 12,
      title: 'Hospital Charges',
      onPress: 'HospitalChargesScreen',
    },
    {
      id: 13,
      title: 'IPD/OPD',
      onPress: 'IPDScreen',
    },
    {
      id: 14,
      title: 'Live Consultations',
      onPress: '',
    },
    {
      id: 15,
      title: 'Medicines',
      onPress: 'MedicineScreen',
    },
    {
      id: 16,
      title: 'Patients',
      onPress: 'PatientsScreen',
    },
    {
      id: 17,
      title: 'Vaccination',
      onPress: 'VaccinationScreen',
    },
    {
      id: 18,
      title: 'Documents',
      onPress: 'DocumentsScreen',
    },
    {
      id: 19,
      title: 'Inventory',
      onPress: 'InventoryScreen',
    },
    {
      id: 20,
      title: 'Pathology',
      onPress: 'PathologyScreen',
    },
    {
      id: 21,
      title: 'Reports',
      onPress: 'ReportsScreen',
    },
    {
      id: 22,
      title: 'Radiology',
      onPress: 'RadiologyScreen',
    },
    {
      id: 23,
      title: 'SMS/Mail',
      onPress: '',
    },
    {
      id: 24,
      title: 'Services',
      onPress: '',
    },
    {
      id: 25,
      title: 'Transactions',
      onPress: 'TransactionsScreen',
    },
  ];

  // const renderItem = ({ item, index }) => {
  //   const inputRange = [-1, 0, 150 * index, 150 * (index + 2)];

  //   const translateY = scrollY.interpolate({
  //     inputRange,
  //     outputRange: [50, 0, 0, -150], // items slide up as they come into view
  //   });

  //   const opacity = scrollY.interpolate({
  //     inputRange,
  //     outputRange: [0, 1, 1, 0], // items fade in as they come into view
  //   });

  //   return (
  // <Animated.View style={[styles.menuOption, { transform: [{ translateY }], opacity }]}>
  //   <TouchableOpacity
  //       onPress={() => navigation.navigate('BillingScreen')}
  //       style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
  //       <Text style={[styles.text, {color: theme.text}]}>{'Billings'}</Text>
  //     </TouchableOpacity>
  //     </Animated.View>
  //   );
  // };

  const onLogoutFun = async () => {
    try {
      AsyncStorage.setItem('accessToken', '');
      setModalVisible(false);
      navigation.navigate('LoginScreen');
      dispatch(fetchRolePermission(null));
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View style={styles.headerView}>
        <Header
          title={t('setting')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreIcon={true}
        />
      </View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}>
        <ScrollView
          contentContainerStyle={{paddingBottom: hp(12)}}
          showsVerticalScrollIndicator={false}>
          <View
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {colorTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Switch
              trackColor={{false: 'gray', true: 'red'}}
              ios_backgroundColor={'white'}
              thumbColor={'#fff'}
              onValueChange={toggleTheme}
              value={colorTheme === 'dark'}
            />
          </View>

          <View
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Color Theme'}
            </Text>
            <SelectDropdown
              data={rangeArray}
              onSelect={(selectedItem, index) => {
                setSelectedColor(selectedItem);
                setCustomHeaderColor(selectedItem);
                console.log('gert Value:::', selectedItem);
              }}
              // defaultValueByIndex={0}
              defaultValue={selectedColor}
              defaultButtonText={'Select Coin'}
              renderButton={(selectedItem, isOpen) => {
                return (
                  <View style={styles.dropdown2BtnStyle2}>
                    <View
                      style={[
                        styles.colorBox,
                        {backgroundColor: selectedItem || theme.headerColor},
                      ]}
                    />
                    <Text style={styles.dropdownItemTxtStyle}>
                      {selectedItem || theme.headerColor}
                    </Text>
                  </View>
                );
              }}
              // renderCustomizedRowChild={(item, index, isSelected) => {
              //   return (
              //     <View style={styles.dropdownView}>
              //       <View style={styles.colorBox} />
              //       <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              //     </View>
              //   );
              // }}
              showsVerticalScrollIndicator={false}
              renderItem={(item, index, isSelected) => {
                return (
                  <TouchableOpacity
                    style={styles.dropdownView}
                    onPress={() => setCustomHeaderColor(item)}>
                    <View style={[styles.colorBox, {backgroundColor: item}]} />
                    <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                  </TouchableOpacity>
                );
              }}
              // rowStyle={styles.dropdownView}
              // buttonStyle={styles.dropdown2BtnStyle2}
              // buttonTextStyle={styles.dropdown2BtnTxtStyle}
              dropdownIconPosition={'left'}
              dropdownStyle={styles.dropdown2DropdownStyle}
            />
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Update Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePasswordScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Change Password'}
            </Text>
          </TouchableOpacity>
          {rolePermission.modules.map((item, index) => {
            if (item == 'Billings') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('BillingScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Billings'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Bed Managements') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('BedScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Bed Management'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Blood Banks') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('BloodBankScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Blood Bank'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Prescriptions') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('PrescriptionScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Prescriptions'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Diagnosis') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DiagnosisScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Diagnosis'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Enquiries') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('EnquiriesScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Enquiries'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Finance') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('FinanceScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Finance'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Front Office') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('FrontOfficeScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Front Office'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Hospital Charges') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('HospitalChargesScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Hospital Charges'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'IPD/OPD') {
              return (
                isPortrait && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('IPDScreen')}
                    style={[
                      styles.menuOption,
                      {backgroundColor: theme.headerColor},
                    ]}>
                    <Text style={[styles.text, {color: theme.text}]}>
                      {'IPD/OPD'}
                    </Text>
                  </TouchableOpacity>
                )
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Live Consultations') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('LiveConsultationScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Live Consultations'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Medicines') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('MedicineScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Medicines'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Patients') {
              return (
                isPortrait && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('PatientsScreen')}
                    style={[
                      styles.menuOption,
                      {backgroundColor: theme.headerColor},
                    ]}>
                    <Text style={[styles.text, {color: theme.text}]}>
                      {'Patients'}
                    </Text>
                  </TouchableOpacity>
                )
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Vaccinations') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('VaccinationScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Vaccination'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Documents') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('DocumentsScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Documents'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Inventory') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('InventoryScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Inventory'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Pathology') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('PathologyScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Pathology'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Reports') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ReportsScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Reports'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Radiology') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('RadiologyScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Radiology'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'SMS/Mail') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('SMSScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'SMS/Mail'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Services') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ServiceScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Services'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
          {rolePermission.modules.map((item, index) => {
            if (item == 'Transactions') {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('TransactionsScreen')}
                  style={[
                    styles.menuOption,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.text, {color: theme.text}]}>
                    {'Transactions'}
                  </Text>
                </TouchableOpacity>
              );
            }
          })}

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.closeButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <LogoutPopup
        modelVisible={modalVisible}
        setModelVisible={setModalVisible}
        onPress={() => onLogoutFun()}
      />
    </View>
  );
};

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//   },
//   container: {
//     flex: 0.9,
//     alignItems: 'center',
//     padding: 20,
//   },
//   text: {
//     fontSize: hp(2.2),
//     fontFamily: Fonts.FONTS.PoppinsBold,
//     color: COLORS.black,
//   },
//   headerView: {
//     flex: 0.1,
//   },
//   settingView: {
//     width: '100%',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: hp(6.5),
//     borderWidth: 1,
//     flexDirection: 'row',
//     paddingHorizontal: wp(4),
//     borderRadius: wp(2),
//     marginBottom: 15,
//   },
//   menuOption: {
//     marginBottom: 15,
//     backgroundColor: '#ffd6a5',
//     borderRadius: 10,
//     width: '100%',
//     height: hp(6.5),
//     alignItems: 'center',
//     paddingHorizontal: wp(4),
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   closeButton: {
//     marginBottom: 10,
//     width: '100%',
//     height: hp(6.5),
//     backgroundColor: '#FF3B30',
//     borderRadius: 10,
//     alignItems: 'center',
//     paddingHorizontal: wp(4),
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   closeButtonText: {
//     fontSize: hp(2.2),
//     fontFamily: Fonts.FONTS.PoppinsBold,
//     color: COLORS.white,
//   },
//   dropdownItemTxtStyle: {
//     color: COLORS.black,
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     fontSize: hp(1.7),
//     marginLeft: wp(2),
//   },
//   dropdownView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     // paddingLeft: wp(1),
//     height: hp(4),
//     borderBottomWidth: 0,
//   },
//   dropdown2BtnStyle: {
//     width: wp(27),
//     height: hp(4),
//     backgroundColor: COLORS.white,
//     borderRadius: 4,
//     alignSelf: 'flex-end',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//     paddingLeft: 0,
//   },
//   dropdown2BtnStyle1: {
//     width: wp(23),
//     height: hp(4),
//     backgroundColor: COLORS.white,
//     borderRadius: 4,
//     alignSelf: 'flex-end',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//     paddingLeft: 0,
//   },
//   dropdown2BtnStyle2: {
//     width: wp(37),
//     height: hp(4),
//     backgroundColor: COLORS.white,
//     borderRadius: 4,
//     alignSelf: 'flex-end',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//     paddingLeft: 0,
//   },
//   dropdown2BtnTxtStyle: {
//     color: COLORS.black,
//     fontFamily: Fonts.FONTS.PoppinsRegular,
//     fontSize: hp(1.8),
//     textAlign: 'left',
//     paddingLeft: 0,
//   },
//   dropdown2DropdownStyle: {
//     backgroundColor: COLORS.lightPrimary,
//     borderRadius: 4,
//     maxHeight: hp(25),
//     // borderRadius: 12,
//   },
//   dropdown2RowTxtStyle: {
//     color: '#000',
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     fontSize: hp(1.8),
//     textAlign: 'left',
//     paddingLeft: wp(1),
//   },
// });

export default SettingScreen;
