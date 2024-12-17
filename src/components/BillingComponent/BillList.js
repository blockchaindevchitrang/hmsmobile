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
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
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
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetEditCommonJsonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {DeletePopup} from '../DeletePopup';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';

const BillList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
}) => {
  const admissionData = useSelector(state => state.admissionData);
  const {theme} = useTheme();
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [admissionId, setAdmissionId] = useState('');
  const [admissionName, setAdmissionName] = useState('');
  const [billDate, setBillDate] = useState(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [patientEmail, setPatientEmail] = useState('');
  const [patientGender, setPatientGender] = useState('female');
  const [doctorName, setDoctorName] = useState('');
  const [doctorBOD, setDoctorBOD] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [packageName, setPackageName] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [totalDays, setTotalDays] = useState('0');
  const [policyNo, setPolicyNo] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [parameterArray, setParameterArray] = useState([
    {
      itemName: '',
      qty: '',
      price: '',
      amount: '',
    },
  ]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddPayRollData = async () => {
    try {
      if (admissionId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient admission.');
      } else if (billDate == null) {
        setErrorVisible(true);
        setErrorMessage('Please select bill date.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let itemName = [];
        let qtyArray = [];
        let price = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (!item.itemName || !item.qty || !item.price) {
            hasEmptyFields = true;
          } else {
            itemName.push(item.itemName);
            qtyArray.push(item.qty);
            price.push(item.price);
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage(
            'Please fill in all parameter IDs and patient results.',
          );
          showMessage({
            message: 'Please fill in all parameter IDs and patient results.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }

        let raw = JSON.stringify({
          bill_date: billDate,
          patient_admission_id: admissionId,
          item_name: itemName,
          qty: qtyArray,
          price: price,
        });
        const urlData = 'bills-create';
        console.log('Get Login Url:::', raw);
        const response = await onAddCommonJsonApi(urlData, raw);
        // const response = await onAddAccountListApi(urlData);
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
      if (admissionId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient admission.');
      } else if (billDate == null) {
        setErrorVisible(true);
        setErrorMessage('Please enter bill date.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let itemName = [];
        let qtyArray = [];
        let price = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (!item.itemName || !item.qty) {
            hasEmptyFields = true;
          } else {
            itemName.push(item.itemName);
            qtyArray.push(item.qty);
            price.push(item.price);
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage('Please fill in all item data.');
          showMessage({
            message: 'Please fill in all item data.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }
        let raw = JSON.stringify({
          bill_date: billDate,
          patient_admission_id: admissionId,
          item_name: itemName,
          qty: qtyArray,
          price: price,
        });
        const urlData = `bills-update/${userId}`;
        // const response = await onGetEditAccountDataApi(urlData);
        const response = await onGetEditCommonJsonApi(urlData, raw);
        console.log('Get Error::', response.data);
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
      const response = await onDeleteCommonApi(`bills-delete/${id}`);
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
      const response = await onGetSpecificCommonApi(`bills-edit/${id}`);
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
        <View style={[styles.nameDataView, {width: wp(26)}]}>
          <Text style={[styles.dataHistoryText2]}>{item.bill_id}</Text>
        </View>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text numberOfLines={2} style={[styles.dataHistoryText5]}>
              {item.email}
            </Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(24)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={styles.dataListText1}>{item.status}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(28)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={styles.dataListText1} numberOfLines={2}>
              {item.bill_date}
            </Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(24)}]}>
          {item.amount}
        </Text>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let allDatas = await onGetSpecificDoctor(item.id);
              console.log('gert Value:::', allDatas);
              setUserId(item.id);
              setAdmissionId(allDatas.patientadmission.patient_admission_id);
              setBillDate(new Date(allDatas.bill.bill_date));
              setAdmissionDate(
                new Date(allDatas.patientadmission.admission_date),
              );
              setDischargeDate(
                new Date(allDatas.patientadmission.discharge_date),
              );
              setAdmissionName(
                allDatas.patientadmission.patient_admission_id + item.name,
              );
              setPatientEmail(item.email);
              // setPackageName(item.);
              setPolicyNo(allDatas.patientadmission.policy_no);
              let dataValue = [];
              allDatas.bill.bill_items.map(item1 => {
                dataValue.push({
                  itemName: item1.item_name,
                  qty: JSON.stringify(item1.qty),
                  price: JSON.stringify(item1.price),
                  amount: JSON.stringify(item1.amount),
                });
              });
              setParameterArray(dataValue);
              setNewUserVisible(true);
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

  const onSelectedAdmission = async data => {
    try {
      let allDatas = await onGetSpecificCommonApi(
        `patient-admissions-edit/${data.id}`,
      );
      console.log('gert Value:::', allDatas.data.data);
      setAdmissionId(data.patient_admission_id);
      setPatientEmail(data.patient_email);
      setDoctorName(data.doctor_name);
      setAdmissionDate(data.admission_date);
      setDischargeDate(data.discharge_date);
      setPolicyNo(data.policy_no);
      setPackageName(data.package);
      // let response = await onGetSpecificCommonApi(
      //   `package-edit/${allDatas.data.data.package_id}`,
      // );
      // console.log('Get Value of data::', response.data);
    } catch (err) {
      console.log('Error Admission:', err.response);
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
                onPress={() => {
                  setUserId('');
                  setParameterArray([
                    {
                      itemName: '',
                      qty: '',
                      price: '',
                      amount: '',
                    },
                  ]);
                  setAdmissionId('');
                  setBillDate(new Date());
                  setPatientEmail('');
                  setDoctorName('');
                  setAdmissionDate('');
                  setDischargeDate('');
                  setPolicyNo('');
                  setPackageName('');
                  setErrorMessage('');
                  setErrorVisible(false);
                  setNewUserVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>New Bill</Text>
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
                  <Text style={[styles.titleText, {width: wp(26)}]}>
                    {'Bill ID'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(55)}]}>
                    {'Patient'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'Status'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(28)}]}>
                    {'Bill Date'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'AMOUNT'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(18)}]}>
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
              New Bill
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setNewUserVisible(false);
                }}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileView}>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Admission ID:</Text>
                <SelectDropdown
                  data={admissionData}
                  onSelect={(selectedItem, index) =>
                    onSelectedAdmission(selectedItem)
                  }
                  defaultValue={admissionName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {admissionId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {admissionId == selectedItem?.patient_admission_id
                              ? `${selectedItem?.patient_admission_id} ${selectedItem?.patient_name}`
                              : admissionName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.patient_admission_id ||
                              'Select Admission'}
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
                          {`${item?.patient_admission_id} ${item?.patient_name}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  dropdownIconPosition={'left'}
                  dropdownStyle={styles.dropdown2DropdownStyle}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Bill Date:</Text>
                <Text
                  style={[
                    styles.nameTextView,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}
                  onPress={() => setDateModalVisible(!dateModalVisible)}>
                  {billDate ? moment(billDate).format('hh:mm:ss') : 'Bill Date'}
                </Text>
                <DatePicker
                  open={dateModalVisible}
                  modal={true}
                  date={billDate || new Date()}
                  onConfirm={date => {
                    console.log('Console Log>>', date);
                    setDateModalVisible(false);
                    setBillDate(date);
                  }}
                  onCancel={() => {
                    setDateModalVisible(false);
                  }}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Patient Email:</Text>
                <TextInput
                  value={patientEmail}
                  editable={false}
                  placeholder={'Patient Email'}
                  onChangeText={text => setPatientEmail(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Patient Gender:</Text>
                <View style={[styles.statusView, {paddingVertical: hp(1)}]}>
                  <View style={[styles.optionView]}>
                    <TouchableOpacity
                      onPress={() => setPatientGender('female')}
                      style={[
                        styles.roundBorder,
                        {
                          backgroundColor:
                            patientGender == 'female'
                              ? COLORS.blueColor
                              : COLORS.white,
                          borderWidth: patientGender == 'female' ? 0 : 0.5,
                        },
                      ]}>
                      <View style={styles.round} />
                    </TouchableOpacity>
                    <Text style={styles.statusText}>Female</Text>
                  </View>
                  <View style={[styles.optionView]}>
                    <TouchableOpacity
                      onPress={() => setPatientGender('male')}
                      style={[
                        styles.roundBorder,
                        {
                          backgroundColor:
                            patientGender == 'male'
                              ? COLORS.blueColor
                              : COLORS.white,
                          borderWidth: patientGender == 'male' ? 0 : 0.5,
                        },
                      ]}>
                      <View style={styles.round} />
                    </TouchableOpacity>
                    <Text style={styles.statusText}>Male</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Patient DOB:</Text>
                <TextInput
                  value={doctorBOD}
                  editable={false}
                  placeholder={'Patient DOB'}
                  onChangeText={text => setDoctorBOD(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Doctor:</Text>
                <TextInput
                  value={doctorName}
                  editable={false}
                  placeholder={'Doctor'}
                  onChangeText={text => setDoctorName(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Admission Date:</Text>
                <TextInput
                  value={admissionDate}
                  editable={false}
                  placeholder={'Admission Date'}
                  onChangeText={text => setAdmissionDate(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Discharge Date:</Text>
                <TextInput
                  value={dischargeDate}
                  editable={false}
                  placeholder={'Discharge Date'}
                  onChangeText={text => setDischargeDate(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Package Name:</Text>
                <TextInput
                  value={packageName}
                  editable={false}
                  placeholder={'Package Name'}
                  onChangeText={text => setPackageName(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Insurance Name:</Text>
                <TextInput
                  value={insuranceName}
                  editable={false}
                  placeholder={'Insurance Name'}
                  onChangeText={text => setInsuranceName(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Total Days:</Text>
                <TextInput
                  value={totalDays}
                  placeholder={'Total Days'}
                  onChangeText={text => setTotalDays(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                  editable={false}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Policy No:</Text>
                <TextInput
                  value={policyNo}
                  placeholder={'Policy No'}
                  onChangeText={text => setPolicyNo(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                  editable={false}
                />
              </View>
            </View>
            <View style={styles.parameterView}>
              <Text style={styles.parameterText}>ITEMS</Text>
              <TouchableOpacity
                onPress={() => {
                  let NewItemAdd = {
                    itemName: '',
                    qty: '',
                    price: '',
                    amount: '',
                  };
                  setParameterArray(modifierAdd => [
                    ...modifierAdd,
                    NewItemAdd,
                  ]);
                }}
                style={styles.nextView2}>
                <Text style={styles.nextText}>Add</Text>
              </TouchableOpacity>
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
                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText6}>Item Name</Text>
                        <TextInput
                          value={item.itemName}
                          placeholder={'Item Name'}
                          onChangeText={text => {
                            setRefresh(!refresh);
                            parameterArray[index].itemName = text;
                          }}
                          style={[styles.nameTextView, {width: '100%'}]}
                        />
                      </View>

                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText6}>QTY</Text>
                        <TextInput
                          value={item.qty}
                          placeholder={'Qty'}
                          onChangeText={text => {
                            setRefresh(!refresh);
                            parameterArray[index].qty = text;
                            if (item.price != '') {
                              if (text != '') {
                                parameterArray[index].amount =
                                  parseFloat(text) * parseFloat(item.price);
                              } else {
                                parameterArray[index].amount = '0';
                              }
                            }
                          }}
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                    </View>

                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '40%'}}>
                        <Text style={styles.dataHistoryText6}>PRICE</Text>
                        <TextInput
                          value={item.price}
                          placeholder={'Price'}
                          onChangeText={text => {
                            setRefresh(!refresh);
                            parameterArray[index].price = text;
                            if (item.qty != '') {
                              if (text != '') {
                                parameterArray[index].amount =
                                  parseFloat(text) * parseFloat(item.qty);
                              } else {
                                parameterArray[index].amount = '0';
                              }
                            }
                          }}
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                      <View style={{width: '30%'}}>
                        <Text style={styles.dataHistoryText6}>Amount</Text>
                        <Text style={[styles.nameTextView1, {height: hp(4)}]}>
                          {item.amount}
                        </Text>
                      </View>
                      <View style={[styles.buttonView, {width: '15%'}]}>
                        <TouchableOpacity
                          onPress={() => {
                            const existDataValue = parameterArray;
                            const filterData = existDataValue.filter(
                              (dataValue, index1) => index1 !== index,
                            );
                            console.log(' =====>', filterData);
                            setParameterArray(filterData);
                          }}
                          style={{marginLeft: wp(2)}}>
                          <Image
                            style={[
                              styles.editImage,
                              {tintColor: COLORS.errorColor},
                            ]}
                            source={deleteIcon}
                          />
                        </TouchableOpacity>
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
                setParameterArray([
                  {
                    itemName: '',
                    qty: '',
                    price: '',
                    amount: '',
                  },
                ]);
                setNewUserVisible(false);
              }}
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

export default BillList;

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
    // marginBottom: hp(1),
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
    // marginHorizontal: wp(2),
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
  dataHistoryText6: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
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
  nameTextView1: {
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
  },
  nameTextVie1: {
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
    height: hp(4.2),
    backgroundColor: COLORS.white,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    marginTop: hp(1),
  },
  parameterView: {
    width: '100%',
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
    marginTop: hp(3),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parameterText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
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
  nextView2: {
    height: hp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    paddingHorizontal: wp(3),
  },
});
