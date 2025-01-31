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
import BirthReportList from '../../components/ReportsComponent/BirthReportList';
import DeathReportList from '../../components/ReportsComponent/DeathReportList';
import OperationReports from '../../components/ReportsComponent/OperationReports';
import InvestigationReports from '../../components/ReportsComponent/InvestigationReports';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = [
  'Logo',
  'Birth reports',
  'Death reports',
  'Investigation reports',
  'Operation reports',
];

export const ReportsScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchBirth, setSearchBirth] = useState('');
  const [searchDeath, setSearchDeath] = useState('');
  const [searchInvestigation, setSearchInvestigation] = useState('');
  const [searchOperation, setSearchOperation] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Birth reports');
  const [birthReportList, setBirthReportList] = useState([]);
  const [deathReportList, setDeathReportList] = useState([]);
  const [investigationList, setInvestigationList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [deathReportPage, setDeathReportPage] = useState('1');
  const [investigationPage, setInvestigationPage] = useState('1');
  const [operationPage, setOperationPage] = useState('1');
  const [birthAction, setBirthAction] = useState([]);
  const [deathAction, setDeathAction] = useState([]);
  const [investigationAction, setInvestigationAction] = useState([]);
  const [operationAction, setOperationAction] = useState([]);

  useEffect(() => {
    const visibility = {
      birthVisible: false,
      deathVisible: false,
      investigationVisible: false,
      operationVisible: false,
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
      if (item.main_module === 'Pathology') {
        processPrivileges(
          item.privileges,
          'birth_reports',
          setBirthAction,
          'birthVisible',
        );
        processPrivileges(
          item.privileges,
          'death_repo',
          setDeathAction,
          'deathVisible',
        );
        processPrivileges(
          item.privileges,
          'investigation_reports',
          setInvestigationAction,
          'investigationVisible',
        );
        processPrivileges(
          item.privileges,
          'operation_reports',
          setOperationAction,
          'operationVisible',
        );

        // Handle arrayData based on visibility
        const {
          birthVisible,
          deathVisible,
          investigationVisible,
          operationVisible,
        } = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          birthVisible && 'Birth reports',
          deathVisible && 'Death reports',
          investigationVisible && 'Investigation reports',
          operationVisible && 'Operation reports',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

  const animations = useRef(
    [0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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
    onGetBirthData();
  }, [searchBirth, pageCount]);

  const onGetBirthData = async () => {
    try {
      const response = await onGetCommonApi(
        `birth-report-get?search=${searchBirth}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setBirthReportList(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetDeathData();
  }, [searchDeath, pageCount]);

  const onGetDeathData = async () => {
    try {
      const response = await onGetCommonApi(
        `death-report-get?search=${searchDeath}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setDeathReportList(response.data.data.items);
        setDeathReportPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetInvestigationData();
  }, [searchInvestigation, pageCount]);

  const onGetInvestigationData = async () => {
    try {
      const response = await onGetCommonApi(
        `investigation-report-get?search=${searchInvestigation}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setInvestigationList(response.data.data.items);
        setInvestigationPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetOperationData();
  }, [searchOperation, pageCount]);

  const onGetOperationData = async () => {
    try {
      const response = await onGetCommonApi(
        `operation-report-get?search=${searchOperation}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setOperationList(response.data.data.items);
        setOperationPage(response.data.data.pagination.last_page);
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
          title={t('reports')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Birth reports' ? (
          <BirthReportList
            searchBreak={searchBirth}
            setSearchBreak={setSearchBirth}
            allData={birthReportList}
            onGetData={onGetBirthData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            birthAction={birthAction}
          />
        ) : selectedView == 'Death reports' ? (
          <DeathReportList
            searchBreak={searchDeath}
            setSearchBreak={setSearchDeath}
            allData={deathReportList}
            onGetData={onGetDeathData}
            totalPage={deathReportPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            deathAction={deathAction}
          />
        ) : selectedView == 'Investigation reports' ? (
          <InvestigationReports
            searchBreak={searchInvestigation}
            setSearchBreak={setSearchInvestigation}
            allData={investigationList}
            onGetData={onGetInvestigationData}
            totalPage={investigationPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            investigationAction={investigationAction}
          />
        ) : (
          selectedView == 'Operation reports' && (
            <OperationReports
              searchBreak={searchOperation}
              setSearchBreak={setSearchOperation}
              allData={operationList}
              onGetData={onGetOperationData}
              totalPage={operationPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              operationAction={operationAction}
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

export default ReportsScreen;
