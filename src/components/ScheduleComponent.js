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
import deleteIcon from '../images/delete.png';
import editing from '../images/editing.png';
import view from '../images/view.png';
import ProfilePhoto from './ProfilePhoto';
import SelectDropdown from 'react-native-select-dropdown';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {DeletePopup} from './DeletePopup';
import {
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetCommonApi,
  onGetEditAccountDataApi,
  onGetEditCommonJsonApi,
  onGetSpecificCommonApi,
} from '../services/Api';
import {useSelector} from 'react-redux';

const ScheduleComponent = ({
  searchDepartment,
  setSearchDepartment,
  allData,
  onGetData,
  addScheduleVisible,
  setAddScheduleVisible,
}) => {
  const doctorData = useSelector(state => state.doctorData);
  const {theme} = useTheme();
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [admissionDate, setAdmissionDate] = useState(null);
  const [viewSchedule, setViewSchedule] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [parameterArray, setParameterArray] = useState([
    {
      name: 'Monday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
    {
      name: 'Tuesday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
    {
      name: 'Wednesday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
    {
      name: 'Thursday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
    {
      name: 'Friday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
    {
      name: 'Saturday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
    {
      name: 'Sunday',
      from: null,
      to: null,
      fromVisible: false,
      toVisible: false,
    },
  ]);

  const onAddPayRollData = async () => {
    try {
      if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else if (admissionDate == null) {
        setErrorVisible(true);
        setErrorMessage('Please select Per Patient Time.');
      } else {
        const allUnselected = parameterArray.every(
          day => day.from === null && day.to === null,
        );
        if (allUnselected) {
          setErrorVisible(true);
          setErrorMessage(
            'Please select available times for at least one day.',
          );
          return false;
        }

        const missingToTime = parameterArray.find(
          day => day.from !== null && day.to === null,
        );
        if (missingToTime) {
          setErrorVisible(true);
          setErrorMessage(
            `Please select available "to" time for ${missingToTime.name}.`,
          );
          return false;
        }
        setLoading(true);
        setErrorVisible(false);
        const scheduleDays = parameterArray.map(day => ({
          day: day.name,
          from: moment(day.from).format('HH:mm:ss'),
          to: moment(day.to).format('HH:mm:ss'),
        }));

        const urlData = 'store-schedule';
        let raw = JSON.stringify({
          doctor_id: doctorId,
          per_patient_time: admissionDate,
          schedule_days: scheduleDays,
        });
        console.log('Get Login Url:::', raw);
        const response = await onAddCommonJsonApi(urlData, raw);
        // const response = await onAddAccountListApi(urlData);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setAddScheduleVisible(false);
          showMessage({
            message: 'Record Added Successfully',
            type: 'success',
            duration: 3000,
          });
        } else {
          setLoading(false);
          showMessage({
            message: response.data.message,
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        }
      }
    } catch (err) {
      if (err.response.data.message) {
        showMessage({
          message: err.response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: 'Something want wrong.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      setLoading(false);
      console.log('Error:', err);
    }
  };

  const onEditPayRollData = async () => {
    try {
      if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else if (admissionDate == null) {
        setErrorVisible(true);
        setErrorMessage('Please select Per Patient Time.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const allUnselected = parameterArray.every(
          day => day.from === null && day.to === null,
        );
        if (allUnselected) {
          setErrorVisible(true);
          setErrorMessage(
            'Please select available times for at least one day.',
          );
          return false;
        }

        const missingToTime = parameterArray.find(
          day => day.from !== null && day.to === null,
        );
        if (missingToTime) {
          setErrorVisible(true);
          setErrorMessage(
            `Please select available "to" time for ${missingToTime.name}.`,
          );
          return false;
        }
        setLoading(true);
        setErrorVisible(false);
        const scheduleDays = parameterArray.map(day => ({
          day: day.name,
          from: moment(day.from).format('HH:mm:ss'),
          to: moment(day.to).format('HH:mm:ss'),
        }));

        const urlData = `update-schedule/${userId}`;
        let raw = JSON.stringify({
          doctor_id: doctorId,
          per_patient_time: admissionDate,
          schedule_days: scheduleDays,
        });
        // const response = await onGetEditAccountDataApi(urlData);
        const response = await onGetEditCommonJsonApi(urlData, raw);
        console.log('Get Error::', response.data);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setAddScheduleVisible(false);
          showMessage({
            message: 'Record Edit Successfully',
            type: 'success',
            duration: 3000,
          });
        } else {
          setLoading(false);
          showMessage({
            message: response.data.message,
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        }
      }
    } catch (err) {
      setLoading(false);
      if (err.response.data.message) {
        showMessage({
          message: err.response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: 'Something want wrong.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      console.log('Error:', err);
    }
  };

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificCommonApi(
        `pathology-test-edit/${id}`,
      );
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
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.doctor_name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.doctor_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.doctor_email}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(25)}]}>
          {item.per_patient_time}
        </Text>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={() => {
              setAddScheduleVisible(false);
              setViewSchedule(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: theme.headerColor}]}
              source={view}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setUserId(item.id);
              setDoctorName(item.doctor_name);
              setAdmissionDate(moment(new Date()).format('hh:mm:ss'));
              setAddScheduleVisible(true);
            }}
            style={{marginLeft: wp(2)}}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleConfirm = (index, date, from) => {
    const updatedArray = [...parameterArray];
    if (from == 'from') {
      updatedArray[index].from = date;
      updatedArray[index].fromVisible = false;
    } else {
      updatedArray[index].to = date;
      updatedArray[index].toVisible = false;
    }
    setParameterArray(updatedArray);
    setRefresh(!refresh);
  };

  const handleCancel = (index, from) => {
    const updatedArray = [...parameterArray];
    if (from == 'from') {
      updatedArray[index].fromVisible = false;
    } else {
      updatedArray[index].toVisible = false;
    }
    setParameterArray(updatedArray);
    setRefresh(!refresh);
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!viewSchedule ? (
        !addScheduleVisible ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <View style={styles.subView}>
              <TextInput
                value={searchDepartment}
                placeholder={'Search'}
                placeholderTextColor={theme.text}
                onChangeText={text => setSearchDepartment(text)}
                style={[styles.searchView, {color: theme.text}]}
              />
              <View style={styles.filterView}>
                <TouchableOpacity
                  onPress={() => {
                    setDoctorId('');
                    setDoctorName('');
                    setAdmissionDate(null);
                    setParameterArray([
                      {
                        name: 'Monday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Tuesday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Wednesday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Thursday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Friday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Saturday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Sunday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                    ]);
                    setDateModalVisible(false);
                    setAddScheduleVisible(true);
                  }}
                  style={styles.actionView}>
                  <Text style={styles.actionText}>New Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
              <View>
                <View
                  style={[
                    styles.titleActiveView,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.titleText, {width: wp(44)}]}>
                    {'DOCTOR'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(23)}]}>
                    {'PER PATIENT TIME'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(15)}]}>
                    {'ACTION'}
                  </Text>
                </View>
                <View style={styles.mainDataView}>
                  <FlatList
                    data={allData}
                    renderItem={renderItem}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
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
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <View style={styles.subView}>
              <Text style={[styles.doctorText, {color: theme.text}]}>
                {userId != '' ? 'Edit Schedule' : 'Add Schedule'}
              </Text>
              <View style={styles.filterView}>
                <TouchableOpacity
                  onPress={() => {
                    setParameterArray([
                      {
                        name: 'Monday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Tuesday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Wednesday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Thursday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Friday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Saturday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                      {
                        name: 'Sunday',
                        from: null,
                        to: null,
                        fromVisible: false,
                        toVisible: false,
                      },
                    ]);
                    setAddScheduleVisible(false);
                  }}
                  style={styles.backButtonView}>
                  <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileView}>
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>Doctor:</Text>
                  <SelectDropdown
                    data={doctorData}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setDoctorId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={doctorName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {doctorId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {doctorId == selectedItem?.id
                                ? selectedItem?.name
                                : doctorName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Doctor'}
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
                  <Text style={styles.dataHistoryText1}>Per Patient Time:</Text>
                  <Text
                    style={[
                      styles.nameTextView,
                      {width: '100%', paddingVertical: hp(1)},
                    ]}
                    onPress={() => setDateModalVisible(!dateModalVisible)}>
                    {admissionDate != null
                      ? moment(admissionDate).format('hh:mm:ss')
                      : 'Per Patient Time'}
                  </Text>
                  <DatePicker
                    open={dateModalVisible}
                    modal={true}
                    date={admissionDate || new Date()}
                    mode={'time'}
                    is24hourSource={'locale'}
                    onConfirm={date => {
                      console.log('Console Log>>', date);
                      setDateModalVisible(false);
                      setAdmissionDate(date);
                    }}
                    onCancel={() => {
                      setDateModalVisible(false);
                    }}
                  />
                </View>
              </View>
              <View style={styles.parameterView}>
                <Text
                  style={[styles.monthText, {width: '30%', marginLeft: wp(1)}]}>
                  Available On:
                </Text>
                <Text style={[styles.monthText, {width: '33%'}]}>
                  Available From:
                </Text>
                <Text style={[styles.monthText, {width: '33%'}]}>
                  Available To:
                </Text>
              </View>
              <FlatList
                data={parameterArray}
                renderItem={({item, index}) => {
                  return (
                    <View
                      style={{
                        backgroundColor:
                          index % 2 == 0 ? '#eeeeee' : COLORS.white,
                        paddingBottom: hp(1),
                        marginVertical: hp(1),
                      }}>
                      <View style={styles.nameView}>
                        <View style={styles.monthName}>
                          <Text style={[styles.monthText, {width: '100%'}]}>
                            {item.name}
                          </Text>
                        </View>

                        <View style={{width: '33%'}}>
                          <Text
                            style={[styles.fromTimeText, {width: '100%'}]}
                            onPress={() => {
                              parameterArray[index].fromVisible = true;
                              setRefresh(!refresh);
                            }}>
                            {item.from
                              ? moment(item.from).format('HH:mm:ss')
                              : '00:00:00'}
                          </Text>
                          <DatePicker
                            open={item.fromVisible}
                            modal={true}
                            date={item.from || new Date()}
                            mode={'time'}
                            is24hourSource={'locale'}
                            onConfirm={date =>
                              handleConfirm(index, date, 'from')
                            }
                            onCancel={() => handleCancel(index, 'from')}
                          />
                        </View>

                        <View style={{width: '33%'}}>
                          <Text
                            style={[styles.fromTimeText, {width: '100%'}]}
                            onPress={() => {
                              setRefresh(!refresh);
                              parameterArray[index].toVisible = true;
                            }}>
                            {item.to
                              ? moment(item.to).format('HH:mm:ss')
                              : '00:00:00'}
                          </Text>
                          <DatePicker
                            open={item.toVisible}
                            modal={true}
                            date={item.to || new Date()}
                            mode={'time'}
                            is24hourSource={'locale'}
                            onConfirm={date => handleConfirm(index, date, 'to')}
                            onCancel={() => handleCancel(index, 'to')}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{paddingBottom: hp(3)}}
              />
              {errorVisible ? (
                <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
              ) : null}
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => {
                  userId != '' ? onEditPayRollData() : onAddPayRollData();
                }}
                style={styles.nextView}>
                {loading ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={styles.nextText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAddScheduleVisible(false);
                }}
                style={styles.prevView}>
                <Text style={styles.prevText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <Text style={[styles.doctorText, {color: theme.text}]}>
              {'Schedule Details'}
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setParameterArray([
                    {
                      name: 'Monday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                    {
                      name: 'Tuesday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                    {
                      name: 'Wednesday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                    {
                      name: 'Thursday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                    {
                      name: 'Friday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                    {
                      name: 'Saturday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                    {
                      name: 'Sunday',
                      from: null,
                      to: null,
                      fromVisible: false,
                      toVisible: false,
                    },
                  ]);
                  setAddScheduleVisible(true);
                }}
                style={styles.backButtonView}>
                <Text style={styles.backText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setViewSchedule(false);
                }}
                style={styles.prevView}>
                <Text style={styles.prevText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileView}>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Doctor</Text>
                <Text
                  style={[
                    styles.nameTextVie1,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}>
                  {admissionDate != null
                    ? moment(admissionDate).format('hh:mm:ss')
                    : 'Per Patient Time'}
                </Text>
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Per Patient Time</Text>
                <Text
                  style={[
                    styles.nameTextVie1,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}>
                  {admissionDate != null
                    ? moment(admissionDate).format('hh:mm:ss')
                    : 'Per Patient Time'}
                </Text>
              </View>
            </View>

            {/* <View style={styles.subView}> */}
            <Text
              style={[
                styles.doctorText,
                {color: theme.text, marginTop: hp(2)},
              ]}>
              {'Schedule'}
            </Text>
            {/* </View> */}
            <View style={styles.parameterView1}>
              <Text
                style={[styles.monthText, {width: '30%', marginLeft: wp(1)}]}>
                Available On
              </Text>
              <Text style={[styles.monthText, {width: '33%'}]}>
                Available From
              </Text>
              <Text style={[styles.monthText, {width: '33%'}]}>
                Available To
              </Text>
            </View>
            <FlatList
              data={parameterArray}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      backgroundColor:
                        index % 2 == 0 ? COLORS.white : '#eeeeee',
                      paddingBottom: hp(1),
                    }}>
                    <View style={styles.nameView1}>
                      <View style={styles.monthName1}>
                        <Text style={[styles.monthText, {width: '100%'}]}>
                          {item.name}
                        </Text>
                      </View>

                      <View style={{width: '33%'}}>
                        <Text style={[styles.fromTimeText1, {width: '100%'}]}>
                          {item.from
                            ? moment(item.from).format('HH:mm:ss')
                            : '00:00:00'}
                        </Text>
                      </View>

                      <View style={{width: '33%'}}>
                        <Text style={[styles.fromTimeText1, {width: '100%'}]}>
                          {item.to
                            ? moment(item.to).format('HH:mm:ss')
                            : '00:00:00'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{paddingBottom: hp(3)}}
            />
            {errorVisible ? (
              <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default ScheduleComponent;

const styles = StyleSheet.create({
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
  },
  searchView: {
    width: '47%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionView: {
    height: hp(5),
    paddingHorizontal: wp(1.5),
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
    width: '94%',
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
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  dataHistoryText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(35),
  },
  dataHistoryText2: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  dataHistoryText4: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
  },
  dataHistoryText: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginHorizontal: wp(2),
    textAlign: 'center',
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
    width: wp(44),
  },
  actionDataView: {
    width: wp(15),
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  editImage: {
    width: wp(4),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  container: {
    width: '94%',
    // height: hp(22),
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerView: {
    width: '96%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  headerText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.black,
  },
  closeImage: {
    width: wp(3.5),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  eventTextInput: {
    width: '92%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: hp(3),
  },
  commentTextInput: {
    width: '92%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    height: hp(14),
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.5),
    width: '92%',
    alignSelf: 'center',
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
  buttonView: {
    width: '94%',
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(2),
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
    width: '100%',
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
  nameTextVie1: {
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.lightGrey,
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: hp(1),
    alignSelf: 'center',
  },
  nameView1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
  },
  contactView: {
    width: '94%',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  dataListText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    textAlign: 'left',
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateView: {
    width: '80%',
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
  profilePhotoView: {
    borderWidth: 0.5,
    marginTop: hp(1),
  },
  profileImage: {
    width: wp(28),
    height: hp(13.5),
    resizeMode: 'contain',
  },
  editView: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    position: 'absolute',
    zIndex: 1,
    right: -wp(3),
    top: -hp(2),
    backgroundColor: COLORS.white,
  },
  editImage1: {
    width: wp(3),
    height: hp(2.5),
    resizeMode: 'contain',
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
    height: hp(5),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    marginTop: hp(1),
    alignSelf: 'center',
  },
  parameterView: {
    width: '100%',
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
    marginTop: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  parameterView1: {
    width: '100%',
    backgroundColor: '#eeeeee',
    paddingVertical: hp(2),
    marginTop: hp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthName: {
    width: '30%',
    paddingHorizontal: wp(2),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.lightGrey,
    height: hp(4.7),
    justifyContent: 'center',
  },
  monthName1: {
    width: '30%',
    paddingHorizontal: wp(2),
    borderRadius: 5,
    marginTop: hp(1),
    // backgroundColor: COLORS.lightGrey,
    height: hp(4.7),
    justifyContent: 'center',
  },
  monthText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
  },
  fromTimeText: {
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.2),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.white,
  },
  fromTimeText1: {
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1.2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
  },
});
