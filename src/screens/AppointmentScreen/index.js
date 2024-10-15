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
import styles from './styles';
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
import { onGetAppointmentPaymentHistoryApi, onGetFilterAppointmentApi } from '../../services/Api';

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

  // const AppointmentRoute = () => (
  //   <AppointmentComponent
  //     searchBreak={searchBreak}
  //     setSearchBreak={setSearchBreak}
  //     allData={appointmentData}
  //   />
  // );

  // const TransactionRoute = () => (
  //   <TransactionComponent
  //     searchBreak={searchBreak}
  //     setSearchBreak={setSearchBreak}
  //     allData={allData}
  //   />
  // );

  // const renderScene = SceneMap({
  //   appointments: AppointmentRoute,
  //   transaction: TransactionRoute,
  // });

  // const renderItem =
  //   ({navigationState, position}) =>
  //   ({route, index}) => {
  //     const isActive = navigationState.index === index;
  //     return (
  //       <View
  //         style={[
  //           styles.tab,
  //           {
  //             backgroundColor: isActive
  //               ? COLORS.headerGreenColor
  //               : COLORS.greyColor,
  //           },
  //         ]}>
  //         <View style={[styles.item]}>
  //           <Text style={[styles.label]}>{route.title}</Text>
  //         </View>
  //       </View>
  //     );
  //   };

  // const renderTabBar = (
  //   props: SceneRendererProps & {navigationState: State},
  // ) => (
  //   <View style={[styles.tabbar, {backgroundColor: theme.lightColor}]}>
  //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  //       {props.navigationState.routes.map((route: Route, index: number) => {
  //         return (
  //           <TouchableWithoutFeedback
  //             key={route.key}
  //             onPress={() => props.jumpTo(route.key)}>
  //             {renderItem(props)({route, index})}
  //           </TouchableWithoutFeedback>
  //         );
  //       })}
  //     </ScrollView>
  //   </View>
  // );

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
    onTransactionDataGet();
  }, []);

  const onAppointmentGet = async () => {
    try {
      const response = await onGetFilterAppointmentApi(searchAppointment);

      if (response.status === 200) {
        console.log('Get Response :::', response.data);
        setAppointmentList(response.data);
      }
    } catch (err) {
      console.log('Error Get:', err);
    }
  };

  const onTransactionDataGet = async () => {
    try {
      const response = await onGetAppointmentPaymentHistoryApi(searchBreak);

      if (response.status === 200) {
        console.log('Get Response :::', response.data);
        setTransactionList(response.data);
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
          />
        ) : (
          selectedView == 'Appointments Transaction' && (
            <TransactionComponent
              searchBreak={searchBreak}
              setSearchBreak={setSearchBreak}
              allData={transactionList}
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
            {['Logo', 'Appointments', 'Appointments Transaction'].map(
              (option, index) => (
                <>
                  {option == 'Logo' ? (
                    <Animated.View
                      key={index}
                      style={[
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
              ),
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleMenu(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppointmentScreen;
