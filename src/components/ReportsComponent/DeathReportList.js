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
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from '../ProfilePhoto';
import filter from '../../images/filter.png';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import moment from 'moment';
import man from '../../images/man.png';
import draw from '../../images/draw.png';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import {
  onAddAccountListApi,
  onDeleteCommonApi,
  onGetEditAccountDataApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import useOrientation from '../OrientationComponent';

const DeathReportList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  deathAction,
}) => {
  const orientation = useOrientation();
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const caseData = useSelector(state => state.caseData);
  const doctorData = useSelector(state => state.doctorData);
  const {theme} = useTheme();
  const [newBloodIssueVisible, setNewBloodIssueVisible] = useState(false);
  const [caseId, setCaseId] = useState('');
  const [caseName, setCaseName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(true);
  const [description, setDescription] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddPayRollData = async () => {
    try {
      if (caseId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient case.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else {
        setLoading(true);
        setErrorVisible(false);

        const urlData = `death-report-store?case_id=${caseId}&doctor_id=${doctorId}&date=${moment(
          dateOfBirth,
        ).format('YYYY-MM-DD')}&description=${description}`;
        const response = await onAddAccountListApi(urlData);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewBloodIssueVisible(false);
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
      if (caseId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient case.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const urlData = `death-report-update/${userId}?case_id=${caseId}&doctor_id=${doctorId}&date=${moment(
          dateOfBirth,
        ).format('YYYY-MM-DD')}&description=${description}`;
        const response = await onGetEditAccountDataApi(urlData);
        // const response = await onGetEditCommonJsonApi(urlData, raw);
        console.log('Get Error::', response.data);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewBloodIssueVisible(false);
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

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(`death-report-delete/${id}`);
      if (response.data.flag == 1) {
        onGetData();
        setLoading(false);
        setDeleteUser(false);
        showMessage({
          message: 'Record Delete Successfully',
          type: 'success',
          duration: 3000,
        });
      } else {
        setLoading(false);
        setDeleteUser(false);
        showMessage({
          message: response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
    } catch (err) {
      setLoading(false);
      setDeleteUser(false);
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
      console.log('Get Error', err);
    }
  };

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificCommonApi(`death-report-edit/${id}`);
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
        <View
          style={[styles.switchView, {width: isPortrait ? wp(30) : wp(24)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.case_id}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          {item.patient_name && (
            <ProfilePhoto
              style={styles.photoStyle}
              username={item.patient_name}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText5]}>{item.patient_email}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          {item.doctor_name && (
            <ProfilePhoto
              style={styles.photoStyle}
              username={item.doctor_name}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.doctor_name}</Text>
            <Text style={[styles.dataHistoryText5]}>{item.doctor_email}</Text>
          </View>
        </View>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(35) : wp(30)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>{item.date}</Text>
          </View>
        </View>
        {deathAction.includes('edit') || deathAction.includes('delete') ? (
          <View style={styles.actionDataView}>
            {deathAction.includes('edit') && (
              <TouchableOpacity
                onPress={async () => {
                  let allDatas = await onGetSpecificDoctor(item.id);
                  setUserId(item.id);
                  setCaseId(item.case_id);
                  setCaseName(`${item.case_id} ${item.patient_name}`);
                  setDoctorId(allDatas.doctor_id);
                  setDoctorName(item.doctor_name);
                  setDescription(allDatas.description);
                  setDateOfBirth(new Date(allDatas.date));
                  setNewBloodIssueVisible(true);
                }}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.blueColor}]}
                  source={editing}
                />
              </TouchableOpacity>
            )}
            {deathAction.includes('delete') && (
              <TouchableOpacity
                onPress={() => {
                  setUserId(item.id);
                  setDeleteUser(true);
                }}
                style={{marginLeft: wp(2)}}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.errorColor}]}
                  source={deleteIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!newBloodIssueVisible ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <TextInput
              value={searchBreak}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearchBreak(text)}
              style={[styles.searchView, {color: theme.text}]}
            />
            {!isPortrait && (
              <View style={styles.filterView}>
                {deathAction.includes('create') && (
                  <TouchableOpacity
                    onPress={() => {
                      setUserId('');
                      setCaseId('');
                      setCaseName('');
                      setDoctorId('');
                      setDoctorName('');
                      setDescription('');
                      setDateOfBirth(new Date());
                      setErrorMessage('');
                      setErrorVisible(false);
                      setNewBloodIssueVisible(true);
                    }}
                    style={styles.actionView}>
                    <Text style={styles.actionText}>New Death Reports</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {isPortrait && (
            <View style={styles.filterView}>
              {deathAction.includes('create') && (
                <TouchableOpacity
                  onPress={() => {
                    setUserId('');
                    setCaseId('');
                    setCaseName('');
                    setDoctorId('');
                    setDoctorName('');
                    setDescription('');
                    setDateOfBirth(new Date());
                    setErrorMessage('');
                    setErrorVisible(false);
                    setNewBloodIssueVisible(true);
                  }}
                  style={styles.actionView}>
                  <Text style={styles.actionText}>New Death Reports</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
                      {width: isPortrait ? wp(30) : wp(24)},
                    ]}>
                    {'CASE ID'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(40), textAlign: 'left'},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(40), textAlign: 'left'},
                    ]}>
                    {'DOCTORS'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(35) : wp(30)},
                    ]}>
                    {'DATE'}
                  </Text>
                  {deathAction.includes('edit') ||
                  deathAction.includes('delete') ? (
                    <Text
                      style={[
                        styles.titleText,
                        {width: wp(16), textAlign: 'center'},
                      ]}>
                      {'ACTION'}
                    </Text>
                  ) : null}
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
              Create Death Report
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setNewBloodIssueVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileView}>
            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText6}>Case:</Text>
                <SelectDropdown
                  data={caseData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setCaseId(selectedItem.case_id);
                    setCaseName(
                      `${selectedItem?.case_id} ${selectedItem?.patient_name}`,
                    );
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={caseName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {caseId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {caseId == selectedItem?.case_id
                              ? `${selectedItem?.case_id} ${selectedItem?.patient_name}`
                              : caseName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.case_id +
                              selectedItem?.patient_name || 'Select Case'}
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
                          {`${item?.case_id} ${item?.patient_name}`}
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
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText6}>Doctor:</Text>
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
                          {item?.name}
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
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText6}>Date:</Text>
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
                  maximumDate={new Date()}
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
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText6}>Description:</Text>
                <TextInput
                  value={description}
                  placeholder={'Description'}
                  onChangeText={text => setDescription(text)}
                  style={[styles.commentTextInput]}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
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
              onPress={() => setNewBloodIssueVisible(false)}
              style={styles.prevView}>
              <Text style={styles.prevText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <DeletePopup
        modelVisible={deleteUser}
        setModelVisible={setDeleteUser}
        onPress={() => onDeletePayrollData(userId)}
        setUserId={setUserId}
        isLoading={loading}
      />
    </View>
  );
};

export default DeathReportList;

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
  },
  photoStyle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchView: {
    width: '100%',
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
    justifyContent: 'flex-end',
    paddingHorizontal: wp(3),
    paddingBottom: hp(1),
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
    // textAlign: 'center',
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
    marginHorizontal: wp(2),
  },
  dataHistoryText6: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
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
  dataHistoryText5: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(45),
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(16),
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
    width: '100%',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  nameTextView: {
    width: '100%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
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
    marginVertical: hp(1.5),
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
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  commentTextInput: {
    width: '100%',
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
    marginTop: hp(1),
  },
  titleText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    textAlign: 'left',
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
    height: hp(5),
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
  },
  photoStyle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'flex-end',
    // paddingHorizontal: wp(3),
    // paddingBottom: hp(1),
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
    height: hp(4),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  actionText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2),
    color: COLORS.white,
  },
  activeView: {
    width: '96%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(0.5),
    borderRadius: wp(1),
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
    // textAlign: 'center',
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
    marginHorizontal: wp(2),
  },
  dataHistoryText6: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
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
  dataHistoryText5: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(40),
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(1),
    borderBottomRightRadius: wp(1),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(40),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(24),
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(16),
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
    width: '100%',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    alignSelf: 'center',
    borderRadius: wp(2),
  },
  nameTextView: {
    width: '100%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
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
    width: '100%',
    marginVertical: hp(1.5),
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
    height: hp(4),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGreyColor,
    marginLeft: wp(2),
  },
  prevText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2),
    color: COLORS.white,
  },
  dataListText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
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
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  commentTextInput: {
    width: '100%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    height: hp(10),
    marginTop: hp(1),
  },
  titleText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    textAlign: 'left',
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
    height: hp(5),
    borderBottomWidth: 0,
  },
  dropdown2BtnStyle2: {
    width: '100%',
    height: hp(4),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    marginTop: hp(1),
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
    fontSize: hp(2.5),
    color: COLORS.white,
  },
  totalCountText: {
    fontSize: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
  },
});
