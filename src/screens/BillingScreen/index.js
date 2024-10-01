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
import {COLORS} from '../../utils';
import headerLogo from '../../images/headerLogo.png';
import UserList from '../../components/UsersComponent/UserList';
import AccountantList from '../../components/UsersComponent/AccountantList';
import NursesList from '../../components/UsersComponent/NursesList';
import {BlurView} from '@react-native-community/blur';
import ReceptionistsList from '../../components/UsersComponent/ReceptionistsList';
import LabTechniciansList from '../../components/UsersComponent/LabTechniciansList';
import PharmacistsList from '../../components/UsersComponent/PharmacistsList';
import AccountList from '../../components/BillingComponent/AccountList';
import PayrollList from '../../components/BillingComponent/PayrollList';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    type: 'Credit',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    type: 'Debit',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    type: 'Debit',
    status: false,
  },
  {
    id: 4,
    name: 'Monica Geller',
    type: 'Credit',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    type: 'Debit',
    status: true,
  },
];

const accountantData = [
  {
    id: 1,
    srNo: 2,
    payroll: 'N2JY0SK7',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    month: 'Aug',
    year: 2023,
    salary: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 2,
    srNo: 4,
    payroll: 'N2JY0SK5',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 3,
    srNo: 5,
    payroll: 'N2JY0SK0',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 4,
    srNo: 8,
    payroll: 'N2JY0SL3',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Unpaid',
  },
  {
    id: 5,
    srNo: 9,
    payroll: 'N2JY0SK8',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Paid',
  },
];

const NurseData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    status: true,
    qualification: 'mca',
    bod: 'N/A',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    qualification: 'bsc',
    bod: 'N/A',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: 'NA',
    status: false,
    qualification: 'mca',
    bod: '8th April, 1999',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    qualification: 'bsc',
    bod: '10th May, 1998',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    status: false,
    qualification: 'msc',
    bod: 'N/A',
  },
];

const ReceptionistsData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    status: true,
    designation: 'Jr',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    designation: 'Doctor',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: 'NA',
    status: false,
    designation: 'Receptionist',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    designation: 'N/A',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    status: false,
    designation: 'Lab Technician',
  },
];

const LabTechniciansData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    status: true,
    designation: 'Lab',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    designation: 'Moderator',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    designation: 'N/A',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    designation: 'N/A',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    designation: 'Lab',
  },
];

const PharmacistsData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    status: true,
    blood: 'N/A',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    blood: 'O+',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    blood: 'N/A',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    blood: 'AB-',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    blood: 'A+',
  },
];

export const BillingScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);

  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchBreak, setSearchBreak] = useState('');
  const [searchNurse, setSearchNurse] = useState('');
  const [searchReceptionist, setSearchReceptionist] = useState('');
  const [searchLabTechnician, setSearchLabTechnician] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Accounts');

  const animations = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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
          title={t('billing')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Accounts' ? (
          <AccountList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={allData}
          />
        ) : selectedView == 'Employee Payrolls' ? (
          <PayrollList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={accountantData}
          />
        ) : selectedView == 'Invoices' ? (
          <AccountantList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={accountantData}
          />
        ) : selectedView == 'Payments' ? (
          <NursesList
            searchBreak={searchNurse}
            setSearchBreak={setSearchNurse}
            allData={NurseData}
          />
        ) : selectedView == 'Payment Reports' ? (
          <ReceptionistsList
            searchBreak={searchReceptionist}
            setSearchBreak={setSearchReceptionist}
            allData={ReceptionistsData}
          />
        ) : selectedView == 'Advance Payments' ? (
          <LabTechniciansList
            searchBreak={searchLabTechnician}
            setSearchBreak={setSearchLabTechnician}
            allData={LabTechniciansData}
          />
        ) : selectedView == 'Bills' ? (
          <PharmacistsList
            searchBreak={searchPharmacists}
            setSearchBreak={setSearchPharmacists}
            allData={PharmacistsData}
          />
        ) : (
          selectedView == 'Pharmacists' && (
            <PharmacistsList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={PharmacistsData}
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
              'Accounts',
              'Employee Payrolls',
              'Invoices',
              'Payments',
              'Payment Reports',
              'Advance Payments',
              'Bills',
              'Manual Billing Payments',
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

export default BillingScreen;
