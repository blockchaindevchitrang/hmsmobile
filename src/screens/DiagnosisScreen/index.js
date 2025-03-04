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
import BloodBanksList from '../../components/BloodComponent/BloodBanksList';
import BloodDonorList from '../../components/BloodComponent/BloodDonorList';
import BloodDonationList from '../../components/BloodComponent/BloodDonationList';
import BloodIssueList from '../../components/BloodComponent/BloodIssueList';
import DiagnosisList from '../../components/DiagnosisComponent/DiagnosisList';
import DiagnosisCategoriesList from '../../components/DiagnosisComponent/DiagnosisCategoriesList';
import DiagnosisTestsList from '../../components/DiagnosisComponent/DiagnosisTestsList';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';
import { hasNotch } from 'react-native-device-info';

let arrayData = [
  'Logo',
  'Diagnosis',
  'Diagnosis Categories',
  'Diagnosis Tests',
];

export const DiagnosisScreen = ({navigation}) => {
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
  const [selectedView, setSelectedView] = useState('Diagnosis');
  const [diagnosisCategory, setDiagnosisCategory] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [diagnosisTest, setDiagnosisTest] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [categoryPage, setCategoryPage] = useState('1');
  const [testPage, setTestPage] = useState('1');
  const [diagnosisAction, setDiagnosisAction] = useState([]);
  const [categoryAction, setCategoryAction] = useState([]);
  const [testAction, setTestAction] = useState([]);

  useEffect(() => {
    const visibility = {
      diagnosisVisible: false,
      categoryVisible: false,
      testVisible: false,
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
          item.end_point == 'diagnosis',
          item.actions,
          setDiagnosisAction,
          'diagnosisVisible',
        );
        processPrivileges(
          item.end_point == 'diagnosis_categories',
          item.actions,
          setCategoryAction,
          'categoryVisible',
        );
        processPrivileges(
          item.end_point == 'diagnosis_tests',
          item.actions,
          setTestAction,
          'testVisible',
        );

        // Handle arrayData based on visibility
        const {diagnosisVisible, categoryVisible, testVisible} = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          diagnosisVisible && 'Diagnosis',
          categoryVisible && 'Diagnosis Categories',
          testVisible && 'Diagnosis Tests',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

  const animations = useRef(
    [0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0].map(() => new Animated.Value(0)),
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
    onGetAdvancePaymentData();
  }, [searchPayroll, pageCount]);

  const onGetAdvancePaymentData = async () => {
    try {
      const response = await onGetCommonApi(
        `diagnosis-get?search=${searchPayroll}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setDiagnosisCategory(response.data.data);
        setCategoryPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetDiagnosisData();
  }, [searchAccount, pageCount]);

  const onGetDiagnosisData = async () => {
    try {
      const response = await onGetCommonApi(
        `patient-diagnosis-get?search=${searchAccount}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setDiagnosis(response.data.data);
        setTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetDiagnosisTestData();
  }, [searchPharmacists, pageCount]);

  const onGetDiagnosisTestData = async () => {
    try {
      const response = await onGetCommonApi(
        `patient-test-diagnosis-get?search=${searchPharmacists}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setDiagnosisTest(response.data.data.items);
        setTestPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
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
          title={t('diagnosis')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Diagnosis' ? (
          <DiagnosisList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={diagnosis}
            onGetData={onGetDiagnosisData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            diagnosisAction={diagnosisAction}
          />
        ) : selectedView == 'Diagnosis Categories' ? (
          <DiagnosisCategoriesList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={diagnosisCategory}
            onGetData={onGetAdvancePaymentData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={categoryPage}
            categoryAction={categoryAction}
          />
        ) : (
          selectedView == 'Diagnosis Tests' && (
            <DiagnosisTestsList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={diagnosisTest}
              onGetData={onGetDiagnosisTestData}
              category={diagnosisCategory}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPage={testPage}
              testAction={testAction}
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

export default DiagnosisScreen;
