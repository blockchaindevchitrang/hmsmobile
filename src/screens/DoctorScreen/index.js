import React, {useEffect, useRef, useState} from 'react';
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
import {COLORS} from '../../utils';
import DoctorComponent from '../../components/DoctorComponent';
import DepartmentComponent from '../../components/DepartmentComponent';
import ScheduleComponent from '../../components/ScheduleComponent';
import HolidayComponent from '../../components/HolidayComponent';
import BreakComponent from '../../components/BreakComponent';
import {BlurView} from '@react-native-community/blur';
import headerLogo from '../../images/headerLogo.png';
import {
  onAddDoctorApi,
  onAddDoctorDepartmentApi,
  onAddDoctorHolidayApi,
  onDeleteDepartmentApi,
  onDeleteDoctorApi,
  onDeleteHolidayApi,
  onGetCommonApi,
  onGetDoctorApi,
  onGetDoctorBreakApi,
  onGetDoctorDepartmentApi,
  onGetDoctorHolidayApi,
  onUpdateDoctorApi,
  onUpdateDoctorDepartmentApi,
  onUpdateDoctorHolidayApi,
} from '../../services/Api';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import moment from 'moment';
import {useSelector} from 'react-redux';
import useOrientation from '../../components/OrientationComponent';

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

let arrayData = [
  'Logo',
  'Doctor',
  'Doctor Departments',
  'Schedules',
  'Doctor Holidays',
  'Breaks',
];

export const DoctorScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
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
  const [doctorDataList, setDoctorDataList] = useState([]);
  const [doctorDepartmentList, setDoctorDepartmentList] = useState([]);
  const [doctorHolidayList, setDoctorHolidayList] = useState([]);
  const [doctorBreakList, setDoctorBreakList] = useState([]);
  const [holidayDoctor, setHolidayDoctor] = useState('');
  const [holidayDate, setHolidayDate] = useState(new Date());
  const [holidayStartDate, setHolidayStartDate] = useState(null);
  const [holidayEndDate, setHolidayEndDate] = useState(null);
  const [holidayReason, setHolidayReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [genderType, setGenderType] = useState('female');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [description, setDescription] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualification, setQualification] = useState('');
  const [doctorBlood, setDoctorBlood] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [charge, setCharge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [holidayDateModalVisible, setHolidayDateModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [departmentPage, setDepartmentPage] = useState('1');
  const [schedulePage, setSchedulePage] = useState('1');
  const [holidayPage, setHolidayPage] = useState('1');
  const [breakPage, setBreakPage] = useState('1');
  const [statusId, setStatusId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [scheduleList, setScheduleList] = useState([]);
  const [doctorAction, setDoctorAction] = useState([]);
  const [departmentAction, setDepartmentAction] = useState([]);
  const [scheduleAction, setScheduleAction] = useState([]);
  const [holidayAction, setHolidayAction] = useState([]);
  const [breakAction, setBreakAction] = useState([]);
  const {t} = useTranslation();
  const {theme} = useTheme();

  const animations = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const visibility = {
      doctorVisible: false,
      departmentVisible: false,
      scheduleVisible: false,
      holidayVisible: false,
      breakVisible: false,
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
          item.end_point == 'doctors',
          item.actions,
          setDoctorAction,
          'doctorVisible',
        );
        processPrivileges(
          item.end_point == 'doctor_departments',
          item.actions,
          setDepartmentAction,
          'departmentVisible',
        );
        processPrivileges(
          item.end_point == 'schedules',
          item.actions,
          setScheduleAction,
          'scheduleVisible',
        );
        processPrivileges(
          item.end_point == 'doctor_holidays',
          item.actions,
          setHolidayAction,
          'holidayVisible',
        );
        processPrivileges(
          item.end_point == 'breaks',
          item.actions,
          setBreakAction,
          'breakVisible',
        );
        // Handle arrayData based on visibility
        const {
          doctorVisible,
          departmentVisible,
          scheduleVisible,
          holidayVisible,
          breakVisible,
        } = visibility;

        arrayData = [
          'Logo',
          doctorVisible && 'Doctor',
          departmentVisible && 'Doctor Departments',
          scheduleVisible && 'Schedules',
          holidayVisible && 'Doctor Holidays',
          breakVisible && 'Breaks',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

  useEffect(() => {
    onGetDoctorData();
  }, [search, pageCount, statusId]);

  const onGetDoctorData = async () => {
    try {
      let urlData = `doctor-get?search=${search}&page=${pageCount}${
        statusId == 2 ? '&active=1' : statusId == 3 ? '&deactive=0' : ''
      }`;
      const response = await onGetDoctorApi(urlData);
      console.log('Get Response Data Array::', response.data);
      if (response.data.flag == 1) {
        setTotalPage(response.data.recordsTotal);
        setDoctorDataList(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get Error:', err);
    }
  };

  useEffect(() => {
    onGetDoctorDepartmentData();
  }, [searchDepartment, pageCount]);

  const onGetDoctorDepartmentData = async () => {
    try {
      let urlData = `filter-doctor-department?search=${searchDepartment}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      if (response.data.flag == 1) {
        setDoctorDepartmentList(response.data.data);
        setDepartmentPage(response.data.recordsTotal);
        setAddDoctorVisible(false);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get Error:', err);
    }
  };

  const onAddDoctorDepartmentData = async () => {
    try {
      setIsLoading(true);
      const response = await onAddDoctorDepartmentApi(
        eventTitle,
        departmentComment,
        statusVisible ? 1 : 0,
        departmentType,
      );
      if (response.status == 200) {
        onGetDoctorDepartmentData();
        setIsLoading(false);
        showMessage({
          message: 'Record Added Successfully',
          type: 'success',
          duration: 3000,
        });
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      showMessage({
        message: 'Please enter properly details.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err.response.data);
    }
  };

  const onEditDoctorDepartmentData = async id => {
    try {
      setIsLoading(true);
      const response = await onUpdateDoctorDepartmentApi(
        id,
        eventTitle,
        departmentComment,
        statusVisible ? 1 : 0,
        departmentType,
      );
      if (response.status == 200) {
        onGetDoctorDepartmentData();
        setIsLoading(false);
        showMessage({
          message: 'Record Edit Successfully',
          type: 'success',
          duration: 3000,
        });
        setEventTitle('');
        setDepartmentComment('');
        setStatusVisible(false);
        setDepartmentType('debit');
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      showMessage({
        message: 'Please enter properly details.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err);
    }
  };

  const onAddDoctorData = async () => {
    try {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append('first_name', firstName);
      formdata.append('last_name', lastName);
      formdata.append('email', doctorEmail);
      formdata.append('doctor_department_id', practice);
      formdata.append('dob', moment(dateOfBirth).format('YYYY-MM-DD'));
      formdata.append('gender', genderType == 'female' ? 1 : 0);
      formdata.append('phone', doctorContact);
      formdata.append('designation', designation);
      formdata.append('qualification', qualification);
      formdata.append('specialist', specialist);
      formdata.append('password', password);
      formdata.append('password_confirmation', confirmPassword);
      formdata.append('appointment_charge', charge);
      formdata.append('description', description);
      formdata.append('address1', address1);
      formdata.append('address2', address2);
      formdata.append('city', doctorCity);
      formdata.append('zip', doctorZip);
      formdata.append('blood_group', doctorBlood);
      // if (avatar != null) {
      //   formdata.append('image', avatar);
      // }
      const response = await onAddDoctorApi(formdata);
      if (response.status == 200) {
        onGetDoctorData();
        setAddDoctorVisible(false);
        showMessage({
          message: 'Record Added Successfully',
          type: 'success',
          duration: 3000,
        });
        setIsLoading(false);
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      showMessage({
        message: 'Please enter properly details.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err.response.data);
    }
  };

  const onUpdateDoctorData = async id => {
    try {
      setIsLoading(true);
      const formdata = new FormData();
      formdata.append('first_name', firstName);
      formdata.append('last_name', lastName);
      formdata.append('email', doctorEmail);
      formdata.append('doctor_department_id', 1);
      formdata.append('dob', moment(dateOfBirth).format('YYYY-MM-DD'));
      formdata.append('gender', genderType == 'female' ? 1 : 0);
      formdata.append('phone', doctorContact);
      formdata.append('designation', designation);
      formdata.append('qualification', qualification);
      formdata.append('specialist', specialist);
      formdata.append('appointment_charge', charge);
      formdata.append('description', description);
      formdata.append('address1', address1);
      formdata.append('address2', address2);
      formdata.append('city', doctorCity);
      formdata.append('zip', doctorZip);
      formdata.append('blood_group', doctorBlood);
      // if (avatar != null) {
      //   formdata.append('image', avatar);
      // }
      const response = await onUpdateDoctorApi(formdata, id);
      if (response.status == 200) {
        onGetDoctorData();
        setAddDoctorVisible(false);
        showMessage({
          message: 'Record Edit Successfully',
          type: 'success',
          duration: 3000,
        });
        setIsLoading(false);
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      showMessage({
        message: 'Please enter properly details.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err.response.data);
    }
  };

  const onDeleteDeleteData = async id => {
    try {
      setIsLoading(true);
      const response = await onDeleteDoctorApi(id);
      if (response.status == 200) {
        onGetDoctorData();
        setIsLoading(false);
        setDeleteUser(false);
        showMessage({
          message: 'Record Delete Successfully',
          type: 'success',
          duration: 3000,
        });
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      setDeleteUser(false);
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err.response.data);
    }
  };

  const onDeleteDepartmentData = async id => {
    try {
      setIsLoading(true);
      const response = await onDeleteDepartmentApi(id);
      if (response.status == 200) {
        onGetDoctorDepartmentData();
        setIsLoading(false);
        setDeleteUser(false);
        showMessage({
          message: 'Record Delete Successfully',
          type: 'success',
          duration: 3000,
        });
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      setDeleteUser(false);
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err);
    }
  };

  useEffect(() => {
    onGetDoctorHolidayData();
  }, [searchHoliday, pageCount]);

  const onGetDoctorHolidayData = async () => {
    try {
      let urlData = `doctor-holiday-get?search=${searchHoliday}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      // const response = await onGetDoctorHolidayApi(searchHoliday);
      if (response.status == 200) {
        setDoctorHolidayList(response.data.data);
        setHolidayPage(response.data.recordsTotal);
        setAddHolidayVisible(false);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get Error:', err);
    }
  };

  const onAddDoctorHolidayData = async () => {
    try {
      setIsLoading(true);
      const response = await onAddDoctorHolidayApi(
        holidayDoctor,
        moment(holidayDate).format('YYYY-MM-DD'),
        holidayReason,
      );
      if (response.status == 200) {
        onGetDoctorHolidayData();
        setIsLoading(false);
        showMessage({
          message: 'Record Added Successfully',
          type: 'success',
          duration: 3000,
        });
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      showMessage({
        message: 'Please enter properly details.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err.response.data);
    }
  };

  const onDeleteHolidayData = async id => {
    try {
      setIsLoading(true);
      const response = await onDeleteHolidayApi(id);
      if (response.status == 200) {
        onGetDoctorHolidayData();
        setIsLoading(false);
        setDeleteUser(false);
        showMessage({
          message: 'Record Delete Successfully',
          type: 'success',
          duration: 3000,
        });
        setRefresh(!refresh);
      }
    } catch (err) {
      setIsLoading(false);
      setDeleteUser(false);
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Get Error:', err);
    }
  };

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
    onGetDoctorBreakData();
  }, [searchBreak, pageCount]);

  const onGetDoctorBreakData = async () => {
    try {
      let urlData = `lunch-break-get?search=${searchBreak}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      // const response = await onGetDoctorBreakApi(searchBreak);
      if (response.data.flag == 1) {
        setDoctorBreakList(response.data.data);
        setBreakPage(response.data.recordsTotal);
        // setAddHolidayVisible(false);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get Error:', err);
    }
  };

  useEffect(() => {
    onGetDoctorScheduleData();
  }, [searchSchedule, pageCount]);

  const onGetDoctorScheduleData = async () => {
    try {
      let urlData = `get-schedules?search=${searchSchedule}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      if (response.data.flag == 1) {
        setScheduleList(response.data.data.items);
        setSchedulePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get Error:', err);
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
      <View style={styles.mainView}>
        {selectedView == 'Doctor' ? (
          <DoctorComponent
            allData={doctorDataList}
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
            genderType={genderType}
            setGenderType={setGenderType}
            status={status}
            setStatus={setStatus}
            description={description}
            setDescription={setDescription}
            dateOfBirth={dateOfBirth}
            setDateOfBirth={setDateOfBirth}
            dateModalVisible={dateModalVisible}
            setDateModalVisible={setDateModalVisible}
            designation={designation}
            setDesignation={setDesignation}
            qualification={qualification}
            setQualification={setQualification}
            doctorBlood={doctorBlood}
            setDoctorBlood={setDoctorBlood}
            specialist={specialist}
            setSpecialist={setSpecialist}
            charge={charge}
            setCharge={setCharge}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            addDoctorVisible={addDoctorVisible}
            setAddDoctorVisible={setAddDoctorVisible}
            onAddDoctorDepartmentData={() => onAddDoctorData()}
            onEditDoctorDepartmentData={id => onUpdateDoctorData(id)}
            onDeleteDepartmentData={id => onDeleteDeleteData(id)}
            setDeleteUser={setDeleteUser}
            deleteUser={deleteUser}
            avatar={avatar}
            setAvatar={setAvatar}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            statusId={statusId}
            setStatusId={setStatusId}
            doctorAction={doctorAction}
          />
        ) : selectedView == 'Doctor Departments' ? (
          <DepartmentComponent
            searchDepartment={searchDepartment}
            setSearchDepartment={setSearchDepartment}
            allData={doctorDepartmentList}
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
            onAddDoctorDepartmentData={() => onAddDoctorDepartmentData()}
            onEditDoctorDepartmentData={id => onEditDoctorDepartmentData(id)}
            onDeleteDepartmentData={id => onDeleteDepartmentData(id)}
            setDeleteUser={setDeleteUser}
            deleteUser={deleteUser}
            isLoading={isLoading}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={departmentPage}
            loading={isLoading}
            setLoading={setIsLoading}
            departmentAction={departmentAction}
          />
        ) : selectedView == 'Schedules' ? (
          <ScheduleComponent
            searchDepartment={searchSchedule}
            setSearchDepartment={setSearchSchedule}
            allData={scheduleList}
            addScheduleVisible={addScheduleVisible}
            setAddScheduleVisible={setAddScheduleVisible}
            onGetData={onGetDoctorScheduleData}
            scheduleAction={scheduleAction}
          />
        ) : selectedView == 'Doctor Holidays' ? (
          <HolidayComponent
            searchHoliday={searchHoliday}
            setSearchHoliday={setSearchHoliday}
            allData={doctorHolidayList}
            addHolidayVisible={addHolidayVisible}
            setAddHolidayVisible={setAddHolidayVisible}
            doctorName={holidayDoctor}
            setDoctorName={setHolidayDoctor}
            holidayDate={holidayDate}
            setHolidayDate={setHolidayDate}
            holidayReason={holidayReason}
            setHolidayReason={setHolidayReason}
            holidayDateModalVisible={holidayDateModalVisible}
            setHolidayDateModalVisible={setHolidayDateModalVisible}
            onAddDoctorDepartmentData={() => onAddDoctorHolidayData()}
            onDeleteDepartmentData={id => onDeleteHolidayData(id)}
            holidayStartDate={holidayStartDate}
            setHolidayStartDate={setHolidayStartDate}
            holidayEndDate={holidayEndDate}
            setHolidayEndDate={setHolidayEndDate}
            setDeleteUser={setDeleteUser}
            deleteUser={deleteUser}
            isLoading={isLoading}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={holidayPage}
            loading={isLoading}
            setLoading={setIsLoading}
            holidayAction={holidayAction}
          />
        ) : (
          selectedView == 'Breaks' && (
            <BreakComponent
              searchBreak={searchBreak}
              setSearchBreak={setSearchBreak}
              allData={doctorBreakList}
              onGetDoctorBreakData={() => onGetDoctorBreakData()}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPage={breakPage}
              loading={isLoading}
              setLoading={setIsLoading}
              breakAction={breakAction}
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

export default DoctorScreen;
