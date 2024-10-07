import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
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
  const {t, i18n} = useTranslation();
  // const {theme, toggleTheme, colorTheme} = useTheme();
  const {theme, setCustomHeaderColor, toggleTheme, colorTheme} = useTheme();
  const [selectedColor, setSelectedColor] = useState('');

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View style={styles.headerView}>
        <Header
          title={t('setting')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
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
          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'Profile'}</Text>
          </TouchableOpacity>

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
            onPress={() => navigation.navigate('BillingScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'Billings'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('BedScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Bed Management'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('BloodBankScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Blood Bank'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PrescriptionScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Prescriptions'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('DiagnosisScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Diagnosis'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('EnquiriesScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Enquiries'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('FinanceScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'Finance'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('FrontOfficeScreen')}
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Front Office'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Front CMS'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Hospital Charges'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'IPD/OPD'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Live Consultations'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Medicines'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'Patients'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Vaccination'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Documents'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Inventory'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Pathology'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'Reports'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Radiology'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'SMS/Mail'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>{'Services'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuOption, {backgroundColor: theme.headerColor}]}>
            <Text style={[styles.text, {color: theme.text}]}>
              {'Transactions'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.closeButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
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
