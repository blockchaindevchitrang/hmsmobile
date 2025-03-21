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
import PathologyTest from '../../components/PathologyComponent/PathologyTest';
import {onGetCommonApi} from '../../services/Api';
import InsurancesScreen from '../../components/ServiceComponent/Insurances';
import Services from '../../components/ServiceComponent/Services';
import Packages from '../../components/ServiceComponent/Packages';
import Ambulances from '../../components/ServiceComponent/Ambulances';
import useOrientation from '../../components/OrientationComponent';
import AmbulanceCall from '../../components/ServiceComponent/AmbulanceCall';
import {useSelector} from 'react-redux';
import { hasNotch } from 'react-native-device-info';

let arrayData = [
  'Logo',
  'Insurances',
  'Packages',
  'Services',
  'Ambulances',
  'Ambulance Calls',
];

export const ServiceScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchUnit, setSearchUnit] = useState('');
  const [searchAmbulance, setSearchAmbulance] = useState('');
  const [searchAmbulanceCall, setSearchAmbulanceCall] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Insurances');
  const [insuranceList, setInsuranceList] = useState([]);
  const [parameter, setParameter] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [ambulancesCall, setAmbulancesCall] = useState([]);
  const [unit, setUnit] = useState([]);
  const [test, setTest] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [packagePage, setPackagePage] = useState('1');
  const [servicePage, setServicePage] = useState('1');
  const [ambulancesPage, setAmbulancesPage] = useState('1');
  const [ambulancesCallPage, setAmbulancesCallPage] = useState('1');
  const [statusId, setStatusId] = useState(3);
  const [serviceStatusId, setServiceStatusId] = useState(3);
  const [ambulancesStatusId, setAmbulancesStatusId] = useState(3);
  const [insuranceAction, setInsuranceAction] = useState([]);
  const [packageAction, setPackageAction] = useState([]);
  const [serviceAction, setServiceAction] = useState([]);
  const [ambulanceAction, setAmbulanceAction] = useState([]);
  const [callAction, setCallAction] = useState([]);

  useEffect(() => {
    const visibility = {
      insuranceVisible: false,
      packageVisible: false,
      serviceVisible: false,
      ambulanceVisible: false,
      callVisible: false,
    };

    // Helper function to process privileges
    const processPrivileges = (
      privilege,
      actions,
      setAction,
      visibilityKey,
    ) => {
      // const privilege = privileges.find(item => item.end_point === endPoint);
      if (privilege) {
        setAction(actions);
        visibility[visibilityKey] = true;
      }
    };

    // Iterate over role permissions
    rolePermission?.permission?.forEach(item => {
      if (item.status === 1) {
        processPrivileges(
          item.end_point == 'insurances',
          item.actions,
          setInsuranceAction,
          'insuranceVisible',
        );
        processPrivileges(
          item.end_point == 'packages',
          item.actions,
          setPackageAction,
          'packageVisible',
        );
        processPrivileges(
          item.end_point == 'services',
          item.actions,
          setServiceAction,
          'serviceVisible',
        );
        processPrivileges(
          item.end_point == 'ambulances',
          item.actions,
          setAmbulanceAction,
          'ambulanceVisible',
        );
        processPrivileges(
          item.end_point == 'ambulance_calls',
          item.actions,
          setCallAction,
          'callVisible',
        );
        // Handle arrayData based on visibility
        const {
          insuranceVisible,
          packageVisible,
          serviceVisible,
          ambulanceVisible,
          callVisible,
        } = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          insuranceVisible && 'Insurances',
          packageVisible && 'Packages',
          serviceVisible && 'Services',
          ambulanceVisible && 'Ambulances',
          callVisible && 'Ambulance Calls',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

  const animations = useRef(
    [0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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
    onGetPathologyCategoriesData();
  }, [searchAccount, pageCount, statusId]);

  const onGetPathologyCategoriesData = async () => {
    try {
      const response = await onGetCommonApi(
        `insurance-get?search=${searchAccount}&page=${pageCount}&status=${statusId}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setInsuranceList(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetParameterData();
  }, [searchPayroll, pageCount, serviceStatusId]);

  const onGetParameterData = async () => {
    try {
      const response = await onGetCommonApi(
        `services-get?search=${searchPayroll}&page=${pageCount}&status=${serviceStatusId}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setParameter(response.data.data.items);
        setServicePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetUnitData();
  }, [searchUnit, pageCount]);

  const onGetUnitData = async () => {
    try {
      const response = await onGetCommonApi(
        `package-get?search=${searchUnit}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setUnit(response.data.data.items);
        setPackagePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetTestData();
  }, [searchAmbulance, pageCount, ambulancesStatusId]);

  const onGetTestData = async () => {
    try {
      const response = await onGetCommonApi(
        `ambulance-get?search=${searchAmbulance}&page=${pageCount}&status=${ambulancesStatusId}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setAmbulances(response.data.data.items);
        setAmbulancesPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetAmbulanceCallData();
  }, [searchAmbulanceCall, pageCount]);

  const onGetAmbulanceCallData = async () => {
    try {
      const response = await onGetCommonApi(
        `ambulance-call-get?search=${searchAmbulanceCall}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setAmbulancesCall(response.data.data.items);
        setAmbulancesCallPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: theme.headerColor,
        }}
      />
      <View style={styles.headerView}>
        <Header
          title={t('service')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Insurances' ? (
          <InsurancesScreen
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={insuranceList}
            onGetData={onGetPathologyCategoriesData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId}
            setStatusId={setStatusId}
            insuranceAction={insuranceAction}
          />
        ) : selectedView == 'Packages' ? (
          <Packages
            searchBreak={searchUnit}
            setSearchBreak={setSearchUnit}
            allData={unit}
            onGetData={onGetUnitData}
            parameter={parameter}
            totalPage={packagePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            packageAction={packageAction}
          />
        ) : selectedView == 'Services' ? (
          <Services
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={parameter}
            onGetData={onGetParameterData}
            totalPage={servicePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={serviceStatusId}
            setStatusId={setServiceStatusId}
            serviceAction={serviceAction}
          />
        ) : selectedView == 'Ambulances' ? (
          <Ambulances
            searchBreak={searchAmbulance}
            setSearchBreak={setSearchAmbulance}
            allData={ambulances}
            onGetData={onGetTestData}
            totalPage={packagePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={ambulancesStatusId}
            setStatusId={setAmbulancesStatusId}
            ambulanceAction={ambulanceAction}
          />
        ) : (
          selectedView == 'Ambulance Calls' && (
            <AmbulanceCall
              searchBreak={searchAmbulanceCall}
              setSearchBreak={setSearchAmbulanceCall}
              allData={ambulancesCall}
              onGetData={onGetAmbulanceCallData}
              ambulance={ambulances}
              totalPage={ambulancesCallPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              callAction={callAction}
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

export default ServiceScreen;
