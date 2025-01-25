import {
  Text,
  View,
  Switch,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import {COLORS, Fonts} from '../utils';
import {useTheme} from '../utils/ThemeProvider';
import ProfilePhoto from './ProfilePhoto';
import editing from '../images/editing.png';
import close from '../images/close.png';
import calendar from '../images/calendar.png';
import cancel from '../images/cancel.png';
import confirm from '../images/confirm.png';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import {
  onAddAccountListApi,
  onCancelAppointmentApi,
  onGetEditAccountDataApi,
  onGetSpecificAppointmentDataApi,
  onSuccessAppointmentApi,
} from '../services/Api';
import {StatusComponent} from './StatusComponent';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import filter from '../images/filter.png';
import useOrientation from './OrientationComponent';

const filterArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Pending'},
  {id: 3, name: 'Completed'},
  {id: 4, name: 'Canceled'},
];

const AppointmentComponent = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  holidayStartDate,
  setHolidayStartDate,
  holidayEndDate,
  setHolidayEndDate,
  pageCount,
  setPageCount,
  totalPage,
  setStatusId,
  statusId,
}) => {
  const departmentData = useSelector(state => state.departmentData);
  const doctorData = useSelector(state => state.doctorData);
  const user_data = useSelector(state => state.user_data);
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [addDoctorVisible, setAddHolidayVisible] = useState(false);
  const [doctorBreakName, setDoctorBreakName] = useState('');
  const [calenderVisible, setCalenderVisible] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [patient, setPatient] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [doctorSelectedName, setDoctorSelectedName] = useState('');
  const [departmentSelected, setDepartmentSelected] = useState('');
  const [patientSelected, setPatientSelected] = useState('');
  const [cancelModal, setCancelModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [fromPopup, setFromPopup] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  console.log('Get allData Implement:>>>', allData);
  const onCloseDate = () => {
    setHolidayStartDate(null);
    setHolidayEndDate(null);
  };

  const onDateChange = async (date, type) => {
    if (type === 'END_DATE') {
      setHolidayEndDate(date);
      setCalenderVisible(false);
    } else {
      setHolidayStartDate(date);
      setHolidayEndDate(null);
    }
  };

  const convertDate = dateString => {
    // First, remove the ordinal suffix (st, nd, rd, th) from the date string
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');

    // Use regex to manually extract the parts of the date
    const dateParts = cleanDateString.match(
      /(\d+)\s(\w+),\s(\d{4})\s(\d+):(\d+)\s(AM|PM)/,
    );

    if (!dateParts) return 'Invalid date format'; // Return an error if the date can't be parsed

    let [, day, month, year, hours, minutes, period] = dateParts;

    // Convert month name to number
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = monthNames.indexOf(month) + 1;

    // Convert 12-hour format to 24-hour format
    if (period === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }

    // Ensure two-digit formatting for day, month, hours, minutes
    const formattedMonth = String(monthIndex).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Return the date in 'YYYY-MM-DD HH:MM:SS' format
    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:00`;
  };

  const onConfirmAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await onSuccessAppointmentApi(userId);

      if (response.status === 200) {
        onGetData();
        setLoading(false);
        setCancelModal(false);
        showMessage({
          message: 'Appointment Confirm Successfully',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      showMessage({
        message: 'Something is wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      setLoading(false);
      console.log('Error>>', err.response.data);
    }
  };

  const onCancelAppointmentData = async () => {
    try {
      setLoading(true);
      const response = await onCancelAppointmentApi(userId);

      if (response.status === 200) {
        onGetData();
        setLoading(false);
        setCancelModal(false);
        showMessage({
          message: 'Appointment Cancel Successfully',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      setLoading(false);
      showMessage({
        message: 'Something is wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error>>', err.response.data);
    }
  };

  const onEditAccountData = async () => {
    try {
      setLoading(true);
      let dataUrl = `appointment-update/${userId}?patient_id=${patient}&doctor_id=${doctor}&department_id=${department}&opd_date=${dateOfBirth}&problem=${description}&is_completed=${
        status ? 1 : 0
      }`;
      const response = await onGetEditAccountDataApi(dataUrl);

      if (response.status === 200) {
        onGetData();
        setLoading(false);
        setAddHolidayVisible(false);
        showMessage({
          message: 'Account Edit Successfully',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      setLoading(false);
      showMessage({
        message: 'Something is wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error>>', err.response.data);
    }
  };

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificAppointmentDataApi(id);
      if (response.status == 200) {
        console.log('get ValueLL:::', response.data.data);
        return response.data.data;
      } else {
        return 0;
      }
    } catch (err) {
      console.log('Get Error', err);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={[styles.nameDataView]}>
          {item.doctor_name && (
            <ProfilePhoto
              username={item.patient_name}
              style={styles.photoStyle}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.patient_email}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          {item.doctor_name && (
            <ProfilePhoto
              username={item.doctor_name}
              style={styles.photoStyle}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.doctor_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.doctor_email}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(30)}]}>
          <Text style={[styles.dataListText2]}>{item.department}</Text>
        </View>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(30) : wp(22)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text
              style={[styles.dataListText1, {textAlign: 'center'}]}
              numberOfLines={2}>
              {convertDate(item.date)}
            </Text>
          </View>
        </View>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(24) : wp(20)}]}>
          <View
            style={[
              styles.dateBox1,
              {
                backgroundColor:
                  item.status == 1
                    ? COLORS.lightColor
                    : item.status == 0
                    ? COLORS.lightPrimary3
                    : COLORS.errorBG,
                width: isPortrait ? wp(20) : wp(16),
              },
            ]}>
            <Text
              style={[
                styles.dataListText1,
                {
                  color:
                    item.status == 1
                      ? theme.headerColor
                      : item.status == 0
                      ? COLORS.shadowColor
                      : COLORS.orange,
                  fontFamily: Fonts.FONTS.PoppinsSemiBold,
                },
              ]}>
              {item.status == 1
                ? 'Confirm'
                : item.status == 0
                ? 'Pending'
                : 'Cancelled'}
            </Text>
          </View>
        </View>
        {(item.status == 1 || item.status == 0) && (
          <View
            style={[styles.switchView, {width: isPortrait ? wp(20) : wp(12)}]}>
            {item.status != 1 && (
              <TouchableOpacity
                onPress={() => {
                  setFromPopup('cancel');
                  setUserId(item.id);
                  setCancelModal(true);
                }}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.errorColor}]}
                  source={cancel}
                />
              </TouchableOpacity>
            )}
            {item.status != 1 && (
              <TouchableOpacity
                onPress={() => {
                  setFromPopup('confirm');
                  setUserId(item.id);
                  setCancelModal(true);
                }}>
                <Image
                  style={[
                    styles.editImage,
                    {
                      tintColor: COLORS.blueColor,
                      marginHorizontal: isPortrait ? wp(2) : wp(0.5),
                    },
                  ]}
                  source={confirm}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={async () => {
                let allData = await onGetSpecificDoctor(item.id);
                setUserId(item.id);
                setDoctor(allData?.doctor_id);
                setDepartment(allData?.department_id);
                setPatient(allData?.patient_id);
                setDepartmentSelected(item.department);
                setDoctorSelectedName(item.doctor_name);
                setPatientSelected(item.patient_name);
                setDescription(allData.problem);
                setStatus(item.status == 0 ? false : true);
                setAddHolidayVisible(true);
              }}>
              <Image
                style={[styles.editImage, {tintColor: COLORS.blueColor}]}
                source={editing}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const onAddAppointmentData = async () => {
    try {
      let dataUrl = `appointment-create?patient_id=${patient}&doctor_id=${doctor}&department_id=${department}&opd_date=${dateOfBirth}&problem=${description}&is_completed=${
        status ? 1 : 0
      }`;
      const response = await onAddAccountListApi(dataUrl);

      if (response.status === 200) {
        onGetData();
        setAddHolidayVisible(false);
      }
    } catch (err) {
      console.log('Error>>', err.response.data);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!addDoctorVisible ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View
            style={[styles.subView, {marginVertical: hp(0), marginTop: hp(2), zIndex: 1}]}>
            <View style={[styles.fullDateView]}>
              <TouchableOpacity
                style={styles.dateView}
                onPress={() => setCalenderVisible(!calenderVisible)}>
                <Text style={styles.startDateText}>
                  {holidayStartDate == null
                    ? 'Start date'
                    : moment(holidayStartDate).format('YYYY-MM-DD')}
                </Text>
                <Text style={styles.startDateText}>{'->'}</Text>
                <View style={styles.calenderImage}>
                  <Text style={styles.startDateText}>
                    {holidayEndDate == null
                      ? 'End date'
                      : moment(holidayEndDate).format('YYYY-MM-DD')}
                  </Text>
                  {holidayStartDate == null && holidayEndDate == null ? (
                    <Image source={calendar} style={styles.closeImage} />
                  ) : (
                    <TouchableOpacity onPress={() => onCloseDate()}>
                      <Image source={close} style={styles.closeImage} />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            {calenderVisible && (
              <View style={styles.calenderView}>
                <CalendarPicker
                  startFromMonday={true}
                  allowRangeSelection={true}
                  minDate={new Date(2017, 6, 3)}
                  maxDate={new Date()}
                  todayBackgroundColor="#f2e6ff"
                  selectedDayColor="#7300e6"
                  selectedDayTextColor="#FFFFFF"
                  onDateChange={onDateChange}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.filterView1}
              onPress={() => setFilterVisible(true)}>
              <Image style={styles.filterImage} source={filter} />
            </TouchableOpacity>
            <Modal
              animationType="none"
              transparent={true}
              visible={filterVisible}
              onRequestClose={() => setFilterVisible(false)}>
              <View style={styles.filterModal}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setFilterVisible(false);
                  }}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.filterFirstView}>
                  <Text style={styles.filterTitle}>Filter Options</Text>
                  <View style={styles.secondFilterView}>
                    <Text style={styles.secondTitleFilter}>Status:</Text>
                    <SelectDropdown
                      data={filterArray}
                      onSelect={(selectedItem, index) => {
                        // setSelectedColor(selectedItem);
                        setStatusId(selectedItem.id);
                        // setStatusShow(
                        //   selectedItem.id == 2
                        //     ? 'pending'
                        //     : selectedItem.id == 3
                        //     ? 'completed'
                        //     : selectedItem.id == 4
                        //     ? 'cancelled'
                        //     : '',
                        // );
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValue={doctorSelectedName}
                      defaultValueByIndex={statusId - 1}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View style={styles.dropdown2BtnStyle2}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select'}
                            </Text>
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                    <View>
                      <TouchableOpacity
                        onPress={() => setStatusId(1)}
                        style={styles.resetButton}>
                        <Text style={styles.resetText}>Reset</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.subView}>
            <TextInput
              value={searchBreak}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearchBreak(text)}
              style={[styles.searchView, {color: theme.text}]}
            />
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setAddHolidayVisible(true)}
                style={[
                  styles.actionView,
                  {height: isPortrait ? hp(4.7) : hp(4)},
                ]}>
                <Text style={styles.actionText}>New Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
            <ScrollView
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}>
              <View>
                <View
                  style={[
                    styles.titleActiveView,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(37)},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(37)},
                    ]}>
                    {'DOCTORS'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(30)}]}>
                    {'DOCTORS DEPARTMENT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(30) : wp(22)},
                    ]}>
                    {'DATE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(24) : wp(20)},
                    ]}>
                    {'STATUS'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(20) : wp(12)},
                    ]}>
                    {'ACTION'}
                  </Text>
                </View>
                <View style={styles.mainDataView}>
                  <FlatList
                    data={allData}
                    renderItem={renderItem}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={allData.length}
                    nestedScrollEnabled
                    virtualized
                    ListEmptyComponent={() => (
                      <View key={0} style={styles.ListEmptyView}>
                        <Text style={styles.emptyText}>
                          {'No record found'}
                        </Text>
                      </View>
                    )}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={styles.nextView1}>
            <View style={styles.prevViewData}>
              <Text
                style={[
                  styles.prevButtonView,
                  {opacity: pageCount == '1' ? 0.7 : 1},
                ]}
                disabled={pageCount == '1'}
                onPress={() => setPageCount('1')}>
                {'<<'}
              </Text>
              <Text
                style={[
                  styles.prevButtonView,
                  {marginLeft: wp(3), opacity: pageCount == '1' ? 0.7 : 1},
                ]}
                disabled={pageCount == '1'}
                onPress={() => setPageCount(parseFloat(pageCount) - 1)}>
                {'<'}
              </Text>
            </View>
            <Text
              style={
                styles.totalCountText
              }>{`Page ${pageCount} to ${totalPage}`}</Text>
            <View style={styles.prevViewData}>
              <Text
                style={[
                  styles.prevButtonView,
                  {opacity: pageCount >= totalPage ? 0.7 : 1},
                ]}
                disabled={pageCount >= totalPage}
                onPress={() => setPageCount(parseFloat(pageCount) + 1)}>
                {'>'}
              </Text>
              <Text
                style={[
                  styles.prevButtonView,
                  {
                    marginLeft: wp(3),
                    opacity: pageCount >= totalPage ? 0.7 : 1,
                  },
                ]}
                disabled={pageCount >= totalPage}
                onPress={() => setPageCount(totalPage)}>
                {'>>'}
              </Text>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <Text style={[styles.doctorText, {color: theme.text}]}>
              Create Appointment
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setAddHolidayVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.nameView}>
            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Patient:<Text style={styles.dataHistoryText4}>*</Text>
              </Text>
              {/* <TextInput
                value={patient}
                placeholder={'Select'}
                onChangeText={text => setPatient(text)}
                style={[styles.nameTextView, {width: '100%'}]}
              /> */}
              <SelectDropdown
                data={user_data}
                onSelect={(selectedItem, index) => {
                  // setSelectedColor(selectedItem);
                  setPatient(selectedItem.id);
                  console.log('gert Value:::', selectedItem);
                }}
                defaultValue={patientSelected}
                renderButton={(selectedItem, isOpen) => {
                  console.log('Get Response>>>', selectedItem);
                  return (
                    <View style={styles.dropdown2BtnStyle2}>
                      {patient != '' ? (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {patient == selectedItem?.id
                            ? `${selectedItem?.patient_user?.first_name} ${selectedItem?.patient_user?.last_name}`
                            : patientSelected}
                        </Text>
                      ) : (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {selectedItem?.patient_user?.first_name || 'Select'}
                        </Text>
                      )}
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                renderItem={(item, index, isSelected) => {
                  return (
                    <TouchableOpacity style={styles.dropdownView}>
                      <Text style={styles.dropdownItemTxtStyle}>
                        {`${item?.patient_user?.first_name} ${item?.patient_user?.last_name}`}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                dropdownIconPosition={'left'}
                dropdownStyle={styles.dropdown2DropdownStyle}
              />
            </View>

            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Doctor Department:<Text style={styles.dataHistoryText4}>*</Text>
              </Text>
              {/* <TextInput
                value={department}
                placeholder={'Select'}
                onChangeText={text => setDepartment(text)}
                style={[styles.nameTextView, {width: '100%'}]}
              /> */}
              <SelectDropdown
                data={departmentData}
                onSelect={(selectedItem, index) => {
                  // setSelectedColor(selectedItem);
                  setDepartment(selectedItem.id);
                  console.log('gert Value:::', selectedItem);
                }}
                defaultValue={departmentSelected}
                renderButton={(selectedItem, isOpen) => {
                  console.log('Get Response>>>', selectedItem);
                  return (
                    <View style={styles.dropdown2BtnStyle2}>
                      {department != '' ? (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {department == selectedItem?.id
                            ? selectedItem?.title
                            : departmentSelected}
                        </Text>
                      ) : (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {selectedItem?.title || 'Select'}
                        </Text>
                      )}
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                renderItem={(item, index, isSelected) => {
                  return (
                    <TouchableOpacity style={styles.dropdownView}>
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                dropdownIconPosition={'left'}
                dropdownStyle={styles.dropdown2DropdownStyle}
              />
            </View>
          </View>
          <View style={styles.nameView}>
            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Doctor:<Text style={styles.dataHistoryText4}>*</Text>
              </Text>
              {/* <TextInput
                value={doctor}
                placeholder={'Select'}
                onChangeText={text => setDoctor(text)}
                style={[styles.nameTextView, {width: '100%'}]}
              /> */}
              <SelectDropdown
                data={doctorData}
                onSelect={(selectedItem, index) => {
                  // setSelectedColor(selectedItem);
                  setDoctor(selectedItem.id);
                  console.log('gert Value:::', selectedItem);
                }}
                defaultValue={doctorSelectedName}
                renderButton={(selectedItem, isOpen) => {
                  console.log('Get Response>>>', selectedItem);
                  return (
                    <View style={styles.dropdown2BtnStyle2}>
                      {doctor != '' ? (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {doctor == selectedItem?.id
                            ? selectedItem?.name
                            : doctorSelectedName}
                        </Text>
                      ) : (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {selectedItem?.name || 'Select'}
                        </Text>
                      )}
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                renderItem={(item, index, isSelected) => {
                  return (
                    <TouchableOpacity style={styles.dropdownView}>
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                dropdownIconPosition={'left'}
                dropdownStyle={styles.dropdown2DropdownStyle}
              />
            </View>

            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                DATE:<Text style={styles.dataHistoryText4}>*</Text>
              </Text>
              <Text
                style={[
                  styles.nameTextView,
                  {width: '100%', paddingVertical: hp(1)},
                ]}
                onPress={() => setDateModalVisible(!dateModalVisible)}>
                {moment(dateOfBirth).format('DD/MM/YYYY')}
              </Text>
              <DatePicker
                open={dateModalVisible}
                modal={true}
                date={dateOfBirth}
                mode={'date'}
                onConfirm={date => {
                  console.log('Console Log>>', date);
                  setDateModalVisible(false);
                  setDateOfBirth(date);
                }}
                onCancel={() => {
                  setDateModalVisible(false);
                }}
              />
            </View>
          </View>
          <View style={styles.nameView}>
            <View style={{width: '48%'}}>
              <Text style={styles.dataHistoryText1}>Description:</Text>
              <TextInput
                value={description}
                placeholder={'Enter Description...'}
                onChangeText={text => setDescription(text)}
                style={[styles.commentTextInput]}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={{width: '48%', alignItems: 'flex-start'}}>
              <Text style={styles.dataHistoryText1}>Status:</Text>
              <Switch
                trackColor={{
                  false: status ? COLORS.greenColor : COLORS.errorColor,
                  true: status ? COLORS.greenColor : COLORS.errorColor,
                }}
                thumbColor={status ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={COLORS.errorColor}
                onValueChange={() => setStatus(!status)}
                value={status}
              />
            </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => {
                userId != '' ? onEditAccountData() : onAddAppointmentData();
              }}
              style={styles.nextView}>
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.nextText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAddHolidayVisible(false)}
              style={styles.prevView}>
              <Text style={styles.prevText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <StatusComponent
        modelVisible={cancelModal}
        setModelVisible={setCancelModal}
        onPress={() => {
          fromPopup == 'confirm'
            ? onConfirmAppointmentData()
            : onCancelAppointmentData();
        }}
        setUserId={setUserId}
        isLoading={loading}
      />
    </View>
  );
};

export default AppointmentComponent;

const portraitStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp(3),
    marginVertical: hp(2),
    zIndex: -1,
  },
  searchView: {
    width: '47%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.9),
    color: COLORS.black,
    borderRadius: 5,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterView1: {
    height: hp(5),
    width: hp(5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
  },
  filterImage: {
    width: wp(6),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  actionView: {
    height: hp(5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  actionText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(1.9),
    color: COLORS.white,
  },
  activeView: {
    width: '92%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(0.5),
    borderRadius: wp(3),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  titleActiveView: {
    width: '100%',
    height: hp(5),
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp(1),
    paddingBottom: hp(0.5),
  },
  titleText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  photoStyle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataHistoryText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(47),
  },
  dataHistoryText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  dataHistoryText3: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingVertical: hp(0.5),
  },
  dataHistoryText4: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(55),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  actionDataView: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  editImage: {
    width: wp(4),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  backButtonView: {
    height: hp(4),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange,
  },
  backText: {
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    fontSize: hp(1.8),
    color: COLORS.white,
  },
  doctorText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.3),
    color: COLORS.black,
  },
  profileView: {
    width: '94%',
    backgroundColor: '#eeeeee',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  nameTextView: {
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.white,
  },
  nameView: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    marginVertical: hp(2),
    alignSelf: 'center',
  },
  contactView: {
    width: '94%',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  buttonView: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nextView: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  nextText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  prevView: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGreyColor,
    marginLeft: wp(2),
  },
  prevText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  dataListText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    textAlign: 'center',
  },
  dataListText2: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.blueColor,
    textAlign: 'center',
  },
  dateBox1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
  },
  startDateText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greyColor,
  },
  fullDateView: {
    width: '88%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateView: {
    width: '90%',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLORS.greyColor,
    paddingVertical: hp(0.7),
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
  closeImage: {
    width: wp(5),
    height: hp(2),
    resizeMode: 'contain',
    tintColor: COLORS.greyColor,
    marginLeft: wp(2),
  },
  calenderImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calenderView: {
    backgroundColor: COLORS.white,
    width: '100%',
    position: 'absolute',
    padding: 5,
    zIndex: 1,
    borderRadius: 5,
    top: hp(4),
    left: wp(2),
  },
  statusText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  optionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
  },
  roundBorder: {
    height: wp(4),
    width: wp(4),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    marginRight: wp(1.5),
  },
  round: {
    height: wp(1.5),
    width: wp(1.5),
    borderRadius: wp(1.5),
    backgroundColor: COLORS.white,
  },
  ListEmptyView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(15),
  },
  emptyText: {
    fontSize: hp(2.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  commentTextInput: {
    width: '100%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    height: hp(10),
    marginTop: hp(1),
  },
  dropdown2DropdownStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    height: hp(25),
    // borderRadius: 12,
  },
  dropdownItemTxtStyle: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    marginLeft: wp(2),
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(4),
    borderBottomWidth: 0,
  },
  dropdown2BtnStyle2: {
    width: '100%',
    height: hp(4.2),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    marginTop: hp(1),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  filterModal: {
    flex: 1,
    alignItems: 'flex-end',
  },
  filterFirstView: {
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: hp(17),
    marginRight: wp(2),
  },
  filterTitle: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    padding: hp(2),
    borderBottomWidth: 0.5,
  },
  secondFilterView: {
    padding: hp(2),
  },
  secondTitleFilter: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  resetButton: {
    width: wp(22),
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.greyColor,
    marginTop: hp(2),
    borderRadius: 5,
  },
  resetText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  nextView1: {
    width: '92%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(3),
  },
  prevViewData: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButtonView: {
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.headerGreenColor,
    paddingVertical: hp(0.5),
    borderRadius: 5,
    fontSize: hp(3),
    color: COLORS.white,
  },
  totalCountText: {
    fontSize: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
  },
});

const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp(3),
    marginVertical: hp(2),
    zIndex: -1,
  },
  searchView: {
    width: '40%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.9),
    color: COLORS.black,
    borderRadius: 5,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterView1: {
    height: hp(4),
    width: hp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
  },
  filterImage: {
    width: wp(5),
    height: hp(2.5),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  actionView: {
    height: hp(5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  actionText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(1.8),
    color: COLORS.white,
  },
  activeView: {
    width: '96%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(0.5),
    borderRadius: wp(1.5),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  titleActiveView: {
    width: '100%',
    height: hp(5),
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp(1),
    paddingBottom: hp(0.5),
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
  },
  titleText: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  photoStyle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataHistoryText: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(33),
  },
  dataHistoryText2: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  dataHistoryText3: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    paddingVertical: hp(0.5),
  },
  dataHistoryText4: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(1.5),
    borderBottomRightRadius: wp(1.5),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(37),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  actionDataView: {
    width: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  editImage: {
    width: wp(4),
    height: hp(2),
    resizeMode: 'contain',
  },
  backButtonView: {
    height: hp(4),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.orange,
  },
  backText: {
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    fontSize: hp(1.8),
    color: COLORS.white,
  },
  doctorText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.3),
    color: COLORS.black,
  },
  profileView: {
    width: '94%',
    backgroundColor: '#eeeeee',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  nameTextView: {
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.white,
  },
  nameView: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    marginVertical: hp(2),
    alignSelf: 'center',
  },
  contactView: {
    width: '94%',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  buttonView: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  nextView: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  nextText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  prevView: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGreyColor,
    marginLeft: wp(2),
  },
  prevText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  dataListText1: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    textAlign: 'center',
  },
  dataListText2: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.blueColor,
    textAlign: 'center',
  },
  dateBox1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
  },
  startDateText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greyColor,
  },
  fullDateView: {
    width: '88%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateView: {
    width: '45.5%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    paddingVertical: hp(0.5),
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
  },
  closeImage: {
    width: wp(5),
    height: hp(2),
    resizeMode: 'contain',
    tintColor: COLORS.greyColor,
    marginLeft: wp(2),
  },
  calenderImage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calenderView: {
    backgroundColor: COLORS.white,
    width: '100%',
    position: 'absolute',
    padding: 5,
    zIndex: 1,
    borderRadius: 5,
    top: hp(4),
    left: wp(2),
  },
  statusText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  optionView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
  },
  roundBorder: {
    height: wp(4),
    width: wp(4),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    marginRight: wp(1.5),
  },
  round: {
    height: wp(1.5),
    width: wp(1.5),
    borderRadius: wp(1.5),
    backgroundColor: COLORS.white,
  },
  ListEmptyView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(15),
  },
  emptyText: {
    fontSize: hp(2.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  commentTextInput: {
    width: '100%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    height: hp(10),
    marginTop: hp(1),
  },
  dropdown2DropdownStyle: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    height: hp(25),
    // borderRadius: 12,
  },
  dropdownItemTxtStyle: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    marginLeft: wp(2),
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(4),
    borderBottomWidth: 0,
  },
  dropdown2BtnStyle2: {
    width: '100%',
    height: hp(4.2),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    marginTop: hp(1),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  filterModal: {
    flex: 1,
    alignItems: 'flex-end',
  },
  filterFirstView: {
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: hp(17),
    marginRight: wp(2),
  },
  filterTitle: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    padding: hp(2),
    borderBottomWidth: 0.5,
  },
  secondFilterView: {
    padding: hp(2),
  },
  secondTitleFilter: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  resetButton: {
    width: wp(22),
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.greyColor,
    marginTop: hp(2),
    borderRadius: 5,
  },
  resetText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  nextView1: {
    width: '96%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp(3),
  },
  prevViewData: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButtonView: {
    paddingHorizontal: wp(1.5),
    backgroundColor: COLORS.headerGreenColor,
    paddingVertical: hp(0.5),
    borderRadius: 5,
    fontSize: hp(2.6),
    color: COLORS.white,
  },
  totalCountText: {
    fontSize: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
  },
});
