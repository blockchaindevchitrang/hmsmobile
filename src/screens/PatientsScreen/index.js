import React, {useState, useRef, useEffect} from 'react';
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
import {landscapeStyles, portraitStyles} from './styles';
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
import {
  onGetAllUsersDataApi,
  onGetCommonApi,
  onGetPatientApi,
  onGetPatientCasesApi,
} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';

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
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchUser, setSearchUser] = useState('');
  const [searchCases, setSearchCases] = useState('');
  const [searchCasesHandler, setSearchCasesHandler] = useState('');
  const [searchAdmission, setSearchAdmission] = useState('');
  const [searchTemplate, setSearchTemplate] = useState('');
  const [searchSmartCard, setSearchSmartCard] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Patients');
  const [patientsList, setPatientsList] = useState([]);
  const [casesList, setCasesList] = useState([]);
  const [caseHandlerList, setCaseHandlerList] = useState([]);
  const [admissionList, setAdmissionList] = useState([]);
  const [smartCardTempList, setSmartCardTempList] = useState([]);
  const [patientSmartCardList, setPatientSmartCardList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [casesPage, setCasesPage] = useState('1');
  const [caseHandlerPage, setCaseHandlerPage] = useState('1');
  const [admissionPage, setAdmissionPage] = useState('1');
  const [templatePage, setTemplatePage] = useState('1');
  const [smartCardPage, setSmartCardPage] = useState('1');
  const [statusId, setStatusId] = useState(1);
  const [statusId1, setStatusId1] = useState(1);
  const [statusId2, setStatusId2] = useState(1);
  const [admissionStatusId, setAdmissionStatusId] = useState(1);

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

  useEffect(() => {
    onGetPatientData();
  }, [searchUser, pageCount, statusId]);

  const onGetPatientData = async () => {
    try {
      const response1 = await onGetCommonApi(
        `patient-get-by-filter?search=${searchUser}&page=${pageCount}${
          statusId == 2 ? '&active=1' : statusId == 3 ? '&deactive=0' : ''
        }`,
      );
      if (response1.data.flag === 1) {
        let dataArray = [];
        const response = await onGetPatientApi();
        console.log('get Response:', response.data.data);
        if (response.data.flag == 1) {
          response1.data.data.map(item => {
            response.data.data.map(item1 => {
              if (item.id == item1.id) {
                dataArray.push(item1);
              }
            });
          });
          setTotalPage(response1.data.recordsTotal);
          setPatientsList(dataArray);
          setRefresh(!refresh);
        }
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetPatientCasesData();
  }, [searchCases, pageCount, statusId1]);

  const onGetPatientCasesData = async () => {
    try {
      const response = await onGetCommonApi(
        `patient-cases-get?search=${searchCases}&page=${pageCount}${
          statusId1 == 2 ? '&active=1' : statusId1 == 3 ? '&deactive=0' : ''
        }`,
      );
      // const response = await onGetPatientCasesApi(searchCases);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setCasesList(response.data.data);
        setCasesPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetCasesHandlerData();
  }, [searchCasesHandler, pageCount, statusId2]);

  const onGetCasesHandlerData = async () => {
    try {
      let urlData = `get-users?search=${searchCasesHandler}&page=${pageCount}&department_name=Case Manager${
        statusId2 == 2 ? '&active=1' : statusId2 == 3 ? '&deactive=0' : ''
      }`;
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        console.log('get Response:', response.data.data);
        setCaseHandlerList(response.data.data);
        setCaseHandlerPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetAdmissionData();
  }, [searchAdmission, pageCount, admissionStatusId]);

  const onGetAdmissionData = async () => {
    try {
      const response = await onGetCommonApi(
        `patient-admissions-get?search=${searchAdmission}&page=${pageCount}&department_name=Case Manager${
          admissionStatusId == 2
            ? '&active=1'
            : admissionStatusId == 3
            ? '&deactive=0'
            : ''
        }`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setAdmissionList(response.data.data);
        setAdmissionPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetSmartCardTempData();
  }, [searchTemplate, pageCount]);

  const onGetSmartCardTempData = async () => {
    try {
      const response = await onGetCommonApi(
        `patient-smart-card-get?search=${searchTemplate}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setSmartCardTempList(response.data.data);
        setTemplatePage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetSmartCardData();
  }, [searchSmartCard, pageCount]);

  const onGetSmartCardData = async () => {
    try {
      const response = await onGetCommonApi(
        `patient-smart-cards?search=${searchSmartCard}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setPatientSmartCardList(response.data.data);
        setSmartCardPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
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
            allData={patientsList}
            onGetData={onGetPatientData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            statusId={statusId}
            setStatusId={setStatusId}
          />
        ) : selectedView == 'Cases' ? (
          <CasesList
            searchBreak={searchCases}
            setSearchBreak={setSearchCases}
            allData={casesList}
            onGetData={onGetPatientCasesData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={casesPage}
            statusId={statusId1}
            setStatusId={setStatusId1}
          />
        ) : selectedView == 'Case Handlers' ? (
          <CaseHandlerList
            searchBreak={caseHandlerList}
            setSearchBreak={setCaseHandlerList}
            allData={caseHandlerList}
            onGetData={onGetCasesHandlerData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={caseHandlerPage}
            statusId={statusId2}
            setStatusId={setStatusId2}
          />
        ) : selectedView == 'Patient Admissions' ? (
          <PatientAdmissionList
            searchBreak={searchAdmission}
            setSearchBreak={setSearchAdmission}
            allData={admissionList}
            onGetData={onGetAdmissionData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={admissionPage}
            statusId={admissionStatusId}
            setStatusId={setAdmissionStatusId}
          />
        ) : selectedView == 'Patient Smart Card Templates' ? (
          <SmartCardTemplates
            searchBreak={searchTemplate}
            setSearchBreak={setSearchTemplate}
            allData={smartCardTempList}
            onGetData={onGetSmartCardTempData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={templatePage}
          />
        ) : (
          selectedView == 'Generate Patient Smart Cards' && (
            <GeneratePatient
              searchBreak={searchSmartCard}
              setSearchBreak={setSearchSmartCard}
              allData={patientSmartCardList}
              onGetData={onGetSmartCardData}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPage={smartCardPage}
              smartCardTempList={smartCardTempList}
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
                      styles.logoMenu,
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

            <View style={styles.logoMenu}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => toggleMenu(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PatientsScreen;
