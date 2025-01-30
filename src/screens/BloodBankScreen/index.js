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
import {
  onGetBloodBankApi,
  onGetBloodDonationApi,
  onGetBloodDonorApi,
  onGetBloodIssueApi,
  onGetCommonApi,
} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = [
  'Logo',
  'Blood Banks',
  'Blood Donors',
  'Blood Donations',
  'Blood Issues',
];

export const BloodBankScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Blood Banks');
  const [bloodBankData, setBloodBankData] = useState([]);
  const [bloodDonorData, setBloodDonorData] = useState([]);
  const [bloodDonationData, setBloodDonationData] = useState([]);
  const [bloodIssueData, setBloodIssueData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [bloodDonorPage, setBloodDonorPage] = useState('1');
  const [donationPage, setDonationPage] = useState('1');
  const [bloodIssuePage, setBloodIssuePage] = useState('1');
  const [bloodBankAction, setBloodBankAction] = useState([]);
  const [donorAction, setDonorAction] = useState([]);
  const [donationAction, setDonationAction] = useState([]);
  const [issueAction, setIssueAction] = useState([]);

  useEffect(() => {
    const visibility = {
      bloodBankVisible: false,
      donorVisible: false,
      donationVisible: false,
      issueVisible: false,
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
      if (item.main_module === 'Blood Banks') {
        processPrivileges(
          item.privileges,
          'blood_banks',
          setBloodBankAction,
          'bloodBankVisible',
        );
        processPrivileges(
          item.privileges,
          'blooddonar',
          setDonorAction,
          'donorVisible',
        );
        processPrivileges(
          item.privileges,
          'blood_donations',
          setDonationAction,
          'donationVisible',
        );
        processPrivileges(
          item.privileges,
          'blood_issues',
          setIssueAction,
          'issueVisible',
        );
        // Handle arrayData based on visibility
        const {bloodBankVisible, donorVisible, donationVisible, issueVisible} =
          visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          bloodBankVisible && 'Blood Banks',
          donorVisible && 'Blood Donors',
          donationVisible && 'Blood Donations',
          issueVisible && 'Blood Issues',
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
    onGetBloodBankData();
  }, [searchAccount, pageCount]);

  const onGetBloodBankData = async () => {
    try {
      let urlData = `blood-bank-get?search=${searchAccount}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      console.log('Response Role Data', response.data);
      if (response.data.flag == 1) {
        setBloodBankData(response.data.data);
        setTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onGetBloodDonorData();
  }, [searchPayroll, pageCount]);

  const onGetBloodDonorData = async () => {
    try {
      let urlData = `blood-donor-get?search=${searchPayroll}&page=${pageCount}`;
      const bloodDonor = await onGetCommonApi(urlData);
      console.log('Response bloodDonor Data', bloodDonor.data);
      if (bloodDonor.data.flag == 1) {
        setBloodDonorData(bloodDonor.data.data);
        setBloodDonorPage(bloodDonor.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onBloodDonationData();
  }, [searchInvoice, pageCount]);

  const onBloodDonationData = async () => {
    try {
      let urlData = `blood-donation-get?search=${searchInvoice}&page=${pageCount}`;
      const bloodDonor = await onGetCommonApi(urlData);
      console.log('Response bloodDonor Data', bloodDonor.data);
      if (bloodDonor.data.flag == 1) {
        setBloodDonationData(bloodDonor.data.data);
        setDonationPage(bloodDonor.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onBloodIssueData();
  }, [searchPharmacists, pageCount]);

  const onBloodIssueData = async () => {
    try {
      let urlData = `blood-issue-get?search=${searchPharmacists}&page=${pageCount}`;
      const bloodDonor = await onGetCommonApi(urlData);
      console.log('Response bloodDonor Data', bloodDonor.data);
      if (bloodDonor.data.flag == 1) {
        setBloodIssueData(bloodDonor.data.data);
        setBloodIssuePage(bloodDonor.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('blood_bank')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Blood Banks' ? (
          <BloodBanksList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={bloodBankData}
            onGetData={onGetBloodBankData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            bloodBankAction={bloodBankAction}
          />
        ) : selectedView == 'Blood Donors' ? (
          <BloodDonorList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={bloodDonorData}
            onGetData={onGetBloodDonorData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={bloodDonorPage}
            donorAction={donorAction}
          />
        ) : selectedView == 'Blood Donations' ? (
          <BloodDonationList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={bloodDonationData}
            onGetData={onBloodDonationData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={donationPage}
            donationAction={donationAction}
          />
        ) : (
          selectedView == 'Blood Issues' && (
            <BloodIssueList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={bloodIssueData}
              onGetData={onBloodIssueData}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPage={bloodIssuePage}
              bloodDonorData={bloodDonorData}
              bloodBankData={bloodBankData}
              issueAction={issueAction}
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

export default BloodBankScreen;
