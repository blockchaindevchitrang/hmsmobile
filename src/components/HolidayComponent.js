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
import deleteIcon from '../images/delete.png';
import editing from '../images/editing.png';
import close from '../images/close.png';
import calendar from '../images/calendar.png';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import {DeletePopup} from './DeletePopup';

const HolidayComponent = ({
  searchHoliday,
  setSearchHoliday,
  allData,
  addHolidayVisible,
  setAddHolidayVisible,
  doctorName,
  setDoctorName,
  holidayReason,
  setHolidayReason,
  holidayDate,
  setHolidayDate,
  holidayDateModalVisible,
  setHolidayDateModalVisible,
  onAddDoctorDepartmentData,
  onEditDoctorDepartmentData,
  onDeleteDepartmentData,
  setDeleteUser,
  deleteUser,
  isLoading,
  pageCount,
  setPageCount,
  totalPage,
}) => {
  const doctorData = useSelector(state => state.doctorData);
  const {theme} = useTheme();
  const [holidayStartDate, setHolidayStartDate] = useState(null);
  const [holidayEndDate, setHolidayEndDate] = useState(null);
  const [calenderVisible, setCalenderVisible] = useState(false);
  const [doctorSelectedName, setDoctorSelectedName] = useState('');
  const [editId, setEditId] = useState('');

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.email}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(27)}]}>
          {moment(new Date(item.date)).format('YYYY-MM-DD')}
        </Text>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={() => {
              setEditId(item.id);
              setDoctorName(item.doctor_id);
              setDoctorSelectedName(item.name);
              setHolidayDate(new Date(item.date));
              setHolidayReason(item.reason);
              setAddHolidayVisible(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: wp(2)}}
            onPress={() => {
              setEditId(item.id);
              setDeleteUser(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.errorColor}]}
              source={deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

  return (
    <View style={styles.safeAreaStyle}>
      {!addHolidayVisible ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          {/* <View
            style={[styles.subView, {marginVertical: hp(0), marginTop: hp(2)}]}>
            <View style={styles.fullDateView}>
              <TouchableOpacity
                style={styles.dateView}
                onPress={() => setCalenderVisible(true)}>
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
          </View> */}
          <View style={styles.subView}>
            <TextInput
              value={searchHoliday}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearchHoliday(text)}
              style={[styles.searchView, {color: theme.text}]}
            />
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setEditId('');
                  setDoctorName('');
                  setDoctorSelectedName('');
                  setHolidayDate(new Date());
                  setHolidayReason('');
                  setAddHolidayVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>Add Holiday</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View
                  style={[
                    styles.titleActiveView,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.titleText, {width: wp(45)}]}>
                    {'DOCTORS'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(25)}]}>
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
              style={styles.totalCountText}>{`Page ${pageCount} to ${Math.ceil(
              totalPage / 10,
            )}`}</Text>
            <View style={styles.prevViewData}>
              <Text
                style={[
                  styles.prevButtonView,
                  {opacity: pageCount >= Math.ceil(totalPage / 10) ? 0.7 : 1},
                ]}
                disabled={pageCount >= Math.ceil(totalPage / 10)}
                onPress={() => setPageCount(parseFloat(pageCount) + 1)}>
                {'>'}
              </Text>
              <Text
                style={[
                  styles.prevButtonView,
                  {
                    marginLeft: wp(3),
                    opacity: pageCount >= Math.ceil(totalPage / 10) ? 0.7 : 1,
                  },
                ]}
                disabled={pageCount >= Math.ceil(totalPage / 10)}
                onPress={() => setPageCount(Math.ceil(totalPage / 10))}>
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
              Doctor holidays
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
                Doctor:<Text style={styles.dataHistoryText4}>*</Text>
              </Text>
              <SelectDropdown
                data={doctorData}
                onSelect={(selectedItem, index) => {
                  // setSelectedColor(selectedItem);
                  setDoctorName(selectedItem.id);
                  console.log('gert Value:::', selectedItem);
                }}
                defaultValue={doctorSelectedName}
                renderButton={(selectedItem, isOpen) => {
                  console.log('Get Response>>>', selectedItem);
                  return (
                    <View style={styles.dropdown2BtnStyle2}>
                      {doctorName != '' ? (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {doctorName == selectedItem?.id
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
                Date
              </Text>
              <Text
                style={[
                  styles.nameTextView,
                  {width: '100%', paddingVertical: hp(1)},
                ]}
                onPress={() =>
                  setHolidayDateModalVisible(!holidayDateModalVisible)
                }>
                {moment(holidayDate).format('DD/MM/YYYY')}
              </Text>
              <DatePicker
                open={holidayDateModalVisible}
                modal={true}
                date={holidayDate}
                mode={'date'}
                onConfirm={date => {
                  console.log('Console Log>>', date);
                  setHolidayDateModalVisible(false);
                  setHolidayDate(date);
                }}
                onCancel={() => {
                  setHolidayDateModalVisible(false);
                }}
              />
            </View>
          </View>
          <View style={{width: '94%', alignSelf: 'center'}}>
            <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
              Reason
            </Text>
            <TextInput
              value={holidayReason}
              placeholder={'Reason'}
              onChangeText={text => setHolidayReason(text)}
              style={[styles.nameTextView1, {width: '100%'}]}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={
                editId != ''
                  ? () => onEditDoctorDepartmentData(editId)
                  : onAddDoctorDepartmentData
              }
              style={styles.nextView}>
              {isLoading ? (
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
      <DeletePopup
        modelVisible={deleteUser}
        setModelVisible={setDeleteUser}
        onPress={() => onDeleteDepartmentData(editId)}
        setUserId={setEditId}
        isLoading={isLoading}
      />
    </View>
  );
};

export default HolidayComponent;

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
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
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
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  activeView: {
    width: '96%',
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
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
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
    width: wp(40),
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
    width: wp(46),
  },
  switchView: {
    width: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(15),
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
  nameTextView1: {
    width: '94%',
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
    alignItems: 'center',
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
    width: '100%',
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
    width: wp(37),
    height: hp(4.2),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    marginTop: hp(1),
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
