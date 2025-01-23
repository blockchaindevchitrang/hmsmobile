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
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import {
  onAddAccountListApi,
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetEditAccountDataApi,
  onGetEditCommonJsonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import useOrientation from '../OrientationComponent';

const PathologyTest = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  category,
  parameter,
  totalPage,
  pageCount,
  setPageCount,
}) => {
  const orientation = useOrientation();
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const user_data = useSelector(state => state.user_data);
  const chargeCategoryData = useSelector(state => state.chargeCategoryData);
  const chargeData = useSelector(state => state.chargeData);
  const {theme} = useTheme();
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [testName, setTestName] = useState('');
  const [sortName, setSortName] = useState('');
  const [testType, setTestType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [unit, setUnit] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [method, setMethod] = useState('');
  const [reportDay, setReportDay] = useState('');
  const [chargeId, setChargeId] = useState('');
  const [chargeName, setChargeName] = useState('');
  const [standardCharge, setStandardCharge] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [parameterArray, setParameterArray] = useState([]);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAddPayRollData = async () => {
    try {
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (testName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter test name.');
      } else if (sortName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter short name.');
      } else if (testType == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter test type.');
      } else if (categoryId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select category name.');
      } else if (chargeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select charge category.');
      } else if (standardCharge == '') {
        setErrorVisible(true);
        setErrorMessage('Please select charge category with standard charge.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let parameterId = [];
        let parameterResult = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (!item.parameter_id || !item.patient_result) {
            hasEmptyFields = true;
          } else {
            parameterId.push(item.parameter_id);
            parameterResult.push(item.patient_result);
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

        const urlData = 'pathology-test-store';
        let raw = JSON.stringify({
          test_name: testName,
          short_name: sortName,
          test_type: testType,
          category_id: categoryId,
          unit: unit,
          subcategory: subCategory,
          method: method,
          report_days: reportDay,
          charge_category_id: chargeId,
          patient_id: patientId,
          standard_charge: standardCharge,
          parameter_id: parameterId,
          patient_result: parameterResult,
        });
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
      } else if (testName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter test name.');
      } else if (sortName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter short name.');
      } else if (testType == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter test type.');
      } else if (categoryId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select category name.');
      } else if (chargeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select charge category.');
      } else if (standardCharge == '') {
        setErrorVisible(true);
        setErrorMessage('Please select charge category with standard charge.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let parameterId = [];
        let parameterResult = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (!item.parameter_id || !item.patient_result) {
            hasEmptyFields = true;
          } else {
            parameterId.push(item.parameter_id);
            parameterResult.push(item.patient_result);
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
          test_name: testName,
          short_name: sortName,
          test_type: testType,
          category_id: categoryId,
          unit: unit,
          subcategory: subCategory,
          method: method,
          report_days: reportDay,
          charge_category_id: chargeId,
          patient_id: patientId,
          standard_charge: standardCharge,
          parameter_id: parameterId,
          patient_result: parameterResult,
        });
        const urlData = `pathology-parameter-update/${userId}`;
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
      const response = await onDeleteCommonApi(`pathology-test-delete/${id}`);
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
        <View style={[styles.switchView, {width: wp(30)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.test_name}</Text>
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
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(30) : wp(26)},
          ]}>
          {item.short_name}
        </Text>
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(30) : wp(26)},
          ]}>
          {item.test_type}
        </Text>
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(35) : wp(28)},
          ]}>
          {item.category_name}
        </Text>
        <Text
          style={[
            styles.dataHistoryText1,
            {width: isPortrait ? wp(35) : wp(28)},
          ]}>
          {item.charge_category}
        </Text>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let allDatas = await onGetSpecificDoctor(item.id);
              setUserId(item.id);
              setPatientId(allDatas.pathologyTest.patient_id);
              setPatientName(item.patient_name);
              setTestName(item.test_name);
              setTestType(item.test_type);
              setSortName(item.short_name);
              setMethod(allDatas.pathologyTest.method);
              setCategoryId(allDatas.pathologyTest.category_id);
              setCategoryName(item.category_name);
              setUnit(JSON.stringify(allDatas.pathologyTest.unit));
              setSubCategory(allDatas.pathologyTest.subcategory);
              setReportDay(JSON.stringify(allDatas.pathologyTest.report_days));
              setChargeId(allDatas.pathologyTest.charge_category_id);
              setChargeName(item.charge_category);
              setStandardCharge(
                JSON.stringify(allDatas.pathologyTest.standard_charge),
              );
              if (allDatas.pathologyParameterItems.length > 0) {
                allDatas.pathologyParameterItems.map(item1 => {
                  parameterArray.push({
                    parameter_id: item1.parameter_id,
                    parameter_name: item1.pathology_parameter
                      ? item1.pathology_parameter.parameter_name
                      : '',
                    patient_result: item1.patient_result,
                    range: item1.pathology_parameter
                      ? item1.pathology_parameter.reference_range
                      : '',
                    unit: item1.pathology_parameter
                      ? item1.pathology_parameter.pathology_unit.name
                      : '',
                  });
                });
              } else {
                parameterArray.push({
                  parameter_id: '',
                  parameter_name: '',
                  patient_result: '',
                  range: '',
                  unit: '',
                });
              }
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
            {!isPortrait && (
              <View style={styles.filterView}>
                <TouchableOpacity
                  onPress={() => {
                    setUserId('');
                    setPatientId('');
                    setPatientName('');
                    setTestName('');
                    setTestType('');
                    setSortName('');
                    setMethod('');
                    setCategoryId('');
                    setCategoryName('');
                    setUnit('');
                    setSubCategory('');
                    setReportDay('');
                    setChargeId('');
                    setChargeName('');
                    setStandardCharge('');
                    parameterArray.push({
                      parameter_id: '',
                      parameter_name: '',
                      patient_result: '',
                      range: '',
                      unit: '',
                    });
                    setErrorMessage('');
                    setErrorVisible(false);
                    setNewUserVisible(true);
                  }}
                  style={styles.actionView}>
                  <Text style={styles.actionText}>New Pathology Test</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {isPortrait && (
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setUserId('');
                  setPatientId('');
                  setPatientName('');
                  setTestName('');
                  setTestType('');
                  setSortName('');
                  setMethod('');
                  setCategoryId('');
                  setCategoryName('');
                  setUnit('');
                  setSubCategory('');
                  setReportDay('');
                  setChargeId('');
                  setChargeName('');
                  setStandardCharge('');
                  parameterArray.push({
                    parameter_id: '',
                    parameter_name: '',
                    patient_result: '',
                    range: '',
                    unit: '',
                  });
                  setErrorMessage('');
                  setErrorVisible(false);
                  setNewUserVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>New Pathology Test</Text>
              </TouchableOpacity>
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
                  <Text style={[styles.titleText, {width: wp(30)}]}>
                    {'TEST NAME'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(55) : wp(45)},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(30) : wp(26)},
                    ]}>
                    {'SHORT NAME'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(30) : wp(26)},
                    ]}>
                    {'TEST TYPE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(35) : wp(28)},
                    ]}>
                    {'CATEGORY NAME'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(35) : wp(28)},
                    ]}>
                    {'CHARGE CATEGORY'}
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
              Add New Pathology Test
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setParameterArray([]);
                  setNewUserVisible(false);
                }}
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
                  <Text style={styles.dataHistoryText6}>Test Name:</Text>
                  <TextInput
                    value={testName}
                    placeholder={'Test name'}
                    onChangeText={text => setTestName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Short Name:</Text>
                  <TextInput
                    value={sortName}
                    placeholder={'Short Name'}
                    onChangeText={text => setSortName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Test Type:</Text>
                  <TextInput
                    value={testType}
                    placeholder={'Test Type'}
                    onChangeText={text => setTestType(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Category Name:</Text>
                  <SelectDropdown
                    data={category}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
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
                              {selectedItem?.name || 'Select Category'}
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

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Unit:</Text>
                  <TextInput
                    value={unit}
                    placeholder={'Unit'}
                    onChangeText={text => setUnit(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Sub Category:</Text>
                  <TextInput
                    value={subCategory}
                    placeholder={'Sub Category'}
                    onChangeText={text => setSubCategory(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Method:</Text>
                  <TextInput
                    value={method}
                    placeholder={'Method'}
                    onChangeText={text => setMethod(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Report Days:</Text>
                  <TextInput
                    value={reportDay}
                    placeholder={'Report Days'}
                    onChangeText={text => setReportDay(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Charge Category:</Text>
                  <SelectDropdown
                    data={chargeCategoryData}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setChargeId(selectedItem.id);
                      for (const item of chargeData) {
                        if (item.charge_category_id == selectedItem.name) {
                          console.log('Get Value:::', item.standard_charge);
                          setStandardCharge(
                            JSON.stringify(item.standard_charge),
                          );
                          setRefresh(!refresh);
                          break; // Exit the loop immediately after finding the match
                        }
                      }
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={chargeName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {chargeId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {chargeId == selectedItem?.id
                                ? selectedItem?.name
                                : chargeName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Charge'}
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
                  <Text style={styles.dataHistoryText6}>Standard Charge:</Text>
                  <TextInput
                    value={standardCharge}
                    placeholder={'Standard Charge'}
                    onChangeText={text => setStandardCharge(text)}
                    style={[styles.nameTextVie1, {width: '100%'}]}
                    editable={false}
                  />
                </View>
              </View>
              <Text style={styles.parameterView}>Parameter</Text>
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
                        <View style={{width: '48%'}}>
                          <SelectDropdown
                            data={parameter}
                            onSelect={(selectedItem, index1) => {
                              // setSelectedColor(selectedItem);
                              // setCategoryId(selectedItem.id);
                              parameterArray[index].parameter_id =
                                selectedItem.id;
                              parameterArray[index].parameter_name =
                                selectedItem.parameter_name;
                              parameterArray[index].range =
                                selectedItem.reference_range;
                              parameterArray[index].unit = selectedItem.unit;
                              console.log('gert Value:::', parameterArray);
                              setRefresh(!refresh);
                            }}
                            defaultValue={item.parameter_name}
                            renderButton={(selectedItem, isOpen) => {
                              console.log('Get Response>>>', selectedItem);
                              return (
                                <View style={styles.dropdown2BtnStyle2}>
                                  {item.parameter_id != '' ? (
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item.parameter_id == selectedItem?.id
                                        ? selectedItem?.parameter_name
                                        : item.parameter_name}
                                    </Text>
                                  ) : (
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {selectedItem?.parameter_name ||
                                        'Select Parameter'}
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
                                    {item?.parameter_name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={styles.dropdown2DropdownStyle}
                          />
                        </View>

                        <View style={{width: '48%'}}>
                          <TextInput
                            value={item.patient_result}
                            placeholder={'Patient Result'}
                            onChangeText={text => {
                              setRefresh(!refresh);
                              parameterArray[index].patient_result = text;
                            }}
                            style={[styles.nameTextView, {width: '100%'}]}
                            keyboardType={'number-pad'}
                          />
                        </View>
                      </View>

                      <View style={styles.nameView}>
                        <View style={{width: '48%'}}>
                          <TextInput
                            editable={false}
                            value={item.range}
                            placeholder={'Reference Range'}
                            style={[styles.nameTextVie1, {width: '100%'}]}
                          />
                        </View>

                        <View style={{width: '48%'}}>
                          <TextInput
                            editable={false}
                            value={item.unit}
                            placeholder={'Unit'}
                            style={[styles.nameTextVie1, {width: '100%'}]}
                          />
                        </View>
                      </View>
                      {index <= 0 ? (
                        <View style={styles.buttonView}>
                          <TouchableOpacity
                            onPress={() => {
                              let NewItemAdd = {
                                parameter_id: '',
                                parameter_name: '',
                                patient_result: '',
                                range: '',
                                unit: '',
                              };
                              setParameterArray(modifierAdd => [
                                ...modifierAdd,
                                NewItemAdd,
                              ]);
                            }}
                            style={styles.nextView}>
                            <Text style={styles.nextText}>Add</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.buttonView}>
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
                      )}
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
          ) : (
            <View style={styles.profileView}>
              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Patient:</Text>
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
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Test Name:</Text>
                  <TextInput
                    value={testName}
                    placeholder={'Test name'}
                    onChangeText={text => setTestName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Short Name:</Text>
                  <TextInput
                    value={sortName}
                    placeholder={'Short Name'}
                    onChangeText={text => setSortName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Test Type:</Text>
                  <TextInput
                    value={testType}
                    placeholder={'Test Type'}
                    onChangeText={text => setTestType(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Category Name:</Text>
                  <SelectDropdown
                    data={category}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
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
                              {selectedItem?.name || 'Select Category'}
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
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Unit:</Text>
                  <TextInput
                    value={unit}
                    placeholder={'Unit'}
                    onChangeText={text => setUnit(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Sub Category:</Text>
                  <TextInput
                    value={subCategory}
                    placeholder={'Sub Category'}
                    onChangeText={text => setSubCategory(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Method:</Text>
                  <TextInput
                    value={method}
                    placeholder={'Method'}
                    onChangeText={text => setMethod(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '32%'}}>
                  <Text style={styles.dataHistoryText6}>Report Days:</Text>
                  <TextInput
                    value={reportDay}
                    placeholder={'Report Days'}
                    onChangeText={text => setReportDay(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Charge Category:</Text>
                  <SelectDropdown
                    data={chargeCategoryData}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setChargeId(selectedItem.id);
                      for (const item of chargeData) {
                        if (item.charge_category_id == selectedItem.name) {
                          console.log('Get Value:::', item.standard_charge);
                          setStandardCharge(
                            JSON.stringify(item.standard_charge),
                          );
                          setRefresh(!refresh);
                          break; // Exit the loop immediately after finding the match
                        }
                      }
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={chargeName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {chargeId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {chargeId == selectedItem?.id
                                ? selectedItem?.name
                                : chargeName}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.name || 'Select Charge'}
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
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText6}>Standard Charge:</Text>
                  <TextInput
                    value={standardCharge}
                    placeholder={'Standard Charge'}
                    onChangeText={text => setStandardCharge(text)}
                    style={[styles.nameTextVie1, {width: '100%'}]}
                    editable={false}
                  />
                </View>
              </View>
              <Text style={styles.parameterView}>Parameter</Text>
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
                        paddingHorizontal: wp(3),
                      }}>
                      <View style={styles.nameView}>
                        <View style={{width: '48%'}}>
                          <SelectDropdown
                            data={parameter}
                            onSelect={(selectedItem, index1) => {
                              // setSelectedColor(selectedItem);
                              // setCategoryId(selectedItem.id);
                              parameterArray[index].parameter_id =
                                selectedItem.id;
                              parameterArray[index].parameter_name =
                                selectedItem.parameter_name;
                              parameterArray[index].range =
                                selectedItem.reference_range;
                              parameterArray[index].unit = selectedItem.unit;
                              console.log('gert Value:::', parameterArray);
                              setRefresh(!refresh);
                            }}
                            defaultValue={item.parameter_name}
                            renderButton={(selectedItem, isOpen) => {
                              console.log('Get Response>>>', selectedItem);
                              return (
                                <View style={styles.dropdown2BtnStyle2}>
                                  {item.parameter_id != '' ? (
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item.parameter_id == selectedItem?.id
                                        ? selectedItem?.parameter_name
                                        : item.parameter_name}
                                    </Text>
                                  ) : (
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {selectedItem?.parameter_name ||
                                        'Select Parameter'}
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
                                    {item?.parameter_name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={styles.dropdown2DropdownStyle}
                          />
                        </View>

                        <View style={{width: '48%'}}>
                          <TextInput
                            value={item.patient_result}
                            placeholder={'Patient Result'}
                            onChangeText={text => {
                              setRefresh(!refresh);
                              parameterArray[index].patient_result = text;
                            }}
                            style={[styles.nameTextView, {width: '100%'}]}
                            keyboardType={'number-pad'}
                          />
                        </View>
                      </View>

                      <View style={styles.nameView}>
                        <View style={{width: '48%'}}>
                          <TextInput
                            editable={false}
                            value={item.range}
                            placeholder={'Reference Range'}
                            style={[styles.nameTextVie1, {width: '100%'}]}
                          />
                        </View>

                        <View style={{width: '48%'}}>
                          <TextInput
                            editable={false}
                            value={item.unit}
                            placeholder={'Unit'}
                            style={[styles.nameTextVie1, {width: '100%'}]}
                          />
                        </View>
                      </View>
                      {index <= 0 ? (
                        <View style={[styles.buttonView, {marginLeft: wp(5)}]}>
                          <TouchableOpacity
                            onPress={() => {
                              let NewItemAdd = {
                                parameter_id: '',
                                parameter_name: '',
                                patient_result: '',
                                range: '',
                                unit: '',
                              };
                              setParameterArray(modifierAdd => [
                                ...modifierAdd,
                                NewItemAdd,
                              ]);
                            }}
                            style={styles.nextView}>
                            <Text style={styles.nextText}>Add</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.buttonView}>
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
                      )}
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
              onPress={() => {
                setParameterArray([]);
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

export default PathologyTest;

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
    marginBottom: hp(1),
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
  dataHistoryText6: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  dataHistoryText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    marginHorizontal: wp(2),
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
    backgroundColor: COLORS.lightGreyColor,
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
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
    marginTop: hp(3),
    paddingLeft: wp(3),
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
  dataHistoryText6: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  dataHistoryText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    marginHorizontal: wp(2),
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
    width: wp(45),
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
    backgroundColor: COLORS.lightGreyColor,
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
    width: '96%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    height: hp(4),
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
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
    marginTop: hp(3),
    paddingLeft: wp(3),
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
