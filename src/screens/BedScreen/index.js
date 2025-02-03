import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Image,
  TouchableWithoutFeedback,
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
import ManualList from '../../components/BillingComponent/ManualList';
import BedTypeList from '../../components/BedComponent/BedTypeList';
import BedList from '../../components/BedComponent/BedList';
import BedAssignList from '../../components/BedComponent/BedAssignList';
import {
  onGetBedApi,
  onGetBedAssignApi,
  onGetBedTypeApi,
  onGetCommonApi,
} from '../../services/Api';
import BedStatus from '../../components/BedComponent/BedStatus';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = ['Logo', 'Bed Types', 'Beds', 'Bed Assigns', 'Bed Status'];

export const BedScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [index, setIndex] = React.useState(0);

  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Bed Types');
  const [BedTypeData, setBedTypeData] = useState([]);
  const [bedData, setBedData] = useState([]);
  const [bedAssignData, setBedAssignData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [bedPage, setBedPage] = useState('1');
  const [assignPage, setAssignPage] = useState('1');
  const [statusId, setStatusId] = useState(1);
  const [assignStatusId, setAssignStatusId] = useState(1);
  const [bedTypeAction, setBedTypeAction] = useState([]);
  const [bedsAction, setBedsAction] = useState([]);
  const [assignAction, setAssignAction] = useState([]);
  const [statusAction, setStatusAction] = useState([]);

  useEffect(() => {
    const visibility = {
      bedTypeVisible: false,
      bedsVisible: false,
      assignVisible: false,
      statusVisible: false,
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
          item.end_point == 'bed_types',
          item.actions,
          setBedTypeAction,
          'bedTypeVisible',
        );
        processPrivileges(
          item.end_point == 'beds',
          item.actions,
          setBedsAction,
          'bedsVisible',
        );
        processPrivileges(
          item.end_point == 'bed_assigns',
          item.actions,
          setAssignAction,
          'assignVisible',
        );
        processPrivileges(
          item.end_point == 'bed_status',
          item.actions,
          setStatusAction,
          'statusVisible',
        );
        // Handle arrayData based on visibility
        const {bedTypeVisible, bedsVisible, assignVisible, statusVisible} =
          visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          bedTypeVisible && 'Bed Types',
          bedsVisible && 'Beds',
          assignVisible && 'Bed Assigns',
          statusVisible && 'Bed Status',
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
    bedTypeDataGet();
  }, [searchAccount, pageCount]);

  const bedTypeDataGet = async () => {
    try {
      let urlData = `bed-type-get?search=${searchAccount}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag == 1) {
        setBedTypeData(response.data.data);
        setTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  useEffect(() => {
    bedDataGet();
  }, [searchPayroll, pageCount, statusId]);

  const bedDataGet = async () => {
    try {
      let urlData = `bed-get?search=${searchPayroll}&page=${pageCount}${
        statusId == 2 ? '&available=1' : statusId == 3 ? '&not_availavle=0' : ''
      }`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag == 1) {
        setBedData(response.data.data);
        setBedPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  useEffect(() => {
    bedAssignDataGet();
  }, [searchInvoice, pageCount, assignStatusId]);

  const bedAssignDataGet = async () => {
    try {
      let urlData = `bed-assign-get?search=${searchInvoice}&page=${pageCount}${
        assignStatusId == 2
          ? '&active=1'
          : assignStatusId == 3
          ? '&deactive=0'
          : ''
      }`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag == 1) {
        setBedAssignData(response.data.data);
        setAssignPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('bed_management')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Bed Types' ? (
          <BedTypeList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={BedTypeData}
            onGetBedTypeData={bedTypeDataGet}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            bedTypeAction={bedTypeAction}
          />
        ) : selectedView == 'Beds' ? (
          <BedList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={bedData}
            onGetBedTypeData={bedDataGet}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={bedPage}
            setStatusId={setStatusId}
            statusId={statusId}
            bedsAction={bedsAction}
          />
        ) : selectedView == 'Bed Assigns' ? (
          <BedAssignList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={bedAssignData}
            getData={bedAssignDataGet}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={assignPage}
            setStatusId={setAssignStatusId}
            statusId={assignStatusId}
            assignAction={assignAction}
          />
        ) : (
          selectedView == 'Bed Status' && (
            <BedStatus BedTypeData={BedTypeData} bedData={bedData} />
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

export default BedScreen;
