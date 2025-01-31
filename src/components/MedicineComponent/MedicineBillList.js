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
} from './../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from './../ProfilePhoto';
import filter from '../../images/filter.png';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import moment from 'moment';
import man from '../../images/man.png';
import draw from '../../images/draw.png';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetEditCommonJsonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import {showMessage} from 'react-native-flash-message';
import {useSelector} from 'react-redux';
import {DeletePopup} from '../DeletePopup';
import useOrientation from '../OrientationComponent';

const typeArray = [
  {id: 0, name: 'Cash'},
  {id: 1, name: 'Cheque'},
];

let accountantData = [];
let accountantData1 = [];

const MedicineBillList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  medicine,
  medicineCategory,
  billAction,
}) => {
  const {theme} = useTheme();
  const orientation = useOrientation();
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const menuRef = useRef(null);
  const user_data = useSelector(state => state.user_data);
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [patient, setPatient] = useState('');
  const [patientSelected, setPatientSelected] = useState('');
  const [billDate, setBillDate] = useState(null);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const [parameterArray, setParameterArray] = useState([
    {
      categoryId: '',
      categoryName: '',
      medicineId: '',
      medicineName: '',
      expiryDate: null,
      dateModalVisible: false,
      salesPrice: '0',
      quantity: '0',
      availableQuantity: '0',
      tax: '0',
      amount: 0,
    },
  ]);
  const [note, setNote] = useState('');
  const [discount, setDiscount] = useState('0.00');
  const [paymentTypeId, setPaymentTypeId] = useState('');
  const [paymentTypeName, setPaymentTypeName] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [taxAmount, setTaxAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const onAddPayRollData = async () => {
    try {
      if (finalTotal == 0) {
        setErrorVisible(true);
        setErrorMessage('Please enter any one medicine product for purchase.');
      } else if (patient == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (billDate == null) {
        setErrorVisible(true);
        setErrorMessage('Please select bill date.');
      } else if (paymentTypeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select payment type.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let categoryId = [];
        let medicineId = [];
        let sale_price = [];
        let tax = [];
        let expiryDate = [];
        let available_quantity = [];
        let quantity = [];
        let amount = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (
            !item.categoryId ||
            !item.medicineId ||
            !item.quantity ||
            !item.availableQuantity ||
            !item.expiryDate ||
            !item.tax
          ) {
            hasEmptyFields = true;
          } else {
            medicineId.push(JSON.stringify(item.medicineId));
            categoryId.push(item.categoryId);
            tax.push(item.tax);
            sale_price.push(item.salesPrice);
            expiryDate.push(moment(item.expiryDate).format('YYYY-MM-DD'));
            quantity.push(item.quantity);
            available_quantity.push(item.availableQuantity);
            // amount.push(JSON.stringify(item.amount));
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage('Please fill in all medicine details.');
          showMessage({
            message: 'Please fill in all medicine details.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        console.log('Get Value::', medicineId);
        let raw = JSON.stringify({
          medicine: medicineId,
          bill_date: moment(billDate).format('YYYY-MM-DD'),
          sale_price: sale_price,
          tax: JSON.stringify(taxAmount),
          expiry_date: expiryDate,
          quantity: quantity,
          available_quantity: available_quantity,
          patient_id: patient,
          payment_status: status ? 1 : 0,
          total: JSON.stringify(subTotal),
          net_amount: JSON.stringify(finalTotal),
          payment_type: JSON.stringify(paymentTypeId),
          discount: discount,
          note: note,
          payment_note: paymentNote,
          category_id: categoryId,
          tax_medicine: JSON.stringify(taxAmount),
          purchase_no: `${randomNumber}`,
        });
        const urlData = 'medicine-bill-store';
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
      console.log('Error:', err.response.data.message);
    }
  };

  const onEditPayRollData = async () => {
    try {
      if (finalTotal == 0) {
        setErrorVisible(true);
        setErrorMessage('Please enter any one medicine product for purchase.');
      } else if (patient == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (billDate == null) {
        setErrorVisible(true);
        setErrorMessage('Please select bill date.');
      } else if (paymentTypeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select payment type.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let categoryId = [];
        let medicineId = [];
        let sale_price = [];
        let tax = [];
        let expiryDate = [];
        let available_quantity = [];
        let quantity = [];
        let amount = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (
            !item.categoryId ||
            !item.medicineId ||
            !item.quantity ||
            !item.availableQuantity ||
            !item.expiryDate ||
            !item.tax
          ) {
            hasEmptyFields = true;
          } else {
            medicineId.push(JSON.stringify(item.medicineId));
            categoryId.push(item.categoryId);
            tax.push(item.tax);
            sale_price.push(item.salesPrice);
            expiryDate.push(moment(item.expiryDate).format('YYYY-MM-DD'));
            quantity.push(item.quantity);
            available_quantity.push(item.availableQuantity);
            // amount.push(JSON.stringify(item.amount));
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage('Please fill in all medicine details.');
          showMessage({
            message: 'Please fill in all medicine details.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        console.log('Get Value::', medicineId);
        let raw = JSON.stringify({
          medicine: medicineId,
          bill_date: moment(billDate).format('YYYY-MM-DD'),
          sale_price: sale_price,
          tax: JSON.stringify(taxAmount),
          expiry_date: expiryDate,
          quantity: quantity,
          available_quantity: available_quantity,
          patient_id: patient,
          payment_status: status ? 1 : 0,
          total: JSON.stringify(subTotal),
          net_amount: JSON.stringify(finalTotal),
          payment_type: JSON.stringify(paymentTypeId),
          category_id: categoryId,
          discount: discount,
          note: note,
          payment_note: paymentNote,
          tax_medicine: JSON.stringify(taxAmount),
          purchase_no: `${randomNumber}`,
        });
        const urlData = `medicine-bill-update/${userId}`;
        console.log('Get Login Url:::', raw);
        const response = await onGetEditCommonJsonApi(urlData, raw);
        // const response = await onAddAccountListApi(urlData);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
          showMessage({
            message: 'Record Edited Successfully',
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
      console.log('Error:', err.response.data);
    }
  };

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(`medicine-bill-delete/${id}`);
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
      const response = await onGetSpecificCommonApi(`medicine-bill-edit/${id}`);
      if (response.status == 200) {
        console.log('get ValueLL:::', response.data.data);
        return response.data.data.medicineBill;
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
            <Text style={[styles.dataHistoryText1]}>#{item.bill_number}</Text>
          </View>
        </View>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(35) : wp(28)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.bill_date}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          {item.patient_name != null && (
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
          {item.doctor_name != null && (
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
          style={[styles.switchView, {width: isPortrait ? wp(35) : wp(28)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.payment_type}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(32) : wp(26)},
          ]}>
          {item.net_amount}
        </Text>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(35) : wp(28)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataListText1]}>{item.payment_status}</Text>
          </View>
        </View>
        {billAction.includes('edit') || billAction.includes('delete') ? (
          <View style={styles.actionDataView}>
            {billAction.includes('edit') && (
              <TouchableOpacity
                onPress={async () => {
                  let allData = await onGetSpecificDoctor(item.id);
                  setPatient(allData?.patient_id);
                  setPatientSelected(item?.patient_name);
                  setBillDate(new Date(item?.bill_date));
                  setStatus(allData?.payment_status == 1 ? true : false);
                  setPaymentTypeId(allData?.payment_type);
                  setPaymentTypeName(item?.payment_type);
                  setDiscount(JSON.stringify(allData?.discount));
                  setFinalTotal(JSON.stringify(allData?.net_amount));
                  setTaxAmount(allData?.tax_amount);
                  setNote(allData?.note);
                  setUserId(item.id);
                  let dataValue = [];
                  allData.sale_medicine.map(item1 => {
                    dataValue.push({
                      categoryId: item1.medicine.category_id,
                      categoryName: item1.medicine.category.name,
                      medicineId: item1.medicine_id,
                      medicineName: item1.medicine.name,
                      expiryDate: new Date(item1.expiry_date),
                      dateModalVisible: false,
                      salesPrice: JSON.stringify(item1.sale_price),
                      quantity: JSON.stringify(item1.sale_quantity),
                      availableQuantity: item1.medicine.quantity,
                      tax: JSON.stringify(item1.tax),
                      amount: JSON.stringify(
                        item1.sale_price * item1.sale_quantity,
                      ),
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
            )}
            {billAction.includes('delete') && (
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

  const updateAmount = (index, item, quantity) => {
    const updatedArray = parameterArray.map((item1, i) => {
      if (i === index) {
        const amount =
          quantity && item.salesPrice
            ? parseFloat(quantity) * parseFloat(item.salesPrice)
            : 0;
        return {...item1, quantity, amount};
      }
      return item1;
    });
    setParameterArray(updatedArray);
  };

  const handleConfirm = (index, date) => {
    const updatedArray = [...parameterArray];
    updatedArray[index].expiryDate = date;
    updatedArray[index].dateModalVisible = false;
    setParameterArray(updatedArray);
    setRefresh(!refresh);
  };

  const handleCancel = index => {
    const updatedArray = [...parameterArray];
    updatedArray[index].dateModalVisible = false;

    setParameterArray(updatedArray);
    setRefresh(!refresh);
  };

  const updateAmount1 = (index, quantity) => {
    parameterArray[index].tax = quantity;
    setRefresh(!refresh);
    const totalTax = parameterArray.reduce(
      (sum, item) => sum + parseFloat(item.amount * (item.tax / 100) || 0),
      0,
    );
    console.log(totalTax);
    setTaxAmount(totalTax);
  };

  useEffect(() => {
    const total = parameterArray.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0,
    );
    const totalTax = parameterArray.reduce(
      (sum, item) => sum + parseFloat(item.amount * (item.tax / 100) || 0),
      0,
    );
    console.log(totalTax);
    setTaxAmount(totalTax);
    if (discount != '' && totalTax != 0) {
      const dis = total - parseFloat(discount) + totalTax;
      setFinalTotal(dis);
    } else if (discount != '0.00') {
      if (discount != '') {
        const dis = total - parseFloat(discount);
        setFinalTotal(dis);
      } else {
        setFinalTotal(total);
      }
    } else if (totalTax != 0) {
      const dis = total + totalTax;
      setFinalTotal(dis);
    } else {
      setFinalTotal(total);
    }
    setRefresh(!refresh);
    setSubTotal(total);
    setRefresh(!refresh);
  }, [parameterArray, discount, taxAmount]);

  const onGetSpecificCategory = async id => {
    try {
      let dataArray = [];
      medicine.map(async item => {
        let response = await onGetSpecificCommonApi(`medicine-edit/${item.id}`);
        dataArray.push(response.data.data);
      });
      accountantData = dataArray;
      // if (response.status == 200) {
      //   console.log('get ValueLL:::', response.data.data);
      //   return response.data.data;
      // } else {
      //   return 0;
      // }
    } catch (err) {
      console.log('Get Error', err);
    }
  };

  useEffect(() => {
    onGetSpecificCategory();
  }, []);

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
              {billAction.includes('create') && (
                <TouchableOpacity
                  onPress={() => {
                    setUserId('');
                    setPatient('');
                    setPatientSelected('');
                    setBillDate(null);
                    setStatus(true);
                    setPaymentTypeId('');
                    setPaymentTypeName('');
                    setDiscount('0.00');
                    setFinalTotal(0);
                    setTaxAmount(0);
                    setNote('');
                    setPaymentNote('');
                    setParameterArray([
                      {
                        categoryId: '',
                        categoryName: '',
                        medicineId: '',
                        medicineName: '',
                        expiryDate: null,
                        dateModalVisible: false,
                        salesPrice: '0',
                        quantity: '0',
                        availableQuantity: '0',
                        tax: '0',
                        amount: 0,
                      },
                    ]);
                    setNewUserVisible(true);
                  }}
                  style={styles.actionView}>
                  <Text style={styles.actionText}>New Bill</Text>
                </TouchableOpacity>
              )}
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
                      {width: isPortrait ? wp(30) : wp(24)},
                    ]}>
                    {'BILL NUMBER'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(35) : wp(28)},
                    ]}>
                    {'DATE'}
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
                      {width: isPortrait ? wp(35) : wp(28)},
                    ]}>
                    {'PAYMENT MODE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(32) : wp(26)},
                    ]}>
                    {'NET AMOUNT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(35) : wp(28)},
                    ]}>
                    {'PAYMENT STATUS'}
                  </Text>
                  {billAction.includes('edit') ||
                  billAction.includes('delete') ? (
                    <Text style={[styles.titleText, {width: wp(16)}]}>
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
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <Text style={[styles.doctorText, {color: theme.text}]}>
              Medicine Bill Account
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setNewUserVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileView}>
            {isPortrait ? (
              <>
                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Patient:</Text>
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
                                {selectedItem?.patient_user?.first_name ||
                                  'Select'}
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
                    <Text style={styles.dataHistoryText1}>Bill Date:</Text>
                    <Text
                      style={[
                        styles.nameTextView,
                        {width: '100%', paddingVertical: hp(1)},
                      ]}
                      onPress={() => setDateModalVisible(!dateModalVisible)}>
                      {billDate
                        ? moment(billDate).format('YYYY-MM-DD')
                        : 'Bill Date'}
                    </Text>
                    <DatePicker
                      open={dateModalVisible}
                      modal={true}
                      mode={'date'}
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
              </>
            ) : (
              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText1}>Patient:</Text>
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
                              {selectedItem?.patient_user?.first_name ||
                                'Select'}
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
                  <Text style={styles.dataHistoryText1}>Bill Date:</Text>
                  <Text
                    style={[
                      styles.nameTextView,
                      {width: '100%', paddingVertical: hp(1)},
                    ]}
                    onPress={() => setDateModalVisible(!dateModalVisible)}>
                    {billDate
                      ? moment(billDate).format('YYYY-MM-DD')
                      : 'Bill Date'}
                  </Text>
                  <DatePicker
                    open={dateModalVisible}
                    modal={true}
                    mode={'date'}
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
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText1}>Status:</Text>
                  <View style={styles.statusViewData}>
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
            )}
            <View style={styles.parameterView}>
              <Text style={styles.parameterText}></Text>
              <TouchableOpacity
                onPress={() => {
                  let NewItemAdd = {
                    categoryId: '',
                    categoryName: '',
                    medicineId: '',
                    medicineName: '',
                    expiryDate: null,
                    dateModalVisible: false,
                    salesPrice: '0',
                    quantity: '0',
                    tax: '0',
                    amount: 0,
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
                        <Text style={styles.dataHistoryText1}>
                          MEDICINE CATEGORIES
                        </Text>
                        <SelectDropdown
                          data={medicineCategory}
                          onSelect={async (selectedItem, index1) => {
                            accountantData1 = accountantData.filter(
                              user => user.category_id === selectedItem.id,
                            );
                            console.log('gert Value:::', accountantData1);
                            parameterArray[index].categoryId = selectedItem.id;
                            parameterArray[index].categoryName =
                              selectedItem.name;
                            setRefresh(!refresh);
                          }}
                          renderButton={(selectedItem, isOpen) => {
                            console.log('Get Response>>>', selectedItem);
                            return (
                              <View style={styles.dropdown2BtnStyle2}>
                                {item.categoryId != '' ? (
                                  <Text style={styles.dropdownItemTxtStyle}>
                                    {item.categoryId == selectedItem?.id
                                      ? `${selectedItem?.name}`
                                      : item.categoryName}
                                  </Text>
                                ) : (
                                  <Text style={styles.dropdownItemTxtStyle}>
                                    {selectedItem?.name || 'Select Category'}
                                  </Text>
                                )}
                              </View>
                            );
                          }}
                          showsVerticalScrollIndicator={false}
                          renderItem={(item1, index, isSelected) => {
                            return (
                              <TouchableOpacity style={styles.dropdownView}>
                                <Text style={styles.dropdownItemTxtStyle}>
                                  {item1?.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                          dropdownIconPosition={'left'}
                          dropdownStyle={styles.dropdown2DropdownStyle}
                        />
                      </View>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>MEDICINES</Text>
                        <SelectDropdown
                          data={accountantData1}
                          onSelect={(selectedItem, index1) => {
                            // setSelectedColor(selectedItem);
                            console.log('gert Value:::', parameterArray);
                            parameterArray[index].medicineId = selectedItem.id;
                            parameterArray[index].salesPrice =
                              selectedItem.selling_price;
                            parameterArray[index].medicineName =
                              selectedItem.name;
                            setRefresh(!refresh);
                          }}
                          renderButton={(selectedItem, isOpen) => {
                            console.log('Get Response>>>', selectedItem);
                            return (
                              <View style={styles.dropdown2BtnStyle2}>
                                {item.medicineId != '' ? (
                                  <Text style={styles.dropdownItemTxtStyle}>
                                    {item.medicineId == selectedItem?.id
                                      ? `${selectedItem?.name}`
                                      : item.medicineName}
                                  </Text>
                                ) : (
                                  <Text style={styles.dropdownItemTxtStyle}>
                                    {selectedItem?.name || 'Select Medicine'}
                                  </Text>
                                )}
                              </View>
                            );
                          }}
                          showsVerticalScrollIndicator={false}
                          renderItem={(item1, index, isSelected) => {
                            return (
                              <TouchableOpacity style={styles.dropdownView}>
                                <Text style={styles.dropdownItemTxtStyle}>
                                  {item1?.name}
                                </Text>
                              </TouchableOpacity>
                            );
                          }}
                          dropdownIconPosition={'left'}
                          dropdownStyle={styles.dropdown2DropdownStyle}
                        />
                      </View>
                    </View>

                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>EXPIRY DATE</Text>
                        <Text
                          style={[
                            styles.nameTextView,
                            {width: '100%', paddingVertical: hp(1)},
                          ]}
                          onPress={() => {
                            parameterArray[index].dateModalVisible = true;
                            setRefresh(!refresh);
                          }}>
                          {item.expiryDate
                            ? moment(item.expiryDate).format('DD-MM-YYYY')
                            : 'Expiry Date'}
                        </Text>
                        <DatePicker
                          open={item.dateModalVisible}
                          modal={true}
                          date={item.expiryDate || new Date()}
                          minimumDate={new Date()}
                          mode={'date'}
                          onConfirm={date => handleConfirm(index, date)}
                          onCancel={() => handleCancel(index)}
                        />
                      </View>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>SALE PRICE</Text>
                        <Text style={[styles.nameTextView1, {height: hp(4.5)}]}>
                          {item.salesPrice != '0'
                            ? parseFloat(item.salesPrice).toFixed(2)
                            : '0.00'}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>QUANTITY</Text>
                        <TextInput
                          value={item.quantity}
                          placeholder={''}
                          onChangeText={text => updateAmount(index, item, text)}
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>TAX</Text>
                        <TextInput
                          value={item.tax}
                          placeholder={''}
                          onChangeText={text => updateAmount1(index, text)}
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                    </View>
                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>Amount</Text>
                        <Text style={[styles.nameTextView1, {height: hp(4.5)}]}>
                          {item.amount != '0'
                            ? parseFloat(item.amount).toFixed(2)
                            : '0.00'}
                        </Text>
                      </View>
                      <View style={[styles.buttonView, {width: '20%'}]}>
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
              contentContainerStyle={{paddingBottom: hp(1)}}
            />
            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={[styles.dataHistoryText1, {marginBottom: hp(1)}]}>
                  {'Notes'}
                </Text>
                <TextInput
                  value={note}
                  placeholder={'Notes'}
                  onChangeText={text => setNote(text)}
                  style={[styles.commentTextInput]}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
            <View style={{alignSelf: 'flex-end'}}>
              <View style={styles.totalDetailsView}>
                <Text style={styles.dataHistoryText7}>{'Total:'}</Text>
                <Text
                  style={[
                    styles.nameTextView1,
                    {height: hp(4.5), width: '50%'},
                  ]}>
                  {subTotal != 0 ? parseFloat(subTotal).toFixed(2) : '0.00'}
                </Text>
              </View>
              <View style={styles.totalDetailsView}>
                <Text style={styles.dataHistoryText7}>{'Discount:'}</Text>
                <TextInput
                  value={discount}
                  placeholder={''}
                  onChangeText={text => setDiscount(text)}
                  style={[styles.nameTextView, {width: '50%'}]}
                />
              </View>
              <View style={styles.totalDetailsView}>
                <Text style={styles.dataHistoryText7}>{'Tax Amount:'}</Text>
                <Text
                  style={[
                    styles.nameTextView1,
                    {height: hp(4.5), width: '50%'},
                  ]}>
                  {taxAmount != 0 ? parseFloat(taxAmount).toFixed(2) : '0.00'}
                </Text>
              </View>
              <View style={styles.totalDetailsView}>
                <Text style={styles.dataHistoryText7}>{'Net Amount:'}</Text>
                <Text
                  style={[
                    styles.nameTextView1,
                    {height: hp(4.5), width: '50%'},
                  ]}>
                  {finalTotal != 0 ? parseFloat(finalTotal).toFixed(2) : '0.00'}
                </Text>
              </View>
              <View style={styles.totalDetailsView}>
                <Text style={styles.dataHistoryText7}>
                  {'Choose Payment Type'}
                </Text>
                <SelectDropdown
                  data={typeArray}
                  onSelect={(selectedItem, index1) => {
                    // setSelectedColor(selectedItem);
                    console.log('gert Value:::', selectedItem);
                    setPaymentTypeName(selectedItem.name);
                    setPaymentTypeId(selectedItem.id);
                  }}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={[styles.dropdown2BtnStyle2, {width: '50%'}]}>
                        {paymentTypeId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {paymentTypeId == selectedItem?.id
                              ? `${selectedItem?.name}`
                              : paymentTypeName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Payment Mode'}
                          </Text>
                        )}
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item1, index, isSelected) => {
                    return (
                      <TouchableOpacity style={styles.dropdownView}>
                        <Text style={styles.dropdownItemTxtStyle}>
                          {item1?.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  dropdownIconPosition={'left'}
                  dropdownStyle={styles.dropdown2DropdownStyle}
                />
              </View>
            </View>
            <View style={[styles.nameView, {marginTop: hp(2)}]}>
              <View style={{width: '100%'}}>
                <Text style={[styles.dataHistoryText1, {marginBottom: hp(1)}]}>
                  {'Payment Note'}
                </Text>
                <TextInput
                  value={paymentNote}
                  placeholder={'Payment Note'}
                  onChangeText={text => setPaymentNote(text)}
                  style={[styles.commentTextInput]}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonView1}>
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

export default MedicineBillList;

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
    width: '70%',
    paddingHorizontal: wp(3),
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
    paddingHorizontal: wp(2),
  },
  filterView1: {
    height: hp(5),
    width: hp(5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
  },
  dateBox1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
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
    textAlign: 'center',
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
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    textAlign: 'right',
    paddingVertical: hp(1),
    borderBottomWidth: 0.5,
    paddingHorizontal: wp(3),
  },
  dataHistoryText7: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    marginTop: hp(1),
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
    alignItems: 'center',
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
    width: '100%',
    paddingHorizontal: wp(2),
    height: hp(5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.lightGreyColor,
    paddingTop: hp(1),
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
  buttonView1: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(3),
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
  invoiceId: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greyColor,
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
  parameterView: {
    width: '100%',
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
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
  nextView2: {
    height: hp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    paddingHorizontal: wp(3),
  },
  totalDetailsView: {
    alignItems: 'center',
    width: wp(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    width: '70%',
    paddingHorizontal: wp(3),
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
    // paddingHorizontal: wp(2),
  },
  filterView1: {
    height: hp(5),
    width: hp(5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
  },
  dateBox1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
  },
  filterImage: {
    width: wp(6),
    height: hp(3),
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
    textAlign: 'center',
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
    width: wp(33),
  },
  dataHistoryText6: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    textAlign: 'right',
    paddingVertical: hp(1),
    borderBottomWidth: 0.5,
    paddingHorizontal: wp(3),
  },
  dataHistoryText7: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    marginTop: hp(1),
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
    justifyContent: 'center',
    marginHorizontal: wp(2),
    alignItems: 'center',
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
    width: '100%',
    paddingHorizontal: wp(2),
    height: hp(5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
    backgroundColor: COLORS.lightGreyColor,
    paddingTop: hp(1),
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
  buttonView1: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(3),
  },
  nextView: {
    height: hp(4),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  nextText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2),
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
    textAlign: 'left',
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
  invoiceId: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greyColor,
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
    height: hp(4),
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
    height: hp(4),
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
  parameterView: {
    width: '100%',
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
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
  nextView2: {
    height: hp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    paddingHorizontal: wp(3),
  },
  totalDetailsView: {
    alignItems: 'center',
    width: wp(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  statusViewData: {
    marginTop: hp(1),
  },
});
