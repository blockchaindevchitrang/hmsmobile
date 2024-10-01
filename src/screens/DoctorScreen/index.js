import React, {useRef, useState} from 'react';
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
import styles from './styles';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import {TabView, SceneMap} from 'react-native-tab-view';
import {COLORS} from '../../utils';
import DoctorComponent from '../../components/DoctorComponent';
import DepartmentComponent from '../../components/DepartmentComponent';
import ScheduleComponent from '../../components/ScheduleComponent';
import HolidayComponent from '../../components/HolidayComponent';
import BreakComponent from '../../components/BreakComponent';
import {BlurView} from '@react-native-community/blur';
import headerLogo from '../../images/headerLogo.png';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    specialist: 'Onco',
    qualification: 'MBBS',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'MBBS',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'Phd',
    status: false,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'MBBS',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'Phd',
    status: false,
  },
];

const departmentData = [
  {
    id: 1,
    name: 'General Medicine',
  },
  {
    id: 2,
    name: 'Pediatrics',
  },
  {
    id: 3,
    name: 'Psychiatrists',
  },
  {
    id: 4,
    name: 'Radiologist',
  },
  {
    id: 5,
    name: 'Ophthalmology',
  },
];

const scheduleData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    time: '01:00 hours',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    time: '01:00 hours',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    time: '01:00 hours',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    time: '01:00 hours',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    time: '01:00 hours',
  },
];

const breakData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    specialist: '1:10:00 PM',
    qualification: '1:40:00 PM',
    status: 'Everyday',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    specialist: '12:30:00 PM',
    qualification: '1:00:00 PM',
    status: 'Everyday',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    specialist: '5:00:00 PM',
    qualification: '5:30:00 PM',
    status: 'Everyday',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    specialist: '5:00:00 PM',
    qualification: '5:30:00 PM',
    status: 'Everyday',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    specialist: '5:00:00 PM',
    qualification: '5:30:00 PM',
    status: 'Everyday',
  },
];

export const DoctorScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [practice, setPractice] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [doctorCity, setDoctorCity] = useState('');
  const [doctorState, setDoctorState] = useState('');
  const [doctorZip, setDoctorZip] = useState('');
  const [doctorFax, setDoctorFax] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorContact, setDoctorContact] = useState('');
  const [doctorAlternate, setDoctorAlternate] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [departmentComment, setDepartmentComment] = useState('');
  const [statusVisible, setStatusVisible] = useState(false);
  const [departmentType, setDepartmentType] = useState('debit');
  const [addDoctorVisible, setAddDoctorVisible] = useState(false);
  const [searchSchedule, setSearchSchedule] = useState('');
  const [addScheduleVisible, setAddScheduleVisible] = useState(false);
  const [searchHoliday, setSearchHoliday] = useState('');
  const [addHolidayVisible, setAddHolidayVisible] = useState(false);
  const [searchBreak, setSearchBreak] = useState('');
  const [doctorBreakName, setDoctorBreakName] = useState('');
  const [selectedView, setSelectedView] = useState('Doctor');
  const [optionModalView, setOptionModalView] = useState(false);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'doctor', title: 'Doctor'},
    {key: 'department', title: 'Doctor Departments'},
    {key: 'schedule', title: 'Schedules'},
    {key: 'holiday', title: 'Doctor Holidays'},
    {key: 'break', title: 'Breaks'},
  ]);

  // const DoctorRoute = () => (
  //   <DoctorComponent
  //     allData={allData}
  //     search={search}
  //     setSearch={setSearch}
  //     filterData={filter}
  //     setFilter={setFilter}
  //     practice={practice}
  //     setPractice={setPractice}
  //     firstName={firstName}
  //     setFirstName={setFirstName}
  //     lastName={lastName}
  //     setLastName={setLastName}
  //     middleName={middleName}
  //     setMiddleName={setMiddleName}
  //     address1={address1}
  //     setAddress1={setAddress1}
  //     address2={address2}
  //     setAddress2={setAddress2}
  //     doctorCity={doctorCity}
  //     setDoctorCity={setDoctorCity}
  //     doctorState={doctorState}
  //     setDoctorState={setDoctorState}
  //     doctorZip={doctorZip}
  //     setDoctorZip={setDoctorZip}
  //     doctorFax={doctorFax}
  //     setDoctorFax={setDoctorFax}
  //     doctorEmail={doctorEmail}
  //     setDoctorEmail={setDoctorEmail}
  //     doctorContact={doctorContact}
  //     setDoctorContact={setDoctorContact}
  //     doctorAlternate={doctorAlternate}
  //     setDoctorAlternate={setDoctorAlternate}
  //   />
  // );

  // const DepartmentRoute = () => (
  //   <DepartmentComponent
  //     searchDepartment={searchDepartment}
  //     setSearchDepartment={setSearchDepartment}
  //     allData={departmentData}
  //     eventTitle={eventTitle}
  //     setEventTitle={setEventTitle}
  //     departmentComment={departmentComment}
  //     setDepartmentComment={setDepartmentComment}
  //     statusVisible={statusVisible}
  //     setStatusVisible={setStatusVisible}
  //     departmentType={departmentType}
  //     setDepartmentType={setDepartmentType}
  //     addDoctorVisible={addDoctorVisible}
  //     setAddDoctorVisible={setAddDoctorVisible}
  //   />
  // );

  // const ScheduleRoute = () => (
  //   <ScheduleComponent
  //     searchDepartment={searchSchedule}
  //     setSearchDepartment={setSearchSchedule}
  //     allData={scheduleData}
  //     addScheduleVisible={addScheduleVisible}
  //     setAddScheduleVisible={setAddScheduleVisible}
  //   />
  // );

  // const HolidayRoute = () => (
  //   <HolidayComponent
  //     searchHoliday={searchHoliday}
  //     setSearchHoliday={setSearchHoliday}
  //     allData={scheduleData}
  //     addHolidayVisible={addHolidayVisible}
  //     setAddHolidayVisible={setAddHolidayVisible}
  //   />
  // );

  // const BreakRoute = () => (
  //   <BreakComponent
  //     searchBreak={searchBreak}
  //     setSearchBreak={setSearchBreak}
  //     allData={breakData}
  //     doctorBreakName={doctorBreakName}
  //     setDoctorBreakName={setDoctorBreakName}
  //   />
  // );

  // const renderScene = SceneMap({
  //   doctor: DoctorRoute,
  //   department: DepartmentRoute,
  //   schedule: ScheduleRoute,
  //   holiday: HolidayRoute,
  //   break: BreakRoute,
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
  //   props: SceneRendererProps & { navigationState: State }
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
    [0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('doctor')}
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
        {selectedView == 'Doctor' ? (
          <DoctorComponent
            allData={allData}
            search={search}
            setSearch={setSearch}
            filterData={filter}
            setFilter={setFilter}
            practice={practice}
            setPractice={setPractice}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            middleName={middleName}
            setMiddleName={setMiddleName}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            doctorCity={doctorCity}
            setDoctorCity={setDoctorCity}
            doctorState={doctorState}
            setDoctorState={setDoctorState}
            doctorZip={doctorZip}
            setDoctorZip={setDoctorZip}
            doctorFax={doctorFax}
            setDoctorFax={setDoctorFax}
            doctorEmail={doctorEmail}
            setDoctorEmail={setDoctorEmail}
            doctorContact={doctorContact}
            setDoctorContact={setDoctorContact}
            doctorAlternate={doctorAlternate}
            setDoctorAlternate={setDoctorAlternate}
          />
        ) : selectedView == 'Doctor Departments' ? (
          <DepartmentComponent
            searchDepartment={searchDepartment}
            setSearchDepartment={setSearchDepartment}
            allData={departmentData}
            eventTitle={eventTitle}
            setEventTitle={setEventTitle}
            departmentComment={departmentComment}
            setDepartmentComment={setDepartmentComment}
            statusVisible={statusVisible}
            setStatusVisible={setStatusVisible}
            departmentType={departmentType}
            setDepartmentType={setDepartmentType}
            addDoctorVisible={addDoctorVisible}
            setAddDoctorVisible={setAddDoctorVisible}
          />
        ) : selectedView == 'Schedules' ? (
          <ScheduleComponent
            searchDepartment={searchSchedule}
            setSearchDepartment={setSearchSchedule}
            allData={scheduleData}
            addScheduleVisible={addScheduleVisible}
            setAddScheduleVisible={setAddScheduleVisible}
          />
        ) : selectedView == 'Doctor Holidays' ? (
          <HolidayComponent
            searchHoliday={searchHoliday}
            setSearchHoliday={setSearchHoliday}
            allData={scheduleData}
            addHolidayVisible={addHolidayVisible}
            setAddHolidayVisible={setAddHolidayVisible}
          />
        ) : (
          selectedView == 'Breaks' && (
            <BreakComponent
              searchBreak={searchBreak}
              setSearchBreak={setSearchBreak}
              allData={breakData}
              doctorBreakName={doctorBreakName}
              setDoctorBreakName={setDoctorBreakName}
            />
          )
        )}
      </View>
      <Modal
        visible={optionModalView}
        transparent={true}
        animationType="fade"
        onRequestClose={() => toggleMenu(false)}>
        <BlurView
          style={styles.absolute}
          blurType="light" // You can use 'light', 'dark', or 'extraDark' for the blur effect.
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />

        <View style={styles.mainModalView}>
          <View style={styles.menuContainer}>
            {[
              'Logo',
              'Doctor',
              'Doctor Departments',
              'Schedules',
              'Doctor Holidays',
              'Breaks',
            ].map((option, index) => (
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
                    <Image source={headerLogo} style={styles.headerLogoImage} />
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

export default DoctorScreen;
