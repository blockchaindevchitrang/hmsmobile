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
  Modal,
  TouchableWithoutFeedback,
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
import moment from 'moment';
import deleteIcon from '../../images/delete.png';
import filter from '../../images/filter.png';
import editing from '../../images/editing.png';
import close from '../../images/close.png';
import photo from '../../images/photo.png';
import draw from '../../images/draw.png';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import {
  onAddAccountListApi,
  onAddCommonFormDataApi,
  onAddInvestigationApi,
  onDeleteCommonApi,
  onGetEditAccountDataApi,
  onGetSpecificCommonApi,
  onUpdateCommonFormDataApi,
  onUpdateInvestigationApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';

const filterArray = [
  {id: 3, name: 'All'},
  {id: 0, name: 'Return Item'},
  {id: 1, name: 'Returned'},
];

const IssuedItemsList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  itemCategory,
  itemList,
  totalPage,
  pageCount,
  setPageCount,
  statusId,
  setStatusId,
}) => {
  const roleData = useSelector(state => state.roleData);
  const allUserData = useSelector(state => state.allUserData);
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [newAccountVisible, setNewAccountVisible] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [issueBy, setIssueBy] = useState('');
  const [issueDate, setIssueDate] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());
  const [dateModalVisible1, setDateModalVisible1] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableQty, setAvailableQty] = useState('0');
  const [filterVisible, setFilterVisible] = useState(false);

  let accountantData = itemList.filter(
    user => user.itemcategory === categoryName,
  );
  useEffect(() => {
    if (accountantData.length > 0) {
      setItemId(accountantData[0].id);
      setItemName(accountantData[0].name);
      setAvailableQty(JSON.stringify(accountantData[0].available_quantity));
    } else {
      setItemId('');
      setItemName('');
      setAvailableQty('0');
    }
  }, [accountantData]);

  let accountantData1 = allUserData.filter(
    user => user.department === roleName,
  );

  useEffect(() => {
    console.log('USERLLLL', allUserData);
    if (accountantData1.length > 0) {
      setEmployeeId(accountantData1[0].id);
      setEmployeeName(accountantData1[0].name);
    } else {
      setEmployeeId('');
      setEmployeeName('');
    }
  }, [accountantData1]);

  const onAddPayRollData = async () => {
    try {
      if (roleId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select user type.');
      } else if (employeeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select user to issue.');
      } else if (issueBy == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter issue by.');
      } else if (categoryId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select item category.');
      } else if (itemId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select item.');
      } else if (quantity == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter quantity.');
      } else if (parseFloat(quantity) < parseFloat(availableQty)) {
        setErrorVisible(true);
        setErrorMessage('Please enter less then available quantity.');
      } else {
        setLoading(true);
        setErrorVisible(false);

        const formdata = new FormData();
        formdata.append('department_id', roleId);
        formdata.append('user_id', employeeId);
        formdata.append('issued_by', issueBy);
        formdata.append('issued_date', moment(issueDate).format('YYYY-MM-DD'));
        formdata.append('return_date', moment(returnDate).format('YYYY-MM-DD'));
        formdata.append('item_category_id', categoryId);
        formdata.append('item_id', itemId);
        formdata.append('quantity', quantity);
        formdata.append('description', description);
        // if (avatar != null) {
        //   formdata.append('attachment', avatar);
        // }
        const dataUrl = `issue-item-store?department_id=${roleId}&user_id=${employeeId}&issued_by=${issueBy}&issued_date=${moment(
          issueDate,
        ).format('YYYY-MM-DD')}&return_date=${moment(returnDate).format(
          'YYYY-MM-DD',
        )}&item_category_id=${categoryId}&item_id=${itemId}&quantity=${quantity}&description=${description}`;
        const response = await onAddAccountListApi(dataUrl);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewAccountVisible(false);
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
      if (categoryId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select item category.');
      } else if (itemId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select item name.');
      } else if (quantity == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter quantity.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        // const formdata = new FormData();
        // formdata.append('item_category_id', categoryId);
        // formdata.append('item_id', itemId);
        // formdata.append('supplier_name', supplier);
        // formdata.append('store_name', storeName);
        // formdata.append('quantity', quantity);
        // formdata.append('purchase_price', price);
        // formdata.append('description', description);
        // if (avatar != null) {
        //   formdata.append('attachment', avatar);
        // }
        const dataUrl = `issue-item-store/${userId}?department_id=${roleId}&user_id=${employeeId}&issued_by=${issueBy}&issued_date=${moment(
          issueDate,
        ).format('YYYY-MM-DD')}&return_date=${moment(returnDate).format(
          'YYYY-MM-DD',
        )}&item_category_id=${categoryId}&item_id=${itemId}&quantity=${quantity}&description=${description}`;
        // const dataUrl = `item-stock-update/${userId}`;
        const response = await onUpdateCommonFormDataApi(dataUrl, formdata);
        // const response = await onGetEditCommonJsonApi(urlData, raw);
        console.log('Get Error::', response.data);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewAccountVisible(false);
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
      console.log('Error:', err);
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
    }
  };

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(`issue-item-delete/${id}`);
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
      const response = await onGetSpecificCommonApi(`item-stock-edit/${id}`);
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
          <Text style={[styles.dataHistoryText2]}>{item.item}</Text>
        </View>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <Text style={[styles.dataHistoryText1]}>{item.itemcategory}</Text>
        </View>
        <View style={[styles.switchView, {width: wp(32)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.issued_date}</Text>
          </View>
        </View>
        <View style={[styles.nameDataView, {width: wp(32)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.return_date}</Text>
          </View>
        </View>
        <View style={[styles.nameDataView, {width: wp(26)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.quantity}</Text>
          </View>
        </View>
        <View style={[styles.nameDataView, {width: wp(26)}]}>
          <Text style={[styles.dataHistoryText1]}>{item.status}</Text>
        </View>
        <View style={styles.actionDataView}>
          {/* <TouchableOpacity
            onPress={async () => {
              let allDatas = await onGetSpecificDoctor(item.id);
              setUserId(item.id);
              setCategoryId(allDatas.item_category_id);
              setCategoryName(item.itemcategory);
              setItemId(allDatas?.item_id);
              setItemName(item.item);
              setRoleId(allDatas?.department_id);
              // setRoleName();
              setEmployeeId(allDatas?.user_id);
              // setEmployeeName();
              setIssueDate(new Date(allDatas.issued_date));
              setReturnDate(new Date(allDatas.return_date));
              setQuantity(JSON.stringify(item.quantity));
              setIssueBy(item.issued_by);
              setDescription(allDatas.description);
              setNewAccountVisible(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity> */}
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
      {!newAccountVisible ? (
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
            <View style={styles.filterView2}>
              <TouchableOpacity
                style={styles.filterView1}
                onPress={() => setFilterVisible(true)}>
                <Image style={styles.filterImage} source={filter} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setCategoryId('');
                  setCategoryName('');
                  setItemId('');
                  setItemName('');
                  setRoleId('');
                  setRoleName('');
                  setEmployeeId('');
                  setEmployeeName('');
                  setQuantity('');
                  setIssueBy('');
                  setIssueDate(new Date());
                  setReturnDate(new Date());
                  setAvailableQty('0');
                  setDescription('');
                  setErrorMessage('');
                  setErrorVisible(false);
                  setNewAccountVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>New Issued Item</Text>
              </TouchableOpacity>
            </View>
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

          <View
            style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View
                  style={[
                    styles.titleActiveView,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(30), textAlign: 'left'},
                    ]}>
                    {'ITEM'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(35)}]}>
                    {'ITEM CATEGORY'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(32)}]}>
                    {'ISSUE DATE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(32)}]}>
                    {'RETURN DATE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(26)}]}>
                    {'QUANTITY'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(26)}]}>
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
              New Issued Item
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setNewAccountVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileView}>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>User Type:</Text>
                <SelectDropdown
                  data={roleData}
                  onSelect={(selectedItem, index) => {
                    setRoleName(selectedItem.name);
                    setRoleId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={roleName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {roleId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {roleId == selectedItem?.id
                              ? selectedItem?.name
                              : roleName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select User Type'}
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
                <Text style={styles.dataHistoryText1}>Issue To:</Text>
                <SelectDropdown
                  data={accountantData1}
                  disabled={accountantData1.length > 0 ? false : true}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setEmployeeName(selectedItem.name);
                    setEmployeeId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={employeeName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View
                        style={[
                          styles.dropdown2BtnStyle2,
                          {
                            backgroundColor:
                              accountantData1.length > 0 ? '#fff' : '#c2c2c2',
                          },
                        ]}>
                        {employeeId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {employeeId == selectedItem?.id
                              ? selectedItem?.name
                              : employeeName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select User'}
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
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Issue By:
                </Text>
                <TextInput
                  value={issueBy}
                  placeholder={'Issue By'}
                  onChangeText={text => setIssueBy(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Issue Date:
                </Text>
                <Text
                  style={[
                    styles.nameTextView,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}
                  onPress={() => setDateModalVisible(!dateModalVisible)}>
                  {moment(issueDate).format('DD/MM/YYYY')}
                </Text>
                <DatePicker
                  open={dateModalVisible}
                  modal={true}
                  date={issueDate}
                  maximumDate={new Date()}
                  mode={'date'}
                  onConfirm={date => {
                    console.log('Console Log>>', date);
                    setDateModalVisible(false);
                    setIssueDate(date);
                  }}
                  onCancel={() => {
                    setDateModalVisible(false);
                  }}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Return Date:
                </Text>
                <Text
                  style={[
                    styles.nameTextView,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}
                  onPress={() => setDateModalVisible1(!dateModalVisible1)}>
                  {moment(returnDate).format('DD/MM/YYYY')}
                </Text>
                <DatePicker
                  open={dateModalVisible1}
                  modal={true}
                  date={issueDate}
                  maximumDate={new Date()}
                  mode={'date'}
                  onConfirm={date => {
                    console.log('Console Log>>', date);
                    setDateModalVisible1(false);
                    setReturnDate(date);
                  }}
                  onCancel={() => {
                    setDateModalVisible1(false);
                  }}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Item Category:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <SelectDropdown
                  data={itemCategory}
                  onSelect={(selectedItem, index) => {
                    setCategoryName(selectedItem.name);
                    setCategoryId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={categoryName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {categoryId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {categoryId == selectedItem?.id
                              ? selectedItem?.name
                              : categoryName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Item Category'}
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
                  Item Name:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <SelectDropdown
                  data={accountantData}
                  disabled={accountantData.length > 0 ? false : true}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setItemId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={itemName}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View
                        style={[
                          styles.dropdown2BtnStyle2,
                          {
                            backgroundColor:
                              accountantData.length > 0 ? '#fff' : '#c2c2c2',
                          },
                        ]}>
                        {itemId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {itemId == selectedItem?.id
                              ? selectedItem?.name
                              : itemName}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Item'}
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
              <View style={{width: '100%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  {`Quantity: (Available Quantity: ${availableQty})`}
                </Text>
                <TextInput
                  value={quantity}
                  placeholder={'Quantity'}
                  onChangeText={text => setQuantity(text)}
                  style={[
                    styles.nameTextView,
                    {
                      width: '100%',
                      backgroundColor:
                        accountantData.length > 0 ? '#fff' : '#c2c2c2',
                    },
                  ]}
                  keyboardType={'number-pad'}
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
              onPress={() => onAddPayRollData()}
              style={styles.nextView}>
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.nextText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewAccountVisible(false)}
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

export default IssuedItemsList;

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
    // justifyContent: 'flex-end',
    // paddingHorizontal: wp(3),
    // paddingBottom: hp(1),
  },
  filterView2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: hp(2),
    width: '100%',
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
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
    textAlign: 'left',
  },
  titleText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    marginHorizontal: wp(3),
    textAlign: 'left',
  },
  dataHistoryView: {
    width: '100%',
    height: hp(8),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
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
    textAlign: 'center',
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
  },
  dataHistoryText6: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
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
    width: wp(30),
    marginHorizontal: wp(2),
    // justifyContent: 'center',
  },
  switchView: {
    width: wp(20),
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
    padding: 8,
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
    marginTop: hp(1.5),
    width: '92%',
    alignSelf: 'center',
  },
  profilePhotoView: {
    borderWidth: 0.5,
    width: wp(26),
    height: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(1),
  },
  profileImage: {
    width: wp(10),
    height: hp(5),
    resizeMode: 'contain',
  },
  profileImage1: {
    width: wp(26),
    height: hp(10),
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
