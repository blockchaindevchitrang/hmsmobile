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
import view from '../../images/view.png';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import RNFS from 'react-native-fs';
import {
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetCommonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import SelectDropdown from 'react-native-select-dropdown';
import {DeletePopup} from '../DeletePopup';
import useOrientation from '../OrientationComponent';

const typeArray = [
  {id: 0, name: 'Cash'},
  {id: 1, name: 'Cheque'},
];

const PurchaseMedicineList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  medicine,
  purchaseAction,
}) => {
  const {theme} = useTheme();
  const orientation = useOrientation();
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const menuRef = useRef(null);
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [parameterArray, setParameterArray] = useState([
    {
      medicineId: '',
      medicineName: '',
      lotNo: '',
      expiryDate: null,
      dateModalVisible: false,
      salesPrice: '0',
      purchasePrice: '0',
      quantity: '0',
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
      } else {
        setLoading(true);
        setErrorVisible(false);
        let medicineId = [];
        let lotNo = [];
        let tax = [];
        let expiryDate = [];
        let quantity = [];
        let amount = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (
            !item.medicineId ||
            !item.quantity ||
            !item.lotNo ||
            !item.expiryDate ||
            !item.amount
          ) {
            hasEmptyFields = true;
          } else {
            medicineId.push(JSON.stringify(item.medicineId));
            lotNo.push(item.lotNo);
            // tax.push(item.tax);
            expiryDate.push(moment(item.expiryDate).format('YYYY-MM-DD'));
            quantity.push(item.quantity);
            amount.push(JSON.stringify(item.amount));
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
        console.log('Get Value::', medicineId, lotNo);
        let raw = JSON.stringify({
          medicine: medicineId,
          lot_no: lotNo,
          tax: JSON.stringify(taxAmount),
          expiry_date: expiryDate,
          quantity: quantity,
          amount: amount,
          total: JSON.stringify(subTotal),
          net_amount: JSON.stringify(finalTotal),
          payment_type: JSON.stringify(paymentTypeId),
          discount: discount,
          note: note,
          payment_note: paymentNote,
          tax_medicine: JSON.stringify(taxAmount),
          purchase_no: `${randomNumber}`,
        });
        const urlData = 'purchase-medicine-store';
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

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(
        `purchase-medicine-delete/${id}`,
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
        `purchase-medicine-show/${id}`,
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
        <View style={[styles.nameDataView]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.purchase_no}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(26) : wp(18)},
          ]}>
          {item.total}
        </Text>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(22) : wp(16)},
          ]}>
          {item.tax}
        </Text>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(32) : wp(26)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.payment_type}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(28) : wp(24)},
          ]}>
          {item.net_amount}
        </Text>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(32) : wp(26)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.payment_status}</Text>
          </View>
        </View>
        {purchaseAction.includes('delete') && (
          <View style={styles.actionDataView}>
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
        )}
      </View>
    );
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
  }, [parameterArray, discount]);

  const onPurchaseExcelGet = async () => {
    try {
      const response = await onGetCommonApi('export-purchase-medicine');
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

  const updateAmount = (index, item, quantity) => {
    const updatedArray = parameterArray.map((item1, i) => {
      if (i === index) {
        const amount =
          quantity && item.purchasePrice
            ? parseFloat(quantity) * parseFloat(item.purchasePrice)
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
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  if (menuRef.current) {
                    menuRef.current.open();
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
                    onPurchaseExcelGet();
                  }
                }}>
                <MenuTrigger text={''} />
                <MenuOptions style={{marginVertical: hp(0.5)}}>
                  {purchaseAction.includes('create') && (
                    <MenuOption value={'add'}>
                      <Text style={styles.dataHistoryText3}>
                        Purchase Medicine
                      </Text>
                    </MenuOption>
                  )}
                  <MenuOption value={'excel'}>
                    <Text style={styles.dataHistoryText3}>Export to Excel</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
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
                      {width: isPortrait ? wp(35) : wp(28), textAlign: 'left'},
                    ]}>
                    {'PURCHASE NUMBER'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(26) : wp(18)},
                    ]}>
                    {'TOTAL'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(22) : wp(16)},
                    ]}>
                    {'TAX'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(32) : wp(26)},
                    ]}>
                    {'PAYMENT STATUS'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(28) : wp(24)},
                    ]}>
                    {'NET AMOUNT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(32) : wp(26)},
                    ]}>
                    {'PAYMENT MODE'}
                  </Text>
                  {purchaseAction.includes('delete') && (
                    <Text style={[styles.titleText, {width: wp(16)}]}>
                      {'ACTION'}
                    </Text>
                  )}
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
              Payments Account
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
            <View style={styles.parameterView}>
              <Text style={styles.parameterText}></Text>
              <TouchableOpacity
                onPress={() => {
                  let NewItemAdd = {
                    medicineId: '',
                    medicineName: '',
                    lotNo: '',
                    expiryDate: null,
                    dateModalVisible: false,
                    salesPrice: '0',
                    purchasePrice: '0',
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
                        <Text style={styles.dataHistoryText1}>MEDICINES</Text>
                        <SelectDropdown
                          data={medicine}
                          onSelect={(selectedItem, index1) => {
                            // setSelectedColor(selectedItem);
                            console.log('gert Value:::', parameterArray);
                            parameterArray[index].medicineId = selectedItem.id;
                            parameterArray[index].salesPrice =
                              selectedItem.selling_price;
                            parameterArray[index].purchasePrice =
                              selectedItem.buying_price;
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

                      <View style={{width: '48%'}}>
                        <Text style={styles.dataHistoryText1}>LOT NO.</Text>
                        <TextInput
                          value={item.lotNo}
                          placeholder={'Lot no.'}
                          onChangeText={text => {
                            setRefresh(!refresh);
                            parameterArray[index].lotNo = text;
                          }}
                          style={[styles.nameTextView, {width: '100%'}]}
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
                        <Text style={styles.dataHistoryText1}>
                          PURCHASE PRICE
                        </Text>
                        <Text style={[styles.nameTextView1, {height: hp(4.5)}]}>
                          {item.purchasePrice != '0'
                            ? parseFloat(item.purchasePrice).toFixed(2)
                            : '0.00'}
                        </Text>
                      </View>
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
                    </View>
                    <View style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                      <View style={{width: '40%'}}>
                        <Text style={styles.dataHistoryText1}>TAX</Text>
                        <TextInput
                          value={item.tax}
                          placeholder={''}
                          onChangeText={text => {
                            setRefresh(!refresh);
                            parameterArray[index].tax = text;
                          }}
                          style={[styles.nameTextView, {width: '100%'}]}
                          keyboardType={'number-pad'}
                        />
                      </View>
                      <View style={{width: '35%'}}>
                        <Text style={styles.dataHistoryText1}>Amount</Text>
                        <Text style={[styles.nameTextView1, {height: hp(4.5)}]}>
                          {item.amount != '0'
                            ? parseFloat(item.amount).toFixed(2)
                            : '0.00'}
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
              onPress={() => onAddPayRollData()}
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

export default PurchaseMedicineList;

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
    height: hp(8),
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
    width: wp(35),
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
    height: hp(4),
    width: hp(4),
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
    height: hp(6),
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
    borderBottomLeftRadius: wp(1),
    borderBottomRightRadius: wp(1),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(28),
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
});
