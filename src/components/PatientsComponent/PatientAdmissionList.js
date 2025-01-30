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
  Platform,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from './../ProfilePhoto';
import moment from 'moment';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import filter from '../../images/filter.png';
import man from '../../images/man.png';
import draw from '../../images/draw.png';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
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
import RNFS from 'react-native-fs';
import useOrientation from '../OrientationComponent';

const filterArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Active'},
  {id: 3, name: 'Deactive'},
];

const PatientAdmissionList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  pageCount,
  setPageCount,
  totalPage,
  statusId,
  setStatusId,
  admissionAction,
}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const user_data = useSelector(state => state.user_data);
  const doctorData = useSelector(state => state.doctorData);
  const bedData = useSelector(state => state.bedData);
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [packageId, setPackageId] = useState('');
  const [packageName, setPackageName] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [bedId, setBedId] = useState('');
  const [bedName, setBedName] = useState('');
  const [policyNo, setPolicyNo] = useState('');
  const [agentName, setAgentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');
  const [guardianContact, setGuardianContact] = useState('');
  const [guardianAddress, setGuardianAddress] = useState('');
  const [admissionDate, setAdmissionDate] = useState(new Date());
  const [status, setStatus] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [insuranceList, setInsuranceList] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onGetInsuranceData();
    onGetPackageData();
  }, []);

  const onGetInsuranceData = async () => {
    try {
      const response = await onGetCommonApi('insurance-get');
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setInsuranceList(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  const onGetPackageData = async () => {
    try {
      const response = await onGetCommonApi('package-get');
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setPackageList(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  const onAddPayRollData = async () => {
    try {
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter patient.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const urlData = `patient-admissions-create?patient_id=${patientId}&doctor_id=${doctorId}&package_id=${packageId}&insurance_id=${insuranceId}&bed_id=${bedId}&admission_date=${moment(
          admissionDate,
        ).format(
          'YYYY-MM-DD',
        )}&policy_no=${policyNo}&agent_name=${agentName}&guardian_name=${guardianName}&status=${
          status ? 1 : 0
        }&guardian_relation=${guardianRelation}&guardian_contact=${guardianContact}&guardian_address=${guardianAddress}`;
        const response = await onAddAccountListApi(urlData);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
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
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter patient.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const urlData = `patient-admissions-update/${userId}?patient_id=${patientId}&doctor_id=${doctorId}&package_id=${packageId}&insurance_id=${insuranceId}&bed_id=${bedId}&admission_date=${moment(
          admissionDate,
        ).format(
          'YYYY-MM-DD',
        )}&policy_no=${policyNo}&agent_name=${agentName}&guardian_name=${guardianName}&status=${
          status ? 1 : 0
        }&guardian_relation=${guardianRelation}&guardian_contact=${guardianContact}&guardian_address=${guardianAddress}`;
        const response = await onGetEditAccountDataApi(urlData);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
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
      const response = await onDeleteCommonApi(
        `patient-admissions-delete/${id}`,
      );
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
      const response = await onGetSpecificCommonApi(
        `patient-admissions-edit/${id}`,
      );
      if (response.data.flag == 1) {
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
          style={[styles.switchView, {width: isPortrait ? wp(32) : wp(22)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>
              {item.patient_admission_id}
            </Text>
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
          style={[styles.switchView, {width: isPortrait ? wp(30) : wp(22)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.admission_date}</Text>
          </View>
        </View>
        {item.discharge_date == 'N/A' ? (
          <Text
            style={[
              styles.dataHistoryText,
              {width: isPortrait ? wp(32) : wp(24)},
            ]}>
            {item.discharge_date}
          </Text>
        ) : (
          <View
            style={[styles.switchView, {width: isPortrait ? wp(32) : wp(24)}]}>
            <View
              style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
              <Text style={[styles.dataHistoryText1]}>
                {item.discharge_date}
              </Text>
            </View>
          </View>
        )}
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(32) : wp(20)},
          ]}>
          {item.package}
        </Text>
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(30) : wp(22)},
          ]}>
          {item.insurance}
        </Text>
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(32) : wp(22)},
          ]}>
          {item.policy_no}
        </Text>
        {admissionAction.includes('status') && (
          <View
            style={[styles.switchView, {width: isPortrait ? wp(20) : wp(12)}]}>
            <Switch
              trackColor={{
                false: item.status == 1 ? COLORS.greenColor : COLORS.errorColor,
                true: item.status == 1 ? COLORS.greenColor : COLORS.errorColor,
              }}
              thumbColor={item.status == 1 ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor={COLORS.errorColor}
              onValueChange={() => {}}
              value={item.status == 1}
            />
          </View>
        )}
        {admissionAction.includes('edit') ||
        admissionAction.includes('delete') ? (
          <View style={styles.actionDataView}>
            {admissionAction.includes('edit') && (
              <TouchableOpacity
                onPress={async () => {
                  let allDatas = await onGetSpecificDoctor(item.id);
                  setUserId(item.id);
                  setPatientId(allDatas.patient_id);
                  setPatientName(item.patient_name);
                  setAdmissionDate(new Date(allDatas.admission_date));
                  setDoctorId(allDatas.doctor_id);
                  setDoctorName(item.doctor_name);
                  setBedId(allDatas.bed_id);
                  setBedName(item.bed);
                  setInsuranceId(allDatas.case_id);
                  setInsuranceName(
                    item.insurance_id != null ? item.insurance_id : '',
                  );
                  setPackageId(allDatas.package_id);
                  setPackageName(item.package);
                  setStatus(status == 0 ? false : true);
                  setAgentName(allDatas.agent_name);
                  setGuardianName(allDatas.guardian_name);
                  setGuardianRelation(allDatas.guardian_relation);
                  setGuardianContact(allDatas.guardian_contact);
                  setGuardianAddress(allDatas.guardian_address);
                  const accountantData1 = bedData.filter(
                    user => user.id === allDatas.bed_id,
                  );
                  setNewUserVisible(true);
                }}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.blueColor}]}
                  source={editing}
                />
              </TouchableOpacity>
            )}
            {admissionAction.includes('delete') && (
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

  const onPatientAdmissionExcelGet = async () => {
    try {
      const response = await onGetCommonApi('export-patient-admissions');
      console.log('Get Repsonse Income:::', response.data.data);
      if (response.data.flag == 1) {
        var filename = response.data.data.substring(
          response.data.data.lastIndexOf('/') + 1,
        );
        const downloadPath = `${RNFS.DownloadDirectoryPath}/${filename}`;

        const result = await RNFS.downloadFile({
          fromUrl: response.data.data,
          toFile: downloadPath,
        }).promise;

        if (result.statusCode === 200) {
          showMessage({
            message: 'File Downloaded Successfully',
            type: 'success',
            duration: 3000,
          });
          console.log('File downloaded successfully to:', downloadPath);
        } else {
          showMessage({
            message: 'File download failed.',
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
          console.log('File download failed:', result.statusCode);
        }
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!newUserVisible ? (
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
                style={styles.filterView1}
                onPress={() => setFilterVisible(true)}>
                <Image style={styles.filterImage} source={filter} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (menuRef.current) {
                    menuRef.current.open(); // Open the menu on button press
                  }
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>Action</Text>
              </TouchableOpacity>
              <Menu
                ref={menuRef}
                onSelect={value => {
                  if (value == 'add') {
                    setNewUserVisible(true);
                  } else {
                    onPatientAdmissionExcelGet();
                  }
                }}>
                <MenuTrigger text={''} />
                <MenuOptions style={{marginVertical: hp(0.5)}}>
                  {admissionAction.includes('create') && (
                    <MenuOption value={'add'}>
                      <Text style={styles.dataHistoryText3}>
                        New Patient Admission
                      </Text>
                    </MenuOption>
                  )}
                  <MenuOption value={'excel'}>
                    <Text style={styles.dataHistoryText3}>Export to Excel</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
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
                          console.log('gert Value:::', selectedItem);
                        }}
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
                      {width: isPortrait ? wp(32) : wp(22)},
                    ]}>
                    {'ADMISSION ID'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(37), textAlign: 'left'},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(37), textAlign: 'left'},
                    ]}>
                    {'DOCTORS'}
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
                      {width: isPortrait ? wp(32) : wp(24)},
                    ]}>
                    {'DISCHARGE DATE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(32) : wp(20)},
                    ]}>
                    {'PACKAGE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(30) : wp(22)},
                    ]}>
                    {'INSURANCE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(32) : wp(22)},
                    ]}>
                    {'POLICY NUMBER'}
                  </Text>
                  {admissionAction.includes('status') && (
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(20) : wp(12)},
                      ]}>
                      {'STATUS'}
                    </Text>
                  )}
                  {admissionAction.includes('edit') ||
                  admissionAction.includes('delete') ? (
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(16) : wp(10)},
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
              New Patient Admission
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setNewUserVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
          {isPortrait ? (
            <View style={styles.profileView}>
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Patient:</Text>
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
                  <Text style={styles.dataHistoryText6}>Admission Date:</Text>
                  <Text
                    style={[
                      styles.nameTextView,
                      {width: '100%', paddingVertical: hp(1)},
                    ]}
                    onPress={() => setDateModalVisible(!dateModalVisible)}>
                    {moment(admissionDate).format('DD/MM/YYYY')}
                  </Text>
                  <DatePicker
                    open={dateModalVisible}
                    modal={true}
                    date={admissionDate}
                    mode={'date'}
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
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Package:</Text>
                  <SelectDropdown
                    data={packageList}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setPackageId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={packageName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {packageId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {packageId == selectedItem?.id
                                ? selectedItem?.name
                                : packageName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Package'}
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
                  <Text style={styles.dataHistoryText6}>Insurance:</Text>
                  <SelectDropdown
                    data={insuranceList}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setInsuranceId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={insuranceName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {insuranceId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {insuranceId == selectedItem?.id
                                ? selectedItem?.name
                                : insuranceName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Insurance'}
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
                  <Text style={styles.dataHistoryText6}>Bed:</Text>
                  <SelectDropdown
                    data={bedData}
                    disabled={bedData.length > 0 ? false : true}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setBedId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={bedName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View
                          style={[
                            styles.dropdown2BtnStyle2,
                            {
                              backgroundColor:
                                bedData.length > 0 ? '#fff' : '#c2c2c2',
                            },
                          ]}>
                          {bedId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {bedId == selectedItem?.id
                                ? selectedItem?.name
                                : bedName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Choose Bed'}
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
                  <Text style={styles.dataHistoryText6}>Policy No:</Text>
                  <TextInput
                    value={policyNo}
                    placeholder={'Policy No'}
                    onChangeText={text => setPolicyNo(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Agent Name:</Text>
                  <TextInput
                    value={agentName}
                    placeholder={'Agent Name'}
                    onChangeText={text => setAgentName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Guardian Name:</Text>
                  <TextInput
                    value={guardianName}
                    placeholder={'Guardian Name'}
                    onChangeText={text => setGuardianName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>
                    Guardian Relation:
                  </Text>
                  <TextInput
                    value={guardianRelation}
                    placeholder={'Guardian Relation'}
                    onChangeText={text => setGuardianRelation(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Guardian Contact:</Text>
                  <TextInput
                    value={guardianContact}
                    placeholder={'Guardian Contact'}
                    onChangeText={text => setGuardianContact(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Guardian Address:</Text>
                  <TextInput
                    value={guardianAddress}
                    placeholder={'Guardian Address'}
                    onChangeText={text => setGuardianAddress(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText6}>STATUS:</Text>
                  <View style={styles.statusView}>
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
              </View>
              <View style={[styles.nameView]}>
                {errorVisible ? (
                  <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.profileView}>
              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Patient:</Text>
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

                <View style={{width: '32%'}}>
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
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                    dropdownIconPosition={'left'}
                    dropdownStyle={styles.dropdown2DropdownStyle}
                  />
                </View>

                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Admission Date:</Text>
                  <Text
                    style={[
                      styles.nameTextView,
                      {width: '100%', paddingVertical: hp(0.5)},
                    ]}
                    onPress={() => setDateModalVisible(!dateModalVisible)}>
                    {moment(admissionDate).format('DD/MM/YYYY')}
                  </Text>
                  <DatePicker
                    open={dateModalVisible}
                    modal={true}
                    date={admissionDate}
                    mode={'date'}
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

              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Package:</Text>
                  <SelectDropdown
                    data={packageList}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setPackageId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={packageName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {packageId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {packageId == selectedItem?.id
                                ? selectedItem?.name
                                : packageName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Package'}
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
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Insurance:</Text>
                  <SelectDropdown
                    data={insuranceList}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setInsuranceId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={insuranceName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {insuranceId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {insuranceId == selectedItem?.id
                                ? selectedItem?.name
                                : insuranceName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Insurance'}
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
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Bed:</Text>
                  <SelectDropdown
                    data={bedData}
                    disabled={bedData.length > 0 ? false : true}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setBedId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={bedName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View
                          style={[
                            styles.dropdown2BtnStyle2,
                            {
                              backgroundColor:
                                bedData.length > 0 ? '#fff' : '#c2c2c2',
                            },
                          ]}>
                          {bedId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {bedId == selectedItem?.id
                                ? selectedItem?.name
                                : bedName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Choose Bed'}
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
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Policy No:</Text>
                  <TextInput
                    value={policyNo}
                    placeholder={'Policy No'}
                    onChangeText={text => setPolicyNo(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Agent Name:</Text>
                  <TextInput
                    value={agentName}
                    placeholder={'Agent Name'}
                    onChangeText={text => setAgentName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Guardian Name:</Text>
                  <TextInput
                    value={guardianName}
                    placeholder={'Guardian Name'}
                    onChangeText={text => setGuardianName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>
                    Guardian Relation:
                  </Text>
                  <TextInput
                    value={guardianRelation}
                    placeholder={'Guardian Relation'}
                    onChangeText={text => setGuardianRelation(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Guardian Contact:</Text>
                  <TextInput
                    value={guardianContact}
                    placeholder={'Guardian Contact'}
                    onChangeText={text => setGuardianContact(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Guardian Address:</Text>
                  <TextInput
                    value={guardianAddress}
                    placeholder={'Guardian Address'}
                    onChangeText={text => setGuardianAddress(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText6}>STATUS:</Text>
                  <View style={[styles.statusView, {marginTop: hp(1)}]}>
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
              </View>
              <View style={[styles.nameView]}>
                {errorVisible ? (
                  <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
                ) : null}
              </View>
            </View>
          )}
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
              onPress={() => setNewUserVisible(false)}
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

export default PatientAdmissionList;

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
    textAlign: 'left',
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
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
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
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
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
    justifyContent: 'center',
    marginHorizontal: wp(2),
    alignItems: 'flex-start',
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: hp(1),
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
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
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
    width: wp(33),
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
    width: wp(37),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(24),
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(10),
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
    width: '96%',
    paddingVertical: hp(1),
    // paddingHorizontal: wp(3),
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
    fontSize: hp(1.9),
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
    marginVertical: hp(1),
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
    height: hp(3.7),
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
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: hp(13),
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
    fontSize: hp(2.5),
    color: COLORS.white,
  },
  totalCountText: {
    fontSize: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
  },
});
