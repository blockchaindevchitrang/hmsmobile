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
import {TabView, SceneMap} from 'react-native-tab-view';
import {COLORS} from '../../utils';
import headerLogo from '../../images/headerLogo.png';
import UserList from '../../components/UsersComponent/UserList';
import AccountantList from '../../components/UsersComponent/AccountantList';
import NursesList from '../../components/UsersComponent/NursesList';
import {BlurView} from '@react-native-community/blur';
import ReceptionistsList from '../../components/UsersComponent/ReceptionistsList';
import LabTechniciansList from '../../components/UsersComponent/LabTechniciansList';
import PharmacistsList from '../../components/UsersComponent/PharmacistsList';
import PatientsList from '../../components/PatientsComponent/PatientsList';
import CasesList from '../../components/PatientsComponent/CasesList';
import CaseHandlerList from '../../components/PatientsComponent/CaseHandlerList';
import PatientAdmissionList from '../../components/PatientsComponent/PatientAdmissionList';
import SmartCardTemplates from '../../components/PatientsComponent/SmartCardTemplates';
import GeneratePatient from '../../components/PatientsComponent/GeneratePatient';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    group: 'O+',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: 'N/A',
    group: 'AB-',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    group: 'O+',
    status: false,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    group: 'A+',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    group: 'O+',
    status: true,
  },
];

const accountantData = [
  {
    id: 1,
    admission: 'EMP0000001',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1000',
    status: true,
  },
  {
    id: 2,
    admission: 'EMP0000002',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1,890.00',
    status: true,
  },
  {
    id: 3,
    admission: 'EMP0000003',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1,580.00',
    status: false,
  },
  {
    id: 4,
    admission: 'EMP0000004',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$630.00',
    status: true,
  },
  {
    id: 5,
    admission: 'EMP0000005',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    mode: 'Cash',
    amount: '$1,890.00',
    status: true,
  },
];

const CaseHandlerData = [
  {
    id: 1,
    admission: 'EMP0000001',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: 'N/A',
    phone: '9876543210',
    qualification: 'Bsc',
    status: true,
  },
  {
    id: 2,
    admission: 'EMP0000002',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: 'N/A',
    phone: 'N/A',
    qualification: 'Msc',
    status: true,
  },
  {
    id: 3,
    admission: 'EMP0000003',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '8th April, 1999',
    phone: '9876543210',
    qualification: '',
    status: false,
  },
  {
    id: 4,
    admission: 'EMP0000004',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '10th May, 1998',
    phone: '9876543210',
    qualification: 'MCom',
    status: true,
  },
  {
    id: 5,
    admission: 'EMP0000005',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '10th May, 1998',
    phone: '9876543210',
    qualification: 'Bsc',
    status: true,
  },
];

const NurseData = [
  {
    id: 1,
    admission: 'EMP0000001',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    package: 'Patient',
    status: true,
    insurance: 'Cooper Mccall',
    date: '22:02:00 2023-05-25',
    discharge_date: 'N/A',
    number: 'N/A',
  },
  {
    id: 2,
    admission: 'EMP0000002',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    package: 'Body Check up',
    status: true,
    insurance: 'Colleen Craig',
    date: '22:02:00 2023-05-25',
    discharge_date: 'N/A',
    number: '4839920',
  },
  {
    id: 3,
    admission: 'EMP0000003',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    package: 'N/A',
    status: false,
    insurance: 'Demo Insurance',
    date: '22:02:00 2023-05-25',
    discharge_date: '22:02:00 2023-05-25',
    number: 'N/A',
  },
  {
    id: 4,
    admission: 'EMP0000004',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    package: 'Patient',
    status: true,
    insurance: 'Demo Insurance',
    date: '22:02:00 2023-05-25',
    discharge_date: 'N/A',
    number: 'N/A',
  },
  {
    id: 5,
    admission: 'EMP0000005',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    package: 'Full Body Check up',
    status: true,
    insurance: 'Cooper Mccall',
    date: '22:02:00 2023-05-25',
    discharge_date: 'N/A',
    number: '4839822',
  },
];

const ReceptionistsData = [
  {
    id: 1,
    name: 'Default',
    header_color: 'black',
    show_email: true,
    show_phone: true,
    show_DOB: true,
    showGB: false,
    show_address: true,
    show_Patient: true,
  },
  {
    id: 2,
    name: 'Testing',
    header_color: 'blue',
    show_email: false,
    show_phone: true,
    show_DOB: true,
    showGB: false,
    show_address: true,
    show_Patient: true,
  },
  {
    id: 3,
    name: 'Johnny',
    header_color: 'green',
    show_email: true,
    show_phone: false,
    show_DOB: true,
    showGB: false,
    show_address: true,
    show_Patient: true,
  },
  {
    id: 4,
    name: 'Naledi Alisa',
    header_color: 'red',
    show_email: true,
    show_phone: false,
    show_DOB: true,
    showGB: false,
    show_address: true,
    show_Patient: true,
  },
  {
    id: 5,
    name: 'Appoint',
    header_color: 'yellow',
    show_email: true,
    show_phone: false,
    show_DOB: true,
    showGB: false,
    show_address: true,
    show_Patient: true,
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
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
];

export const PatientsScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchUser, setSearchUser] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchAccountant, setSearchAccountant] = useState('');
  const [searchBreak, setSearchBreak] = useState('');
  const [searchNurse, setSearchNurse] = useState('');
  const [searchReceptionist, setSearchReceptionist] = useState('');
  const [searchLabTechnician, setSearchLabTechnician] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Patients');

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
          title={t('patient')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Patients' ? (
          <PatientsList
            searchBreak={searchUser}
            setSearchBreak={setSearchUser}
            allData={allData}
          />
        ) : selectedView == 'Cases' ? (
          <CasesList
            searchBreak={searchAccountant}
            setSearchBreak={setSearchAccountant}
            allData={accountantData}
          />
        ) : selectedView == 'Case Handlers' ? (
          <CaseHandlerList
            searchBreak={searchAccountant}
            setSearchBreak={setSearchAccountant}
            allData={CaseHandlerData}
          />
        ) : selectedView == 'Patient Admissions' ? (
          <PatientAdmissionList
            searchBreak={searchNurse}
            setSearchBreak={setSearchNurse}
            allData={NurseData}
          />
        ) : selectedView == 'Patient Smart Card Templates' ? (
          <SmartCardTemplates
            searchBreak={searchReceptionist}
            setSearchBreak={setSearchReceptionist}
            allData={ReceptionistsData}
          />
        ) : (
          selectedView == 'Generate Patient Smart Cards' && (
            <GeneratePatient
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
              'Patients',
              'Cases',
              'Case Handlers',
              'Patient Admissions',
              'Patient Smart Card Templates',
              'Generate Patient Smart Cards',
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

export default PatientsScreen;
