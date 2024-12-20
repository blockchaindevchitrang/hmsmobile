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
import React, {useEffect, useRef, useState} from 'react';
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
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {DeletePopup} from '../DeletePopup';
import {
  onAddAccountListApi,
  onDeleteCommonApi,
  onGetCommonApi,
  onGetEditAccountDataApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import {useSelector} from 'react-redux';

let filterArray = [
  {id: 3, name: 'All'},
  {id: 0, name: 'Active'},
  {id: 1, name: 'Discharged'},
];

let platformArray = [{id: 1, name: 'Zoom'}];

let typeArray = [
  {id: 0, name: 'OPD'},
  {id: 1, name: 'IPD'},
];

const ConsultationList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  statusId,
  setStatusId,
}) => {
  const user_data = useSelector(state => state.user_data);
  const doctorData = useSelector(state => state.doctorData);
  const bedTypeData = useSelector(state => state.bedTypeData);
  const bedData = useSelector(state => state.bedData);
  const {theme} = useTheme();
  const [newBloodIssueVisible, setNewBloodIssueVisible] = useState(false);
  const [consultationTitle, setConsultationTitle] = useState('');
  const [consultationDate, setConsultationDate] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [platformType, setPlatformType] = useState('');
  const [duration, setDuration] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [typeName, setTypeName] = useState('');
  const [numberId, setNumberId] = useState('');
  const [numberName, setNumberName] = useState('');
  const [hostVideo, setHostVideo] = useState('disabled');
  const [clientVideo, setClientVideo] = useState('disabled');
  const [description, setDescription] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCaseData, setAllCaseData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={[styles.switchView, {width: wp(40)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.ipd_number}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText1, {width: wp(28)}]}>
          {item.bed_type}
        </Text>
        <Text style={[styles.dataHistoryText1, {width: wp(32)}]}>
          {item.bed_type}
        </Text>
        <Text style={[styles.dataHistoryText1, {width: wp(35)}]}>
          {item.bed_type}
        </Text>
        <Text style={[styles.dataHistoryText1, {width: wp(35)}]}>
          {item.bed_type}
        </Text>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.patient_name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText5]}>{item.patient_email}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(30)}]}>
          <Text style={[styles.dataListText1]}>{item.bill_status}</Text>
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={() => {
              setUserId(item.id);
              setNewBloodIssueVisible(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity>
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
        </View>
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
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setFilterVisible(true)}
                style={styles.filterView1}>
                <Image style={styles.filterImage} source={filter} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setUserId('');
                  setErrorMessage('');
                  setErrorVisible(false);
                  setNewBloodIssueVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>Actions</Text>
              </TouchableOpacity>
              {/* <Menu
                              ref={menuRef}
                              onSelect={value => {
                                if (value == 'add') {
                                  setNewUserVisible(true);
                                } else {
                                  alert(`Selected number: ${value}`);
                                }
                              }}>
                              <MenuTrigger text={''} />
                              <MenuOptions style={{marginVertical: hp(0.5)}}>
                                <MenuOption value={'add'}>
                                  <Text style={styles.dataHistoryText3}>New Bed</Text>
                                </MenuOption>
                                <MenuOption value={'excel'}>
                                  <Text style={styles.dataHistoryText3}>Export to Excel</Text>
                                </MenuOption>
                              </MenuOptions>
                            </Menu> */}
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
                    <View style={styles.modalOverlay1} />
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
                          console.log('gert Value:::', selectedItem);
                        }}
                        defaultValueByIndex={statusId == 3 ? 0 : statusId + 1}
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
                          onPress={() => setStatusId(3)}
                          style={styles.resetButton}>
                          <Text style={styles.resetText}>Reset</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>
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
                  <Text style={[styles.titleText, {width: wp(40)}]}>
                    {'CONSULTATION TITLE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(28)}]}>
                    {'STATUS'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(32)}]}>
                    {'DATE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(35)}]}>
                    {'CREATED BY'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(35)}]}>
                    {'CREATED FOR'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(55), textAlign: 'left'},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(30)}]}>
                    {'PASSWORD'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(16)}]}>
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
              New Live Meeting
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
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Consultation Title:</Text>
                <TextInput
                  value={consultationTitle}
                  placeholder={'Consultation Title'}
                  onChangeText={text => setConsultationTitle(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1]}>
                  Consultation Date:
                </Text>
                <Text
                  style={[
                    styles.nameTextView,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}
                  onPress={() => setDateModalVisible(!dateModalVisible)}>
                  {moment(consultationDate).format('YYYY-MM-DD hh:mm')}
                </Text>
                <DatePicker
                  open={dateModalVisible}
                  modal={true}
                  date={consultationDate}
                  mode={'date'}
                  onConfirm={date => {
                    console.log('Console Log>>', date);
                    setDateModalVisible(false);
                    setConsultationDate(date);
                  }}
                  onCancel={() => {
                    setDateModalVisible(false);
                  }}
                />
              </View>
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Platform Type:</Text>
                <SelectDropdown
                  data={platformArray}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setPlatformType(selectedItem.name);
                    console.log('gert Value:::', selectedItem);
                  }}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {platformType != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {platformType == selectedItem?.name
                              ? selectedItem?.name
                              : platformType}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Platform'}
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
                <Text style={styles.dataHistoryText1}>Duration Minutes:</Text>
                <TextInput
                  value={duration}
                  placeholder={'Duration Minutes'}
                  onChangeText={text => setDuration(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1]}>{'Patient Name:'}</Text>
                <SelectDropdown
                  data={user_data}
                  onSelect={(selectedItem, index) => {
                    setPatientId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={patientName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {patientId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {patientId == selectedItem?.id
                              ? `${selectedItem?.patient_user?.first_name} ${selectedItem?.patient_user?.last_name}`
                              : patientName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.patient_user?.first_name ||
                              'Select Patient'}
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
                <Text style={[styles.dataHistoryText1]}>{'Doctor Name:'}</Text>
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
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1]}>{'Type:'}</Text>
                <SelectDropdown
                  data={typeArray}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setTypeId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {typeId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {typeId == selectedItem?.id
                              ? selectedItem?.name
                              : typeName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Type'}
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
                <Text style={styles.dataHistoryText1}>Type Number:</Text>
                <SelectDropdown
                  data={bedTypeData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setNumberName(selectedItem.name);
                    setNumberId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {numberId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {numberId == selectedItem?.id
                              ? selectedItem?.name
                              : numberName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Type Number'}
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
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1]}>{'Host Video:'}</Text>
                <View style={[styles.statusView, {paddingVertical: hp(1)}]}>
                  <View style={[styles.optionView, {marginLeft: wp(1)}]}>
                    <TouchableOpacity
                      onPress={() => setHostVideo('enable')}
                      style={[
                        styles.roundBorder,
                        {
                          backgroundColor:
                            hostVideo == 'enable'
                              ? COLORS.blueColor
                              : COLORS.white,
                          borderWidth: hostVideo == 'enable' ? 0 : 0.5,
                        },
                      ]}>
                      <View style={styles.round} />
                    </TouchableOpacity>
                    <Text style={styles.statusText}>Enable</Text>
                  </View>
                  <View style={[styles.optionView]}>
                    <TouchableOpacity
                      onPress={() => setHostVideo('disabled')}
                      style={[
                        styles.roundBorder,
                        {
                          backgroundColor:
                            hostVideo == 'disabled'
                              ? COLORS.blueColor
                              : COLORS.white,
                          borderWidth: hostVideo == 'disabled' ? 0 : 0.5,
                        },
                      ]}>
                      <View style={styles.round} />
                    </TouchableOpacity>
                    <Text style={styles.statusText}>Disabled</Text>
                  </View>
                </View>
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Client Video:</Text>
                <View style={[styles.statusView, {paddingVertical: hp(1)}]}>
                  <View style={[styles.optionView, {marginLeft: wp(1)}]}>
                    <TouchableOpacity
                      onPress={() => setClientVideo('enable')}
                      style={[
                        styles.roundBorder,
                        {
                          backgroundColor:
                            clientVideo == 'enable'
                              ? COLORS.blueColor
                              : COLORS.white,
                          borderWidth: clientVideo == 'enable' ? 0 : 0.5,
                        },
                      ]}>
                      <View style={styles.round} />
                    </TouchableOpacity>
                    <Text style={styles.statusText}>Enable</Text>
                  </View>
                  <View style={[styles.optionView]}>
                    <TouchableOpacity
                      onPress={() => setClientVideo('disabled')}
                      style={[
                        styles.roundBorder,
                        {
                          backgroundColor:
                            clientVideo == 'disabled'
                              ? COLORS.blueColor
                              : COLORS.white,
                          borderWidth: clientVideo == 'disabled' ? 0 : 0.5,
                        },
                      ]}>
                      <View style={styles.round} />
                    </TouchableOpacity>
                    <Text style={styles.statusText}>Disabled</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.nameView]}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText1}>Description:</Text>
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
            <View style={[styles.nameView]}>
              {errorVisible ? (
                <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => {}} style={styles.nextView}>
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
        onPress={() => {}}
        setUserId={setUserId}
        isLoading={loading}
      />
    </View>
  );
};

export default ConsultationList;

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
    width: '60%',
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
    width: '100%',
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
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalOverlay1: {
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
    marginTop: hp(25),
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
