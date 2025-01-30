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
  onGetSpecificCommonApi,
  onGetSpecificUsersDataApi,
} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = [
  'Logo',
  'Patients',
  'Cases',
  'Case Handlers',
  'Patient Admissions',
  'Patient Smart Card Templates',
  'Generate Patient Smart Cards',
];

export const PatientsScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
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
  const [patientAction, setPatientAction] = useState([]);
  const [caseAction, setCaseAction] = useState([]);
  const [handlerAction, setHandlerAction] = useState([]);
  const [admissionAction, setAdmissionAction] = useState([]);
  const [templateAction, setTemplateAction] = useState([]);
  const [generateAction, setGenerateAction] = useState([]);

  useEffect(() => {
    const visibility = {
      patientVisible: false,
      caseVisible: false,
      handlerVisible: false,
      admissionVisible: false,
      templateVisible: false,
      generateVisible: false,
    };
    // Helper function to process privileges
    const processPrivileges = (
      privileges,
      endPoint,
      setAction,
      visibilityKey,
    ) => {
      const privilege = privileges.find(item => item.end_point === endPoint);
      if (privilege) {
        setAction(privilege.action.split(',').map(action => action.trim()));
        visibility[visibilityKey] = true;
      }
    };

    // Iterate over role permissions
    rolePermission.forEach(item => {
      if (item.main_module === 'Patients') {
        processPrivileges(
          item.privileges,
          'patients',
          setPatientAction,
          'patientVisible',
        );
        processPrivileges(
          item.privileges,
          'cases',
          setCaseAction,
          'caseVisible',
        );
        processPrivileges(
          item.privileges,
          'case_handlers',
          setHandlerAction,
          'handlerVisible',
        );
        processPrivileges(
          item.privileges,
          'patient_admissions',
          setAdmissionAction,
          'admissionVisible',
        );
        processPrivileges(
          item.privileges,
          'patient_smart_card_templates',
          setTemplateAction,
          'templateVisible',
        );
        processPrivileges(
          item.privileges,
          'generate_patient_smart_cards',
          setGenerateAction,
          'generateVisible',
        );
        // Handle arrayData based on visibility
        const {
          patientVisible,
          caseVisible,
          handlerVisible,
          admissionVisible,
          templateVisible,
          generateVisible,
        } = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          patientVisible && 'Patients',
          caseVisible && 'Cases',
          handlerVisible && 'Case Handlers',
          admissionVisible && 'Patient Admissions',
          templateVisible && 'Patient Smart Card Templates',
          generateVisible && 'Generate Patient Smart Cards',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

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

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificCommonApi(
        `patient-smart-card-edit/${id}`,
      );
      if (response.data.flag == 1) {
        console.log('get ValueLL:::', response.data.data);
        return response.data.data;
      } else {
        return 0;
      }
    } catch (err) {
      console.log('Get Error', err);
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
      let arrayData = [];
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        response.data.data.map(async item => {
          const res = await onGetSpecificDoctor(item.id);
          arrayData.push(res);
        });
        setSmartCardTempList(arrayData);
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
            patientAction={patientAction}
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
            caseAction={caseAction}
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
            handlerAction={handlerAction}
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
            admissionAction={admissionAction}
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
            templateAction={templateAction}
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
              generateAction={generateAction}
            />
          )
        )}
      </View>
      <Modal
        visible={optionModalView}
        transparent={true}
        animationType="fade"
        onRequestClose={() => toggleMenu(false)}>
        <TouchableWithoutFeedback onPress={() => toggleMenu(false)}>
          <View style={{flex: 1}}>
            <BlurView
              style={styles.absolute}
              blurType="light" // You can use 'light', 'dark', or 'extraDark' for the blur effect.
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />

            <View style={styles.mainModalView}>
              <View style={styles.menuContainer}>
                {arrayData.map((option, index) => (
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
                        <Image
                          source={headerLogo}
                          style={styles.headerLogoImage}
                        />
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
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default PatientsScreen;
