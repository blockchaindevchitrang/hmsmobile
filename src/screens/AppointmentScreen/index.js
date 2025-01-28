import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  Modal,
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
import {BlurView} from '@react-native-community/blur';
import headerLogo from '../../images/headerLogo.png';
import TransactionComponent from '../../components/TransactionComponent';
import AppointmentComponent from '../../components/AppointmentComponent';
import {
  onGetAppointmentPaymentHistoryApi,
  onGetCommonApi,
  onGetFilterAppointmentApi,
} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'Cash',
    amount: '$2,000.00',
    create_at: '20th May, 2024',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'UPI',
    amount: '$15,000.00',
    create_at: '21th May, 2024',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'Stripe',
    amount: '$1,000.00',
    create_at: '22th May, 2024',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'Cash',
    amount: '$1,000.00',
    create_at: '22th May, 2024',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'UPI',
    amount: '$1,000.00',
    create_at: '22th May, 2024',
  },
];

const appointmentData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Confirm',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Cancel',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Pending',
  },
  {
    id: 6,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Cancel',
  },
];

export const AppointmentScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'appointments', title: 'Appointments'},
    {key: 'transaction', title: 'Appointments Transaction'},
  ]);
  const [searchAppointment, setSearchAppointment] = useState('');
  const [searchBreak, setSearchBreak] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Appointments');
  const [appointmentList, setAppointmentList] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [holidayStartDate, setHolidayStartDate] = useState(null);
  const [holidayEndDate, setHolidayEndDate] = useState(null);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [transactionPage, setTransactionPage] = useState('1');
  const [statusShow, setStatusShow] = useState('');
  const [statusId, setStatusId] = useState(1);
  const [appointmentAction, setAppointmentAction] = useState('');

  let arrayData = ['Logo', 'Appointments', 'Appointments Transaction'];

  useEffect(() => {
    let dataArray = [];
    let appointmentVisible = false;
    let transactionVisible = false;
    rolePermission.map(item => {
      if (item.main_module == 'Appointments') {
        item.privileges.map(item1 => {
          if (item1.end_point == 'appointments') {
            dataArray = item1.action.split(',').map(action => action.trim());
            appointmentVisible = true;
          } else if (item1.end_point == 'appointment_transaction') {
            transactionVisible = true;
          }
        });
      }
    });
    if (!appointmentVisible) {
      arrayData = ['Logo', 'Appointments Transaction'];
    } else if (!transactionVisible) {
      arrayData = ['Logo', 'Appointments'];
    }
    setAppointmentAction(dataArray);
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
    onAppointmentGet();
  }, [
    searchAppointment,
    holidayStartDate,
    holidayEndDate,
    pageCount,
    statusId,
  ]);

  useEffect(() => {
    onTransactionDataGet();
  }, [searchBreak]);

  const onAppointmentGet = async () => {
    try {
      let urlData = `appointment-get?search=${searchAppointment}&page=${pageCount}${
        statusId == 2
          ? '&pending=0'
          : statusId == 3
          ? '&completed=1'
          : statusId == 4
          ? '&cancelled=3'
          : ''
      }${holidayStartDate != null ? `&start_date=${holidayStartDate}` : ''}${
        holidayEndDate != null ? `&end_date=${holidayEndDate}` : ''
      }`;
      const response = await onGetCommonApi(urlData);

      if (response.status === 200) {
        console.log('Get Response :::', response.data);
        setTotalPage(response.data.data.pagination.last_page);
        setAppointmentList(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error Get:', err);
    }
  };

  const onTransactionDataGet = async () => {
    try {
      const response = await onGetAppointmentPaymentHistoryApi(searchBreak);

      if (response.status === 200) {
        console.log('Get Response :::', response.data.data.items);
        setTransactionPage(response.data.data.pagination.last_page);
        setTransactionList(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error Get:', err);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('appointment')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        pagerStyle={{backgroundColor: theme.background}}
        style={{backgroundColor: 'red'}}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      /> */}
      <View style={styles.mainView}>
        {selectedView == 'Appointments' ? (
          <AppointmentComponent
            searchBreak={searchAppointment}
            setSearchBreak={setSearchAppointment}
            allData={appointmentList}
            onGetData={onAppointmentGet}
            holidayStartDate={holidayStartDate}
            setHolidayStartDate={setHolidayStartDate}
            holidayEndDate={holidayEndDate}
            setHolidayEndDate={setHolidayEndDate}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            statusShow={statusShow}
            setStatusShow={setStatusShow}
            setStatusId={setStatusId}
            statusId={statusId}
            appointmentAction={appointmentAction}
          />
        ) : (
          selectedView == 'Appointments Transaction' && (
            <TransactionComponent
              searchBreak={searchBreak}
              setSearchBreak={setSearchBreak}
              allData={transactionList}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPage={transactionPage}
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

export default AppointmentScreen;
