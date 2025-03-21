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
import moment from 'moment';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import filter from '../../images/filter.png';
import man from '../../images/man.png';
import draw from '../../images/draw.png';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {
  onAddAccountListApi,
  onAddUsersApi,
  onDeleteUserDataApi,
  onGetSpecificUsersDataApi,
  onUpdateUserDataApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import {showMessage} from 'react-native-flash-message';
import useOrientation from '../OrientationComponent';

// const filterArray = [
//   {id: 1, name: 'All'},
//   {id: 2, name: 'Active'},
//   {id: 3, name: 'Deactive'},
// ];

let filterArray = [{id: 0, name: 'All'}];

const typeArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Active'},
  {id: 3, name: 'Deactive'},
];

const UserList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  pageCount,
  setPageCount,
  totalPage,
  setStatusId,
  statusId,
  setTypeId,
  typeId,
  setUserTypeName,
  userTypeName,
  userAction,
}) => {
  const roleData = useSelector(state => state.roleData);
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [genderType, setGenderType] = useState('female');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [doctorSelectedName, setDoctorSelectedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setUserList(allData);
  }, [allData]);

  useEffect(() => {
    try {
      const matchingKey = [];
      roleData.map((item, index) => {
        matchingKey.push({id: index + 1, name: item.name});
      });
      filterArray = [...filterArray, ...matchingKey];
      setRoleList(filterArray);
      setRefresh(!refresh);
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  }, []);

  const openProfileImagePicker = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        multiple: false, // Allow selecting only one image
        compressImageQuality: 0.5,
      });

      if (image && image.path) {
        if (image && image.path) {
          var filename = image.path.substring(image.path.lastIndexOf('/') + 1);
          let imageData = {
            uri: Platform.OS === 'ios' ? image.sourceURL : image.path,
            type: image.mime,
            name: Platform.OS === 'ios' ? image.filename : filename,
          };
          setAvatar(imageData);

          console.log('Selected image:', avatar);
        }
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificUsersDataApi(id);
      if (response.status == 200) {
        console.log('get ValueLL:::', response.data.message);
        return response.data.message;
      } else {
        return 0;
      }
    } catch (err) {
      console.log('Get Error', err);
    }
  };

  const isImageFormat = url => {
    return (
      url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')
    );
  };

  function parseFileFromUrl(url) {
    // Extract the filename from the URL
    const name = url.split('/').pop();

    // Extract the file extension
    const extension = name.split('.').pop();

    // Define the MIME type based on the file extension
    let type;
    switch (extension) {
      case 'jpeg':
      case 'jpg':
        type = 'image/jpeg';
        break;
      case 'png':
        type = 'image/png';
        break;

      default:
        type = 'application/octet-stream'; // Fallback type for unknown extensions
    }

    // Return the extracted information
    return {
      uri: url,
      type,
      name,
    };
  }

  const onChangeVerifyData = async (status, index, id) => {
    try {
      let arrayData = userList;
      arrayData[index].email_verified_at = status ? new Date() : null;

      setUserList(arrayData);
      setRefresh(!refresh);

      const response = await onAddAccountListApi(`users-verified/${id}`);
      console.log('get ValueLL:::', response.data);
      if (response.data.flag == 1) {
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  const onChangeStatusData = async (status, index, item) => {
    try {
      let arrayData = userList;
      arrayData[index].status = status ? 'Active' : 'Inactive';
      setUserList(arrayData);
      setRefresh(!refresh);
      let getData = await onGetSpecificDoctor(item.id);
      const [first, last] = item.name.split(',');
      const formdata = new FormData();
      formdata.append('first_name', first);
      formdata.append('last_name', last);
      formdata.append('email', item.email);
      if (isImageFormat(item?.image_url)) {
        formdata.append('image', parseFileFromUrl(item?.image_url));
      }
      formdata.append('status', status ? 1 : 0);
      formdata.append('department_id', getData.department_id);
      formdata.append('country', getData.country);
      formdata.append('city', getData.city);
      formdata.append('postal_code', getData.postal_code);
      formdata.append('address1', getData.address1);
      formdata.append('gender', getData.gender);
      const response = await onUpdateUserDataApi(item.id, formdata);
      console.log('get ValueLL:::', formdata, response.data);
      if (response.data.flag == 1) {
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
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
          style={[
            styles.nameDataView,
            {
              width: isPortrait
                ? wp(60)
                : userAction.includes('status')
                ? wp(40)
                : userAction.includes('edit') || userAction.includes('delete')
                ? wp(64)
                : wp(80),
            },
          ]}>
          {item.name && (
            <ProfilePhoto style={styles.photoStyle} username={item.name} />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text numberOfLines={2} style={[styles.dataHistoryText1]}>
              {item.email}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {
              width: isPortrait
                ? wp(26)
                : userAction.includes('email')
                ? wp(24)
                : wp(50),
              textAlign: 'left',
            },
          ]}>
          {item.department}
        </Text>
        {userAction.includes('email') && (
          <View style={[styles.switchView]}>
            <Switch
              trackColor={{
                false:
                  item.email_verified_at != null
                    ? COLORS.greenColor
                    : COLORS.errorColor,
                true:
                  item.email_verified_at != null
                    ? COLORS.greenColor
                    : COLORS.errorColor,
              }}
              thumbColor={
                item.email_verified_at != null ? '#f4f3f4' : '#f4f3f4'
              }
              ios_backgroundColor={COLORS.errorColor}
              onValueChange={status =>
                onChangeVerifyData(status, index, item.id)
              }
              value={item.email_verified_at != null}
            />
          </View>
        )}
        {userAction.includes('status') && (
          <View
            style={[styles.switchView, {width: isPortrait ? wp(24) : wp(20)}]}>
            <Switch
              trackColor={{
                false:
                  item.status == 'Active'
                    ? COLORS.greenColor
                    : COLORS.errorColor,
                true:
                  item.status == 'Active'
                    ? COLORS.greenColor
                    : COLORS.errorColor,
              }}
              thumbColor={item.status == 'Active' ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor={COLORS.errorColor}
              onValueChange={status => {
                onChangeStatusData(status, index, item);
              }}
              value={item.status == 'Active'}
            />
          </View>
        )}
        {userAction.includes('edit') || userAction.includes('delete') ? (
          <View style={styles.actionDataView}>
            {userAction.includes('edit') && (
              <TouchableOpacity
                onPress={async () => {
                  let getData = await onGetSpecificDoctor(item.id);
                  setUserId(item.id);
                  const [first, last] = item.name.split(',');
                  if (isImageFormat(item?.image_url)) {
                    setAvatar(parseFileFromUrl(item?.image_url));
                  }
                  setFirstName(first);
                  setLastName(last);
                  setEmail(item.email);
                  setRole(getData.department_id);
                  setDoctorSelectedName(item?.department);
                  if (getData.dob != null) {
                    setDateOfBirth(new Date(getData.dob));
                  }
                  setGenderType(getData.gender == 0 ? 'male' : 'female');
                  setAddress(getData.address1);
                  setCity(getData.city);
                  setCountry(getData.country);
                  setPostalCode(getData.postal_code);
                  setNewUserVisible(true);
                }}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.blueColor}]}
                  source={editing}
                />
              </TouchableOpacity>
            )}
            {userAction.includes('delete') && (
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

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email); // Returns true if valid
  };

  const onAddUsers = async () => {
    try {
      if (firstName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter first name.');
      } else if (lastName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter last name.');
      } else if (email == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter email address.');
      } else if (!validateEmail(email)) {
        setErrorVisible(true);
        setErrorMessage('Please enter valid email address.');
      } else if (role == '') {
        setErrorVisible(true);
        setErrorMessage('Please select user role.');
      } else if (password == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter password.');
      } else if (confirmPassword == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter confirm password.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        setErrorMessage('');
        const formdata = new FormData();
        formdata.append('first_name', firstName);
        formdata.append('last_name', lastName);
        formdata.append('email', email);
        formdata.append('password', password);
        formdata.append('password_confirmation', confirmPassword);
        formdata.append('department_id', role);
        formdata.append('country', country);
        formdata.append('city', city);
        formdata.append('dob', moment(dateOfBirth).format('DD/MM/YYYY'));
        formdata.append('postal_code', postalCode);
        formdata.append('address1', address);
        formdata.append('gender', genderType == 'female' ? 1 : 0);
        if (avatar != null) {
          formdata.append('image', avatar);
        }
        const response = await onAddUsersApi(formdata);

        if (response.data.flag == 1) {
          onGetData();
          setNewUserVisible(false);
          setFirstName('');
          setLastName('');
          setEmail('');
          setRole('');
          setDateOfBirth(new Date());
          setGenderType('female');
          setAddress('');
          setCity('');
          setCountry('');
          setPostalCode('');
          showMessage({
            message: 'Record Added Successfully',
            type: 'success',
            duration: 3000,
          });
          setLoading(false);
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
      if (err.response.data) {
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
      console.log('Add User Error:', err);
    }
  };

  const onEditUsers = async () => {
    try {
      if (firstName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter first name.');
      } else if (lastName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter last name.');
      } else if (email == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter email address.');
      } else if (!validateEmail(email)) {
        setErrorVisible(true);
        setErrorMessage('Please enter valid email address.');
      } else if (role == '') {
        setErrorVisible(true);
        setErrorMessage('Please select user role.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        setErrorMessage('');
        const formdata = new FormData();
        formdata.append('first_name', firstName);
        formdata.append('last_name', lastName);
        formdata.append('email', email);
        if (avatar != null) {
          formdata.append('image', avatar);
        }
        formdata.append('department_id', role);
        formdata.append('country', country);
        formdata.append('city', city);
        formdata.append('postal_code', postalCode);
        formdata.append('address1', address);
        formdata.append('gender', genderType == 'female' ? 1 : 0);
        const response = await onUpdateUserDataApi(userId, formdata);

        if (response.data.flag == 1) {
          onGetData();
          setUserId('');
          setFirstName('');
          setLastName('');
          setEmail('');
          setRole('');
          setDateOfBirth(new Date());
          setGenderType('female');
          setAddress('');
          setCity('');
          setCountry('');
          setPostalCode('');
          showMessage({
            message: 'Record Edited Successfully',
            type: 'success',
            duration: 3000,
          });
          setLoading(false);
          setNewUserVisible(false);
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
      if (err.response.data) {
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
      console.log('Add User Error:', err.response.data);
    }
  };

  const onDeleteRecord = async () => {
    try {
      setLoading(true);
      const response = await onDeleteUserDataApi(userId);
      if (response.data.flag == 1) {
        onGetData();
        setUserId('');
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
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error Delete', err.response.data);
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
              {userAction.includes('create') && (
                <TouchableOpacity
                  onPress={() => {
                    setUserId('');
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setRole('');
                    setDateOfBirth(new Date());
                    setGenderType('female');
                    setAddress('');
                    setCity('');
                    setCountry('');
                    setPostalCode('');
                    setErrorVisible(false);
                    setErrorMessage('');
                    setNewUserVisible(true);
                  }}
                  style={styles.actionView}>
                  <Text style={styles.actionText}>New User</Text>
                </TouchableOpacity>
              )}
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
                        data={typeArray}
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
                      <Text style={styles.secondTitleFilter}>Role:</Text>
                      <SelectDropdown
                        data={roleList}
                        onSelect={(selectedItem, index) => {
                          // setSelectedColor(selectedItem);
                          setTypeId(selectedItem.id);
                          setUserTypeName(selectedItem.name);
                          console.log('gert Value:::', selectedItem);
                        }}
                        defaultValueByIndex={typeId}
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
                          onPress={() => {
                            setStatusId(1);
                            setTypeId(0);
                          }}
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
                      {
                        width: isPortrait
                          ? wp(60)
                          : userAction.includes('status')
                          ? wp(40)
                          : userAction.includes('edit') ||
                            userAction.includes('delete')
                          ? wp(64)
                          : wp(80),
                      },
                    ]}>
                    {'USERS'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {
                        width: isPortrait
                          ? wp(26)
                          : userAction.includes('email')
                          ? wp(24)
                          : wp(50),
                      },
                    ]}>
                    {'ROLE'}
                  </Text>
                  {userAction.includes('email') && (
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(24) : wp(22)},
                      ]}>
                      {'EMAIL VERIFIED'}
                    </Text>
                  )}
                  {userAction.includes('status') && (
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(24) : wp(20)},
                      ]}>
                      {'STATUS'}
                    </Text>
                  )}
                  {userAction.includes('edit') ||
                  userAction.includes('delete') ? (
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(16) : wp(12)},
                      ]}>
                      {'ACTION'}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.mainDataView}>
                  <FlatList
                    data={userList}
                    renderItem={renderItem}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={userList.length}
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
              Create User
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
                  <Text style={styles.dataHistoryText1}>FIRST NAME</Text>
                  <TextInput
                    value={firstName}
                    placeholder={'Enter first name'}
                    onChangeText={text => setFirstName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>LAST NAME</Text>
                  <TextInput
                    value={lastName}
                    placeholder={'Enter last name'}
                    onChangeText={text => setLastName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>EMAIL ADDRESS</Text>
                  <TextInput
                    value={email}
                    placeholder={'Enter email'}
                    onChangeText={text => setEmail(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>ROLE</Text>
                  {/* <TextInput
                  value={role}
                  placeholder={'Select'}
                  onChangeText={text => setRole(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                /> */}
                  <SelectDropdown
                    data={roleData}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setRole(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={doctorSelectedName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {role != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {role == selectedItem?.id
                                ? selectedItem?.name
                                : doctorSelectedName}
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
              {userId == '' && (
                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>PASSWORD</Text>
                    <TextInput
                      value={password}
                      placeholder={'******'}
                      onChangeText={text => setPassword(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
              )}
              {userId == '' && (
                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>
                      CONFIRM PASSWORD
                    </Text>
                    <TextInput
                      value={confirmPassword}
                      placeholder={'******'}
                      onChangeText={text => setConfirmPassword(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
              )}
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>DATE OF BIRTH</Text>
                  {/* <TextInput
                  value={firstName}
                  placeholder={'Enter first name'}
                  onChangeText={text => setFirstName(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                /> */}
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

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>GENDER</Text>
                  <View style={[styles.statusView, {paddingVertical: hp(1)}]}>
                    <View style={[styles.optionView]}>
                      <TouchableOpacity
                        onPress={() => setGenderType('female')}
                        style={[
                          styles.roundBorder,
                          {
                            backgroundColor:
                              genderType == 'female'
                                ? COLORS.blueColor
                                : COLORS.white,
                            borderWidth: genderType == 'female' ? 0 : 0.5,
                          },
                        ]}>
                        <View style={styles.round} />
                      </TouchableOpacity>
                      <Text style={styles.statusText}>Female</Text>
                    </View>
                    <View style={[styles.optionView]}>
                      <TouchableOpacity
                        onPress={() => setGenderType('male')}
                        style={[
                          styles.roundBorder,
                          {
                            backgroundColor:
                              genderType == 'male'
                                ? COLORS.blueColor
                                : COLORS.white,
                            borderWidth: genderType == 'male' ? 0 : 0.5,
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
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>ADDRESS</Text>
                  <TextInput
                    value={address}
                    placeholder={'address'}
                    onChangeText={text => setAddress(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>CITY</Text>
                  <TextInput
                    value={city}
                    placeholder={'Enter city'}
                    onChangeText={text => setCity(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>COUNTRY</Text>
                  <TextInput
                    value={country}
                    placeholder={'Enter country'}
                    onChangeText={text => setCountry(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>POSTAL CODE</Text>
                  <TextInput
                    value={postalCode}
                    placeholder={'Postal Code'}
                    onChangeText={text => setPostalCode(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View>
                  <Text style={styles.dataHistoryText5}>PROFILE</Text>
                  <View style={styles.profilePhotoView}>
                    <TouchableOpacity
                      style={styles.editView}
                      onPress={() => openProfileImagePicker()}>
                      <Image style={styles.editImage1} source={draw} />
                    </TouchableOpacity>
                    <Image
                      style={styles.profileImage}
                      source={avatar != null ? {uri: avatar?.uri} : man}
                    />
                  </View>
                </View>
              </View>
              {errorVisible ? (
                <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.profileView}>
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>FIRST NAME</Text>
                  <TextInput
                    value={firstName}
                    placeholder={'Enter first name'}
                    onChangeText={text => setFirstName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>LAST NAME</Text>
                  <TextInput
                    value={lastName}
                    placeholder={'Enter last name'}
                    onChangeText={text => setLastName(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '49%'}}>
                  <Text style={styles.dataHistoryText1}>EMAIL ADDRESS</Text>
                  <TextInput
                    value={email}
                    placeholder={'Enter email'}
                    onChangeText={text => setEmail(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '49%'}}>
                  <Text style={styles.dataHistoryText1}>ROLE</Text>
                  <SelectDropdown
                    data={roleData}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setRole(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={doctorSelectedName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {role != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {role == selectedItem?.id
                                ? selectedItem?.name
                                : doctorSelectedName}
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

              {/* <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>ROLE</Text>
                  <SelectDropdown
                    data={roleData}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setRole(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={doctorSelectedName}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {role != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {role == selectedItem?.id
                                ? selectedItem?.name
                                : doctorSelectedName}
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
              </View> */}
              {userId == '' && (
                <View style={styles.nameView}>
                  <View style={{width: '49%'}}>
                    <Text style={styles.dataHistoryText1}>PASSWORD</Text>
                    <TextInput
                      value={password}
                      placeholder={'******'}
                      onChangeText={text => setPassword(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                      secureTextEntry={true}
                    />
                  </View>
                  <View style={{width: '49%'}}>
                    <Text style={styles.dataHistoryText1}>
                      CONFIRM PASSWORD
                    </Text>
                    <TextInput
                      value={confirmPassword}
                      placeholder={'******'}
                      onChangeText={text => setConfirmPassword(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                      secureTextEntry={true}
                    />
                  </View>
                </View>
              )}
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>DATE OF BIRTH</Text>
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

                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>GENDER</Text>
                  <View style={[styles.statusView, {paddingVertical: hp(1)}]}>
                    <View style={[styles.optionView]}>
                      <TouchableOpacity
                        onPress={() => setGenderType('female')}
                        style={[
                          styles.roundBorder,
                          {
                            backgroundColor:
                              genderType == 'female'
                                ? COLORS.blueColor
                                : COLORS.white,
                            borderWidth: genderType == 'female' ? 0 : 0.5,
                          },
                        ]}>
                        <View style={styles.round} />
                      </TouchableOpacity>
                      <Text style={styles.statusText}>Female</Text>
                    </View>
                    <View style={[styles.optionView]}>
                      <TouchableOpacity
                        onPress={() => setGenderType('male')}
                        style={[
                          styles.roundBorder,
                          {
                            backgroundColor:
                              genderType == 'male'
                                ? COLORS.blueColor
                                : COLORS.white,
                            borderWidth: genderType == 'male' ? 0 : 0.5,
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
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>ADDRESS</Text>
                  <TextInput
                    value={address}
                    placeholder={'address'}
                    onChangeText={text => setAddress(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '31%'}}>
                  <Text style={styles.dataHistoryText1}>CITY</Text>
                  <TextInput
                    value={city}
                    placeholder={'Enter city'}
                    onChangeText={text => setCity(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>

                <View style={{width: '31%'}}>
                  <Text style={styles.dataHistoryText1}>COUNTRY</Text>
                  <TextInput
                    value={country}
                    placeholder={'Enter country'}
                    onChangeText={text => setCountry(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '31%'}}>
                  <Text style={styles.dataHistoryText1}>POSTAL CODE</Text>
                  <TextInput
                    value={postalCode}
                    placeholder={'Postal Code'}
                    onChangeText={text => setPostalCode(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>

              {/* <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>POSTAL CODE</Text>
                  <TextInput
                    value={postalCode}
                    placeholder={'Postal Code'}
                    onChangeText={text => setPostalCode(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View> */}

              <View style={styles.nameView}>
                <View>
                  <Text style={styles.dataHistoryText5}>PROFILE</Text>
                  <View style={styles.profilePhotoView}>
                    <TouchableOpacity
                      style={styles.editView}
                      onPress={() => openProfileImagePicker()}>
                      <Image style={styles.editImage1} source={draw} />
                    </TouchableOpacity>
                    <Image
                      style={styles.profileImage}
                      source={avatar != null ? {uri: avatar?.uri} : man}
                    />
                  </View>
                </View>
              </View>
              {errorVisible ? (
                <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
              ) : null}
            </View>
          )}
          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => {
                userId ? onEditUsers() : onAddUsers();
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
        onPress={() => onDeleteRecord()}
        setUserId={setUserId}
        isLoading={loading}
      />
    </View>
  );
};

export default UserList;

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
    width: wp(45),
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
    width: wp(60),
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
    marginTop: hp(17),
    marginRight: wp(2),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
    marginTop: hp(2),
  },
  resetButton: {
    width: wp(22),
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.greyColor,
    marginTop: hp(4),
    borderRadius: 5,
  },
  resetText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
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
    borderRadius: wp(1.5),
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
    width: wp(35),
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
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(1.5),
    borderBottomRightRadius: wp(1.5),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(40),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(22),
    justifyContent: 'center',
    marginHorizontal: wp(2),
    alignItems: 'flex-start',
  },
  actionDataView: {
    width: wp(12),
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    width: wp(20),
    height: hp(13.5),
    resizeMode: 'contain',
  },
  editView: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    position: 'absolute',
    zIndex: 1,
    right: -wp(2),
    top: -hp(1.5),
    backgroundColor: COLORS.white,
  },
  editImage1: {
    width: wp(2.5),
    height: hp(2),
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
    marginTop: hp(14),
    marginRight: wp(2),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
    marginTop: hp(2),
  },
  resetButton: {
    width: wp(22),
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.greyColor,
    marginTop: hp(4),
    borderRadius: 5,
  },
  resetText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
});
