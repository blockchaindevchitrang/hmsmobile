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
import IPDList from '../../components/IPDComponent/IPDList';
import OPDList from '../../components/IPDComponent/OPDList';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = ['Logo', 'IPD Patients', 'OPD Patients'];

export const IPDScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('IPD Patients');
  const [IPDData, setIPDData] = useState([]);
  const [OPDData, setOPDData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [OPDPage, setOPDPage] = useState('1');
  const [statusId, setStatusId] = useState(3);
  const [ipdAction, setIPDAction] = useState([]);
  const [opdAction, setOPDAction] = useState([]);

  useEffect(() => {
    const visibility = {
      ipdVisible: false,
      opdVisible: false,
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
          item.end_point == 'IPD Patients',
          item.actions,
          setIPDAction,
          'ipdVisible',
        );
        processPrivileges(
          item.end_point == 'OPD Patients',
          item.actions,
          setOPDAction,
          'opdVisible',
        );
        // Handle arrayData based on visibility
        const {ipdVisible, opdVisible} = visibility;

        arrayData = [
          'Logo',
          ipdVisible && 'IPD Patients',
          opdVisible && 'OPD Patients',
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
    onGetIPDData();
  }, [searchAccount, pageCount, statusId]);

  const onGetIPDData = async () => {
    try {
      let urlData = `ipd-patient-department-get?search=${searchAccount}&page=${pageCount}&is_discharge=${statusId}`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setIPDData(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetOPDData();
  }, [searchPharmacists, pageCount]);

  const onGetOPDData = async () => {
    try {
      let urlData = `opd-patient-department-get?search=${searchPharmacists}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setOPDData(response.data.data.items);
        setOPDPage(response.data.data.pagination.last_page);
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
          title={t('ipd_opd')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'IPD Patients' ? (
          <IPDList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={IPDData}
            onGetData={onGetIPDData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId}
            setStatusId={setStatusId}
            ipdAction={ipdAction}
          />
        ) : (
          selectedView == 'OPD Patients' && (
            <OPDList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={OPDData}
              onGetData={onGetOPDData}
              totalPage={OPDPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              opdAction={opdAction}
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
                            setSelectedView(option);
                            setPageCount('1');
                            toggleMenu(false);
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

export default IPDScreen;
