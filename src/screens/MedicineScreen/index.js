import React, {useState, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  Animated,
  Image,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import styles from './styles';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import BloodBanksList from '../../components/BloodComponent/BloodBanksList';
import BloodDonorList from '../../components/BloodComponent/BloodDonorList';
import BloodDonationList from '../../components/BloodComponent/BloodDonationList';
import BloodIssueList from '../../components/BloodComponent/BloodIssueList';
import MedicineCategoryList from '../../components/MedicineComponent/MedicineCategoryList';
import MedicinesBrandList from '../../components/MedicineComponent/MedicinesBrandList';
import MedicineList from '../../components/MedicineComponent/MedicineList';
import PurchaseMedicineList from '../../components/MedicineComponent/PurchaseMedicineList';
import UsedMedicineList from '../../components/MedicineComponent/UsedMedicineList';
import MedicineBillList from '../../components/MedicineComponent/MedicineBillList';

const allData = [
  {
    id: 1,
    name: 'Antiboitics',
    status: true,
  },
  {
    id: 2,
    name: 'Injections',
    status: true,
  },
  {
    id: 3,
    name: 'Dental',
    status: false,
  },
  {
    id: 4,
    name: 'Fever',
    status: true,
  },
  {
    id: 5,
    name: 'Syrup',
    status: true,
  },
];

const medicineBrandData = [
  {
    id: 1,
    name: 'Cheryl Mcclure',
    email: 'cheryl@dffg.com',
    phone: '9876543210',
  },
  {
    id: 2,
    name: 'Wallace Roberts',
    email: 'wallace@dffg.com',
    phone: 'NA',
  },
  {
    id: 3,
    name: 'Diamox',
    email: 'diamox@dffg.com',
    phone: '9876543210',
  },
  {
    id: 4,
    name: 'Alpha',
    email: 'alpha@dffg.com',
    phone: '9876543210',
  },
  {
    id: 5,
    name: 'Cipla Limited',
    email: 'cipla@dffg.com',
    phone: '9876543210',
  },
];

const MedicinesData = [
  {
    id: 1,
    medicines: 'xyz',
    brand: 'Cheryl Mcclure',
    available: '10',
    buy: '$10.00',
    sell: '$11.00',
  },
  {
    id: 2,
    medicines: 'mno',
    brand: 'Wallace Roberts',
    available: '80',
    buy: '$15.00',
    sell: '$16.00',
  },
  {
    id: 3,
    medicines: 'demo',
    brand: 'Diamox',
    available: '0',
    buy: '$10.00',
    sell: '$11.00',
  },
  {
    id: 4,
    medicines: 'xyz',
    brand: 'Cheryl Mcclure',
    available: '10',
    buy: '$10.00',
    sell: '$11.00',
  },
  {
    id: 5,
    medicines: 'text',
    brand: 'Alpha',
    available: '50',
    buy: '$50.00',
    sell: '$55.00',
  },
];

const PurchaseData = [
  {
    id: 1,
    number: 'N2JY0SK9',
    total: '$244.00',
    tax: '$0.00',
    status: 'Paid',
    payment: 'Cash',
  },
  {
    id: 2,
    number: 'N2JY0SK9',
    total: '$244.00',
    tax: '$0.00',
    status: 'Paid',
    payment: 'Cash',
  },
  {
    id: 3,
    number: 'N2JY0SK9',
    total: '$244.00',
    tax: '$0.00',
    status: 'Paid',
    payment: 'Cash',
  },
  {
    id: 4,
    number: 'N2JY0SK9',
    total: '$244.00',
    tax: '$0.00',
    status: 'Paid',
    payment: 'Cash',
  },
  {
    id: 5,
    number: 'N2JY0SK9',
    total: '$244.00',
    tax: '$0.00',
    status: 'Paid',
    payment: 'Cash',
  },
];

const BloodDonationData = [
  {
    id: 1,
    medicine: 'pracetemol',
    quantity: '10',
    usedAt: 'Medicine Bill',
    date: '22:02:00 2023-05-25',
  },
  {
    id: 2,
    medicine: 'Panadol',
    quantity: '80',
    usedAt: 'Prescription',
    date: '22:02:00 2023-05-25',
  },
  {
    id: 3,
    medicine: 'pracetemol',
    quantity: '0',
    usedAt: 'Medicine Bill',
    date: '22:02:00 2023-05-25',
  },
  {
    id: 4,
    medicine: 'Panadol',
    quantity: '50',
    usedAt: 'Prescription',
    date: '22:02:00 2023-05-25',
  },
  {
    id: 5,
    medicine: 'ziwa',
    quantity: '20',
    usedAt: 'Prescription',
    date: '22:02:00 2023-05-25',
  },
];

const BloodIssueData = [
  {
    id: 1,
    admission: 'EMP0000001',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1000',
    status: 'Paid',
  },
  {
    id: 2,
    admission: 'EMP0000002',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1,890.00',
    status: 'Paid',
  },
  {
    id: 3,
    admission: 'EMP0000003',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1,580.00',
    status: 'Paid',
  },
  {
    id: 4,
    admission: 'EMP0000004',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$630.00',
    status: 'Paid',
  },
  {
    id: 5,
    admission: 'EMP0000005',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1,890.00',
    status: 'Paid',
  },
];

export const MedicineScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Medicines Categories');

  const animations = useRef(
    [0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
  ).current;

  const toggleMenu = open => {
    const toValue = open ? 0 : 300; // For closing, move down
    const opacityValue = open ? 1 : 0; // For fading

    if (open) {
      // Start opening animations
      setOptionModalView(true); // Show modal first
      setTimeout(() => {
        Animated.stagger(
          150,
          animations.map((anim, index) =>
            Animated.parallel([
              Animated.timing(anim, {
                toValue,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(opacities[index], {
                toValue: opacityValue,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
          ),
        ).start();
      }, 100);
    } else {
      // Start closing animations
      Animated.stagger(
        140,
        animations.map((anim, index) =>
          Animated.parallel([
            Animated.timing(anim, {
              toValue,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacities[index], {
              toValue: opacityValue,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ),
      ).start(() => {
        setOptionModalView(false); // Hide modal after animations complete
      });
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('medicines')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Medicines Categories' ? (
          <MedicineCategoryList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={allData}
          />
        ) : selectedView == 'Medicines Brands' ? (
          <MedicinesBrandList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={medicineBrandData}
          />
        ) : selectedView == 'Medicines' ? (
          <MedicineList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={MedicinesData}
          />
        ) : selectedView == 'Purchase Medicine' ? (
          <PurchaseMedicineList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={PurchaseData}
          />
        ) : selectedView == 'Used Medicine' ? (
          <UsedMedicineList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={BloodDonationData}
          />
        ) : (
          selectedView == 'Medicine Bills' && (
            <MedicineBillList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={BloodIssueData}
            />
          )
        )}
      </View>
      <Modal
        visible={optionModalView}
        transparent={true}
        animationType="fade"
        onRequestClose={() => toggleMenu(false)}>
        {/* Background blur */}
        <BlurView
          style={styles.absolute}
          blurType="light" // You can use 'light', 'dark', or 'extraDark' for the blur effect.
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />

        <View style={styles.mainModalView}>
          <View style={styles.menuContainer}>
            {[
              'Logo',
              'Medicines Categories',
              'Medicines Brands',
              'Medicines',
              'Purchase Medicine',
              'Used Medicine',
              'Medicine Bills',
            ].map((option, index) => (
              <>
                {option == 'Logo' ? (
                  <Animated.View
                    key={index}
                    style={[
                      {
                        transform: [{translateY: animations[index]}],
                        opacity: opacities[index],
                        marginBottom: hp(1),
                      },
                    ]}>
                    <Image source={headerLogo} style={styles.headerLogoImage} />
                  </Animated.View>
                ) : (
                  <Animated.View
                    key={index}
                    style={[
                      styles.menuOption,
                      {
                        transform: [{translateY: animations[index]}],
                        opacity: opacities[index],
                        backgroundColor: theme.headerColor,
                      },
                    ]}>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        setSelectedView(option), toggleMenu(false);
                      }}>
                      <Text style={styles.menuItem}>{option}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleMenu(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MedicineScreen;
