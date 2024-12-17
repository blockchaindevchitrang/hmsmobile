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

const statusArray = [
  {
    id: 1,
    name: 'Paid',
  },
  {
    id: 0,
    name: 'Padding',
  },
];

const InvoicesList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  account,
}) => {
  const user_data = useSelector(state => state.user_data);
  const {theme} = useTheme();
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [statusId, setStatusId] = useState('1');
  const [statusName, setStatusName] = useState('Paid');
  const [discount, setDiscount] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [parameterArray, setParameterArray] = useState([
    {
      accountId: '',
      accountName: '',
      description: '',
      qty: '',
      price: '',
      amount: '',
    },
  ]);
  const [subTotal, setSubTotal] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const total = parameterArray.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0,
    );
    if (discount != '') {
      const dis = total * (discount / 100); // 20% of the total
      const finalAmount = total - dis;
      setDiscountTotal(dis);
      setFinalTotal(finalAmount);
    } else {
      setDiscountTotal(0);
      setFinalTotal(total);
    }
    setRefresh(!refresh);
    setSubTotal(total);
    setRefresh(!refresh);
  }, [parameterArray, discount]);

  const onAddPayRollData = async () => {
    try {
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (discount == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter discount.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let accountIdArray = [];
        let description = [];
        let qtyArray = [];
        let price = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (
            !item.accountId ||
            !item.qty ||
            !item.price ||
            !item.description
          ) {
            hasEmptyFields = true;
          } else {
            accountIdArray.push(item.accountId);
            description.push(item.description);
            qtyArray.push(item.qty);
            price.push(item.price);
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage(
            'Please fill in all patient IDs, description, quantity and price.',
          );
          showMessage({
            message:
              'Please fill in all patient IDs, description, quantity and price.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }

        let raw = JSON.stringify({
          patient_id: patientId,
          invoice_date: moment(dateOfBirth).format('YYYY-MM-DD'),
          discount: discount,
          status: statusId,
          account_id: accountIdArray,
          description: description,
          quantity: qtyArray,
          price: price,
        });
        const urlData = 'invoice-create';
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
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (discount == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter discount.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let accountIdArray = [];
        let description = [];
        let qtyArray = [];
        let price = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (
            !item.accountId ||
            !item.qty ||
            !item.price ||
            !item.description
          ) {
            hasEmptyFields = true;
          } else {
            accountIdArray.push(item.accountId);
            description.push(item.description);
            qtyArray.push(item.qty);
            price.push(item.price);
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage(
            'Please fill in all patient IDs, description, quantity and price.',
          );
          showMessage({
            message:
              'Please fill in all patient IDs, description, quantity and price.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }

        let raw = JSON.stringify({
          patient_id: patientId,
          invoice_date: moment(dateOfBirth).format('YYYY-MM-DD'),
          discount: discount,
          status: statusId,
          account_id: accountIdArray,
          description: description,
          quantity: qtyArray,
          price: price,
        });
        const urlData = `invoice-update/${userId}`;
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
      const response = await onDeleteCommonApi(`invoice-delete/${id}`);
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
      const response = await onGetSpecificCommonApi(`invoice-edit/${id}`);
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
        <View style={[styles.switchView, {width: wp(26)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.invoice_id}</Text>
          </View>
        </View>
        <View style={[styles.nameDataView]}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text style={[styles.dataHistoryText5]}>{item.email}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(30)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.invoice_date}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(24)}]}>
          {item.amount}
        </Text>
        <View style={[styles.switchView, {width: wp(24)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let allDatas = await onGetSpecificDoctor(item.id);
              console.log('gert Value:::', allDatas);
              setUserId(item.id);
              setPatientId(allDatas.invoice.patient_id);
              setPatientName(item.name);
              setDateOfBirth(new Date(allDatas.invoice.invoice_date));
              setDiscount(JSON.stringify(allDatas.invoice.discount));
              setStatusId(item.status == 'Pending' ? '0' : '1');
              setStatusName(item.status);
              let dataValue = [];
              allDatas.invoice.invoice_items.map(item1 => {
                dataValue.push({
                  accountId: item1.account_id,
                  accountName: allDatas.accounts[item1.account_id],
                  description: item1.description,
                  qty: JSON.stringify(item1.quantity),
                  price: JSON.stringify(item1.price),
                  amount: JSON.stringify(item1.total),
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

  const updateAmount = (index, qty, price) => {
    const updatedArray = parameterArray.map((item, i) => {
      if (i === index) {
        const amount = qty && price ? parseFloat(qty) * parseFloat(price) : 0;
        return {...item, qty, price, amount};
      }
      return item;
    });

    setParameterArray(updatedArray); // This creates a new reference and triggers useEffect
  };

  return (
    <View style={styles.safeAreaStyle}>
      {!newUserVisible ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={[styles.subView, {flexWrap: 'wrap'}]}>
            <TextInput
              value={searchBreak}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearchBreak(text)}
              style={[styles.searchView, {color: theme.text}]}
            />
          </View>
          <View style={styles.filterView}>
            <TouchableOpacity style={styles.filterView1}>
              <Image style={styles.filterImage} source={filter} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setUserId('');
                setPatientId('');
                setPatientName('');
                setDiscount('');
                setDateOfBirth(new Date());
                setStatusId('1');
                setStatusName('Paid');
                setParameterArray([
                  {
                    accountId: '',
                    accountName: '',
                    description: '',
                    qty: '',
                    price: '',
                    amount: '',
                  },
                ]);
                setErrorVisible(false);
                setErrorMessage('');
                setNewUserVisible(true);
              }}
              style={styles.actionView}>
              <Text style={styles.actionText}>New Invoice</Text>
            </TouchableOpacity>
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
                    {'INVOICE ID'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(55), textAlign: 'left'},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(30)}]}>
                    {'INVOICE DATE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'AMOUNT'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'STATUS'}
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
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <Text style={[styles.doctorText, {color: theme.text}]}>
              New Invoice
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
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  PRACTICE:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <SelectDropdown
                  data={user_data}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
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
                <Text style={styles.dataHistoryText1}>
                  INVOICE DATE:<Text style={styles.dataHistoryText4}>*</Text>
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
                <Text style={styles.dataHistoryText1}>
                  DISCOUNT(%)<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={discount}
                  placeholder={'In Percentage'}
                  onChangeText={text => setDiscount(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  STATUS:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <SelectDropdown
                  data={statusArray}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setStatusId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValueByIndex={statusId == '1' ? 0 : 1}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {statusId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {statusId == selectedItem?.id
                              ? selectedItem?.name
                              : statusName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Status'}
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

            <View style={styles.parameterView}>
              <Text style={styles.parameterText}></Text>
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
                        <Text style={styles.dataHistoryText1}>ACCOUNT</Text>
                        <SelectDropdown
                          data={account}
                          onSelect={(selectedItem, index1) => {
                            // setSelectedColor(selectedItem);
                            console.log('gert Value:::', parameterArray);
                            parameterArray[index].accountId = selectedItem.id;
                            parameterArray[index].accountName =
                              selectedItem.name;
                            setRefresh(!refresh);
                          }}
                          renderButton={(selectedItem, isOpen) => {
                            console.log('Get Response>>>', selectedItem);
                            return (
                              <View style={styles.dropdown2BtnStyle2}>
                                {item.accountId != '' ? (
                                  <Text style={styles.dropdownItemTxtStyle}>
                                    {item.accountId == selectedItem?.id
                                      ? `${selectedItem?.name}`
                                      : item.accountName}
                                  </Text>
                                ) : (
                                  <Text style={styles.dropdownItemTxtStyle}>
                                    {selectedItem?.name || 'Select Amount'}
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
                        <Text style={styles.dataHistoryText1}>DESCRIPTION</Text>
                        <TextInput
                          value={item.description}
                          placeholder={'Description'}
                          onChangeText={text => {
                            setRefresh(!refresh);
                            parameterArray[index].description = text;
                          }}
                          style={[styles.nameTextView, {width: '100%'}]}
                        />
                      </View>
                    </View>

                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>QTY</Text>
                        <TextInput
                          value={item.qty}
                          placeholder={'Qty'}
                          onChangeText={text =>
                            updateAmount(index, text, item.price)
                          }
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>PRICE</Text>
                        <TextInput
                          value={item.price}
                          placeholder={'Price'}
                          onChangeText={text =>
                            updateAmount(index, item.qty, text)
                          }
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                    </View>
                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      {/* <View style={{width: '30%'}}>
                        <Text
                          style={[
                            styles.nameTextView1,
                            {height: hp(4)},
                          ]}></Text>
                      </View> */}
                      <View style={{width: '55%'}}>
                        <Text style={styles.dataHistoryText1}>Amount</Text>
                        <Text style={[styles.nameTextView1, {height: hp(4)}]}>
                          {item.amount != '' ? item.amount : '0'}
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
            <View style={{alignSelf: 'flex-end'}}>
              <Text
                style={
                  styles.dataHistoryText6
                }>{`Sub Total:     PKR ${subTotal}`}</Text>
              <Text
                style={
                  styles.dataHistoryText6
                }>{`Discount:     PKR ${discountTotal}`}</Text>
              <Text style={styles.dataHistoryText6}>
                {`Total Amount:     PKR ${finalTotal}`}
              </Text>
            </View>
            {errorVisible ? (
              <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
            ) : null}
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

export default InvoicesList;

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
    width: '100%',
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
    width: '50%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
    marginTop: hp(1),
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
  nextView2: {
    height: hp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    paddingHorizontal: wp(3),
  },
});
