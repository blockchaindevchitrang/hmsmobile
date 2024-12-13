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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from './../ProfilePhoto';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import filter from '../../images/filter.png';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
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

const monthData = [
  {id: 1, name: 'January'},
  {id: 2, name: 'February'},
  {id: 3, name: 'March'},
  {id: 4, name: 'April'},
  {id: 5, name: 'May'},
  {id: 6, name: 'June'},
  {id: 7, name: 'July'},
  {id: 8, name: 'August'},
  {id: 9, name: 'September'},
  {id: 10, name: 'October'},
  {id: 11, name: 'November'},
  {id: 12, name: 'December'},
];

const statusData = [
  {id: 0, name: 'Unpaid'},
  {id: 1, name: 'Paid'},
];

const filterArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Paid'},
  {id: 3, name: 'Unpaid'},
];

const PayrollList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  setStatusId1,
  statusId1,
}) => {
  const roleData = useSelector(state => state.roleData);
  const allUserData = useSelector(state => state.allUserData);
  const {theme} = useTheme();
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [srNo, setSrNo] = useState('');
  const [role, setRole] = useState('');
  const [roleId, setRoleId] = useState('');
  const [employee, setEmployee] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState('');
  const [monthId, setMonthId] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [statusId, setStatusId] = useState('0');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowance, setAllowance] = useState('');
  const [deductions, setDeductions] = useState('');
  const [netSalary, setNetSalary] = useState('0');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  let accountantData = allUserData.filter(user => user.department === role);
  useEffect(() => {
    if (accountantData.length > 0) {
      setEmployeeId(accountantData[0].id);
      setEmployee(accountantData[0].name);
    } else {
      setEmployeeId('');
      setEmployee('');
    }
  }, [accountantData]);

  const onAddPayRollData = async () => {
    try {
      if (srNo == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter employee srNo.');
      } else if (roleId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select employee role.');
      } else if (monthId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select employee payroll month.');
      } else if (year == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter employee payroll year.');
      } else if (statusId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select status paid or not.');
      } else if (basicSalary == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter employee basic salary.');
      } else if (allowance == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter allowance number.');
      } else if (allowance == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter deductions number.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const urlData = `emplloyee-payroll-create?sr_no=${srNo}&owner_id=${employeeId}&owner_type=${roleId}&month=${monthId}&year=${year}&net_salary=${netSalary}&basic_salary=${basicSalary}&allowance=${allowance}&deductions=${deductions}`;
        const response = await onAddAccountListApi(urlData);
        if (response.status == 200) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
          showMessage({
            message: 'Record Added Successfully',
            type: 'success',
            duration: 3000,
          });
        }
      }
    } catch (err) {
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      setLoading(false);
      console.log('Error:', err);
    }
  };

  const onEditPayRollData = async () => {
    try {
      if (srNo == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter employee srNo.');
      } else if (roleId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select employee role.');
      } else if (monthId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select employee payroll month.');
      } else if (year == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter employee payroll year.');
      } else if (statusId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select status paid or not.');
      } else if (basicSalary == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter employee basic salary.');
      } else if (allowance == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter allowance number.');
      } else if (allowance == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter deductions number.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const urlData = `emplloyee-payroll-update/${userId}?sr_no=${srNo}&owner_id=${employeeId}&owner_type=${roleId}&month=${monthId}&year=${year}&net_salary=${netSalary}&basic_salary=${basicSalary}&allowance=${allowance}&deductions=${deductions}`;
        const response = await onGetEditAccountDataApi(urlData);
        if (response.status == 200) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
          showMessage({
            message: 'Record Edit Successfully',
            type: 'success',
            duration: 3000,
          });
        }
      }
    } catch (err) {
      setLoading(false);
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error:', err);
    }
  };

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificCommonApi(
        `emplloyee-payroll-edit/${id}`,
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

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(
        `emplloyee-payroll-delete/${id}`,
      );
      if (response.status == 200) {
        onGetData();
        setLoading(false);
        setDeleteUser(false);
        showMessage({
          message: 'Record Delete Successfully',
          type: 'success',
          duration: 3000,
        });
      }
    } catch (err) {
      setLoading(false);
      setDeleteUser(false);
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
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
        <Text style={[styles.dataHistoryText, {width: wp(14)}]}>
          {item.sr_no}
        </Text>
        <View style={[styles.switchView, {width: wp(26)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.payroll_id}</Text>
          </View>
        </View>
        <View style={[styles.nameDataView]}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.mail}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(16)}]}>
          {item.month}
        </Text>
        <Text style={[styles.dataHistoryText, {width: wp(16)}]}>
          {item.year}
        </Text>
        <Text style={[styles.dataHistoryText, {width: wp(24)}]}>
          {item.net_salary}
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
              setUserId(item.id);
              setRole(allDatas.employeePayroll.type_string);
              const matchingKey = Object.entries(allDatas?.types).find(
                ([key, value]) =>
                  value === allDatas.employeePayroll.type_string,
              )?.[0];
              setRoleId(matchingKey);
              accountantData = allUserData.filter(
                user =>
                  user.department === allDatas.employeePayroll.type_string,
              );
              console.log('Get ImageLLLL', accountantData);
              setEmployeeId(allDatas.employeePayroll.owner_id);
              setEmployee(item.name);
              setMonth(item.month);
              setMonthId(allDatas.employeePayroll.month);
              setStatus(item.status);
              setStatusId(allDatas.employeePayroll.status);
              setSrNo(JSON.stringify(allDatas.employeePayroll.sr_no));
              setBasicSalary(
                JSON.stringify(allDatas.employeePayroll.basic_salary),
              );
              setAllowance(JSON.stringify(allDatas.employeePayroll.allowance));
              setDeductions(
                JSON.stringify(allDatas.employeePayroll.deductions),
              );
              setNetSalary(JSON.stringify(allDatas.employeePayroll.net_salary));
              setYear(JSON.stringify(item.year));
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

  const onSalaryCalculation = async () => {
    if (basicSalary != '' && allowance != '' && deductions != '') {
      setNetSalary(
        JSON.stringify(
          parseInt(basicSalary) + parseInt(allowance) - parseInt(deductions),
        ),
      );
    } else {
      setNetSalary('0');
    }
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
            <TouchableOpacity
              style={styles.filterView1}
              onPress={() => setFilterVisible(true)}>
              <Image style={styles.filterImage} source={filter} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSrNo('');
                setRole('');
                setRoleId('');
                setEmployee('');
                setEmployeeId('');
                setMonth('');
                setMonthId('');
                setYear('');
                setStatus('');
                setStatusId('');
                setBasicSalary('');
                setAllowance('');
                setDeductions('');
                setNetSalary('0');
                setErrorVisible(false);
                setErrorMessage('');
                setNewUserVisible(true);
              }}
              style={styles.actionView}>
              <Text style={styles.actionText}>New Employee Payroll</Text>
            </TouchableOpacity>
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
                        setStatusId1(selectedItem.id);
                        // setStatusShow(
                        //   selectedItem.id == 2
                        //     ? 'pending'
                        //     : selectedItem.id == 3
                        //     ? 'completed'
                        //     : selectedItem.id == 4
                        //     ? 'cancelled'
                        //     : '',
                        // );
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValueByIndex={statusId1 - 1}
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
                        onPress={() => setStatusId1(1)}
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
                  <Text style={[styles.titleText, {width: wp(14)}]}>
                    {'SR NO'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(26)}]}>
                    {'PAYROLL ID'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(55), textAlign: 'left'},
                    ]}>
                    {'EMPLOYEE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(16)}]}>
                    {'MONTH'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(16)}]}>
                    {'YEAR'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'NET SALARY'}
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
              Create Employee Payroll
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
                <Text style={styles.dataHistoryText1}>Sr No</Text>
                <TextInput
                  value={srNo}
                  placeholder={'Sr No'}
                  onChangeText={text => setSrNo(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Role:</Text>
                <SelectDropdown
                  data={roleData}
                  onSelect={(selectedItem, index) => {
                    setRole(selectedItem.name);
                    setRoleId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={role}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {roleId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {roleId == selectedItem?.id
                              ? selectedItem?.name
                              : role}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Role'}
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
                <Text style={styles.dataHistoryText1}>Employee:</Text>
                <SelectDropdown
                  data={accountantData}
                  disabled={accountantData.length > 0 ? false : true}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setEmployeeId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={employee}
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
                        {employeeId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {employeeId == selectedItem?.id
                              ? selectedItem?.name
                              : employee}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Employee'}
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
                <Text style={styles.dataHistoryText1}>Month:</Text>
                <SelectDropdown
                  data={monthData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setMonthId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={month}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {monthId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {monthId == selectedItem?.id
                              ? selectedItem?.name
                              : month}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.name || 'Select Month'}
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
                <Text style={styles.dataHistoryText1}>Year:</Text>
                <TextInput
                  value={year}
                  placeholder={'Year'}
                  onChangeText={text => setYear(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  secureTextEntry={true}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Status:</Text>
                <SelectDropdown
                  data={statusData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setStatusId(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={status}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {statusId != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {statusId == selectedItem?.id
                              ? selectedItem?.name
                              : status}
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
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Basic Salary:</Text>
                <TextInput
                  value={basicSalary}
                  placeholder={'Basic Salary'}
                  onChangeText={text => setBasicSalary(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  onBlur={() => onSalaryCalculation()}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Allowance:</Text>
                <TextInput
                  value={allowance}
                  placeholder={'Allowance'}
                  onChangeText={text => setAllowance(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  onBlur={() => onSalaryCalculation()}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Deductions:</Text>
                <TextInput
                  value={deductions}
                  placeholder={'Deductions'}
                  onChangeText={text => setDeductions(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  onBlur={() => onSalaryCalculation()}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Net Salary:</Text>
                <TextInput
                  value={netSalary}
                  placeholder={'Net Salary'}
                  editable={false}
                  onChangeText={text => setNetSalary(text)}
                  style={[styles.nameTextVie1, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              {errorVisible ? (
                <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => {
                userId != '' ? onEditPayRollData() : onAddPayRollData();
              }}
              style={styles.nextView}>
              <Text style={styles.nextText}>Save</Text>
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

export default PayrollList;

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
    height: hp(5),
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
