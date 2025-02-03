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
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import DoctorChargesList from '../../components/HospitalChargesComponent/DoctorChargesList';
import VaccinatedPatients from '../../components/VaccinationComponent/VaccinatedPatients';
import VaccinationList from '../../components/VaccinationComponent/VaccinationList';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = ['Logo', 'Vaccinated Patients', 'Vaccinations'];

export const VaccinationScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Vaccinated Patients');
  const [vaccinatedPatient, setVaccinatedPatient] = useState([]);
  const [vaccinated, setVaccinated] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [vaccinationPage, setVaccinationPage] = useState('1');
  const [patientAction, setPatientAction] = useState([]);
  const [vaccinationAction, setVaccinationAction] = useState([]);

  useEffect(() => {
    const visibility = {
      patientVisible: false,
      vaccinationVisible: false,
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
      if (item.main_module === 'Vaccinations') {
        processPrivileges(
          item.privileges,
          'vaccinated_patients',
          setPatientAction,
          'patientVisible',
        );
        processPrivileges(
          item.privileges,
          'vaccinations',
          setVaccinationAction,
          'vaccinationVisible',
        );
        // Handle arrayData based on visibility
        const {patientVisible, vaccinationVisible} = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          patientVisible && 'Vaccinated Patients',
          vaccinationVisible && 'Vaccinations',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

  const animations = useRef(
    [0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef([0, 0, 0].map(() => new Animated.Value(0))).current;

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
    onGetVaccinatedPatientData();
  }, [searchAccount, pageCount]);

  const onGetVaccinatedPatientData = async () => {
    try {
      const response = await onGetCommonApi(
        `vaccinated-patient-get?search=${searchAccount}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag == 1) {
        setVaccinatedPatient(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetVaccinatedData();
  }, [searchPharmacists, pageCount]);

  const onGetVaccinatedData = async () => {
    try {
      const response = await onGetCommonApi(
        `vaccination-get?search=${searchPharmacists}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag == 1) {
        setVaccinated(response.data.data.items);
        setVaccinationPage(response.data.data.pagination.last_page);
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
          title={t('vaccination')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Vaccinated Patients' ? (
          <VaccinatedPatients
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={vaccinatedPatient}
            onGetData={onGetVaccinatedPatientData}
            vaccinated={vaccinated}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            patientAction={patientAction}
          />
        ) : (
          selectedView == 'Vaccinations' && (
            <VaccinationList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={vaccinated}
              onGetData={onGetVaccinatedData}
              totalPage={vaccinationPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              vaccinationAction={vaccinationAction}
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

export default VaccinationScreen;
