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
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  onAddUsersApi,
  onDeleteUserDataApi,
  onGetSpecificUsersDataApi,
  onUpdateUserDataApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import useOrientation from '../OrientationComponent';

const filterArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Active'},
  {id: 3, name: 'Deactive'},
];

const ReceptionistsList = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  pageCount,
  setPageCount,
  totalPage,
  setStatusId,
  statusId,
  receptionAction,
}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const bloodData = useSelector(state => state.bloodData);
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [address1, setAddress1] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualification, setQualification] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [genderType, setGenderType] = useState('female');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState(false);
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [bloodSelected, setBloodSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [userList, setUserList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setUserList(allData);
  }, [allData]);

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
      } else if (designation == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter user designation.');
      } else if (qualification == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter user qualification.');
      } else if (bloodSelected == '') {
        setErrorVisible(true);
        setErrorMessage('Please select blood group.');
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
        formdata.append('department_id', '5');
        formdata.append('phone', number);
        if (avatar != null) {
          formdata.append('image', avatar);
        }
        formdata.append('blood_group', bloodSelected);
        formdata.append('designation', designation);
        formdata.append('qualification', qualification);
        formdata.append('status', status ? 1 : 2);
        formdata.append('password', password);
        formdata.append('password_confirmation', confirmPassword);
        formdata.append('address2', address1);
        formdata.append('city', city);
        formdata.append('postal_code', postalCode);
        formdata.append('address1', address);
        formdata.append('gender', genderType == 'female' ? 1 : 0);
        const response = await onAddUsersApi(formdata);

        if (response.data.flag == 1) {
          onGetData();
          showMessage({
            message: 'Record Added Successfully',
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
      } else if (designation == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter user designation.');
      } else if (qualification == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter user qualification.');
      } else if (bloodSelected == '') {
        setErrorVisible(true);
        setErrorMessage('Please select blood group.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        setErrorMessage('');
        const formdata = new FormData();
        formdata.append('first_name', firstName);
        formdata.append('last_name', lastName);
        formdata.append('email', email);
        formdata.append('phone', number);
        if (avatar != null) {
          formdata.append('image', avatar);
        }
        formdata.append('designation', designation);
        formdata.append('qualification', qualification);
        formdata.append('status', status ? 1 : 2);
        formdata.append('department_id', '5');
        formdata.append('address2', address1);
        formdata.append('city', city);
        formdata.append('country', country);
        formdata.append('postal_code', postalCode);
        formdata.append('address1', address);
        formdata.append('gender', genderType == 'female' ? 1 : 0);
        const response = await onUpdateUserDataApi(userId, formdata);

        if (response.data.flag == 1) {
          onGetData();
          setUserId('');
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
      console.log('Add User Error:', err);
    }
  };

  const onDeleteRecord = async () => {
    try {
      setLoading(true);
      const response = await onDeleteUserDataApi(userId);
      if (response.data.flag == 1) {
        onGetData();
        setUserId('');
        setDeleteUser(false);
        setLoading(false);
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
      console.log('Error Delete', err);
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

  const onChangeStatusData = async (test, index, item) => {
    try {
      let arrayData = userList;
      arrayData[index].status = test ? 'Active' : 'Inactive';
      setUserList(arrayData);
      setRefresh(!refresh);
      let getData = await onGetSpecificDoctor(item.id);
      const [first, last] = item.name.split(',');
      const formdata = new FormData();

      formdata.append('first_name', first);
      formdata.append('last_name', last);
      formdata.append('email', item.email);
      formdata.append('phone', getData.phone);
      if (isImageFormat(item?.image_url)) {
        formdata.append('image', parseFileFromUrl(item?.image_url));
      }
      formdata.append('status', test ? 1 : 0);
      formdata.append('designation', getData.designation);
      formdata.append('qualification', getData.qualification);
      formdata.append('department_id', '5');
      formdata.append('address2', getData.address2);
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
                ? wp(55)
                : receptionAction.includes('status')
                ? wp(37)
                : wp(65.1),
            },
          ]}>
          {item.name && (
            <ProfilePhoto style={styles.photoStyle} username={item.name} />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text
              style={[
                styles.dataHistoryText1,
                {
                  width: isPortrait
                    ? wp(45)
                    : receptionAction.includes('status')
                    ? wp(33)
                    : wp(55),
                },
              ]}>
              {item.email}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {
              width: isPortrait
                ? wp(27)
                : receptionAction.includes('edit') ||
                  receptionAction.includes('delete')
                ? wp(22)
                : wp(41),
              textAlign: 'left',
            },
          ]}>
          {item.designation}
        </Text>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(24) : wp(20), textAlign: 'left'},
          ]}>
          {item.phone}
        </Text>
        {receptionAction.includes('status') && (
          <View style={[styles.switchView]}>
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
              onValueChange={test => onChangeStatusData(test, index, item)}
              value={item.status == 'Active' ? true : false}
            />
          </View>
        )}
        {receptionAction.includes('edit') ||
        receptionAction.includes('delete') ? (
          <View style={styles.actionDataView}>
            {receptionAction.includes('edit') && (
              <TouchableOpacity
                onPress={async () => {
                  let allData = await onGetSpecificDoctor(item.id);
                  setUserId(item.id);
                  const [first, last] = item.name.split(',');
                  setFirstName(first);
                  setLastName(last);
                  if (isImageFormat(item?.image_url)) {
                    setAvatar(parseFileFromUrl(item?.image_url));
                  }
                  setEmail(item.email);
                  setDesignation(allData.designation);
                  if (allData.dob != null) {
                    setDateOfBirth(new Date(allData.dob));
                  }
                  setGenderType(allData.gender == 0 ? 'male' : 'female');
                  setAddress(allData.address1);
                  setCity(allData.city);
                  setAddress1(allData.address2);
                  setCountry(allData.country);
                  setPostalCode(allData.postal_code);
                  setQualification(allData.qualification);
                  setNumber(allData.phone);
                  setStatus(allData.status == 'Active' ? true : false);
                  if (allData?.blood_group != null) {
                    setBloodSelected(allData?.blood_group);
                  }
                  setNewUserVisible(true);
                }}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.blueColor}]}
                  source={editing}
                />
              </TouchableOpacity>
            )}
            {receptionAction.includes('delete') && (
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

  return (
    <View style={styles.safeAreaStyle}>
      {!newUserVisible ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={[styles.subView]}>
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
                    setFilterVisible(true);
                  }}
                  style={styles.filterView1}>
                  <Image style={styles.filterImage} source={filter} />
                </TouchableOpacity>
                {receptionAction.includes('create') && (
                  <TouchableOpacity
                    onPress={() => {
                      setUserId('');
                      setFirstName('');
                      setLastName('');
                      setEmail('');
                      setDesignation('');
                      setDateOfBirth(new Date());
                      setGenderType('female');
                      setAddress('');
                      setCity('');
                      setCountry('');
                      setPostalCode('');
                      setAvatar(null);
                      setAddress1('');
                      setPassword('');
                      setConfirmPassword('');
                      setBloodSelected('');
                      setQualification('');
                      setErrorMessage('');
                      setErrorVisible(false);
                      setNewUserVisible(true);
                    }}
                    style={styles.actionView}>
                    <Text style={styles.actionText}>New Receptionist</Text>
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
                          data={filterArray}
                          onSelect={(selectedItem, index) => {
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
                            onPress={() => {
                              setStatusId(1);
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
            )}
          </View>
          {isPortrait && (
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setFilterVisible(true);
                }}
                style={styles.filterView1}>
                <Image style={styles.filterImage} source={filter} />
              </TouchableOpacity>
              {receptionAction.includes('create') && (
                <TouchableOpacity
                  onPress={() => {
                    setUserId('');
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setDesignation('');
                    setDateOfBirth(new Date());
                    setGenderType('female');
                    setAddress('');
                    setCity('');
                    setCountry('');
                    setPostalCode('');
                    setAvatar(null);
                    setAddress1('');
                    setPassword('');
                    setConfirmPassword('');
                    setBloodSelected('');
                    setQualification('');
                    setErrorMessage('');
                    setErrorVisible(false);
                    setNewUserVisible(true);
                  }}
                  style={styles.actionView}>
                  <Text style={styles.actionText}>New Receptionist</Text>
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
                        data={filterArray}
                        onSelect={(selectedItem, index) => {
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
                          onPress={() => {
                            setStatusId(1);
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
                  <Text
                    style={[
                      styles.titleText,
                      {
                        width: isPortrait
                          ? wp(55)
                          : receptionAction.includes('status')
                          ? wp(37)
                          : wp(65.1),
                      },
                    ]}>
                    {'RECEPTIONIST'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {
                        width: isPortrait
                          ? wp(27)
                          : receptionAction.includes('edit') ||
                            receptionAction.includes('delete')
                          ? wp(22)
                          : wp(41),
                      },
                    ]}>
                    {'DESIGNATION'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(24) : wp(20)},
                    ]}>
                    {'PHONE'}
                  </Text>
                  {receptionAction.includes('status') && (
                    <Text style={[styles.titleText, {width: wp(24)}]}>
                      {'STATUS'}
                    </Text>
                  )}
                  {receptionAction.includes('edit') ||
                  receptionAction.includes('delete') ? (
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(16) : wp(15)},
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
                    showsVerticalScrollIndicator={false}
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
              Receptionists Account
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
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>DESIGNATION:</Text>
                <TextInput
                  value={designation}
                  placeholder={''}
                  onChangeText={text => setDesignation(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>PHONE NUMBER</Text>
                <TextInput
                  value={number}
                  placeholder={''}
                  onChangeText={text => setNumber(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>

            <View style={styles.nameView}>
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

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>STATUS</Text>
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

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>QUALIFICATION:</Text>
                <TextInput
                  value={qualification}
                  placeholder={''}
                  onChangeText={text => setQualification(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

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
            </View>
            {isPortrait ? (
              userId == '' && (
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
              )
            ) : (
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>PASSWORD</Text>
                  <TextInput
                    value={password}
                    placeholder={'******'}
                    onChangeText={text => setPassword(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    secureTextEntry={true}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>CONFIRM PASSWORD</Text>
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

            {userId == '' && isPortrait && (
              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>CONFIRM PASSWORD</Text>
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
            {isPortrait ? (
              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>ADDRESS 1</Text>
                  <TextInput
                    value={address}
                    placeholder={''}
                    onChangeText={text => setAddress(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>ADDRESS 1</Text>
                  <TextInput
                    value={address}
                    placeholder={'address 1'}
                    onChangeText={text => setAddress(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>ADDRESS 2</Text>
                  <TextInput
                    value={address1}
                    placeholder={'address 2'}
                    onChangeText={text => setAddress1(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>
            )}
            {isPortrait && (
              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={styles.dataHistoryText1}>ADDRESS 2</Text>
                  <TextInput
                    value={address1}
                    placeholder={''}
                    onChangeText={text => setAddress1(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                  />
                </View>
              </View>
            )}
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>BLOOD GROUP:</Text>
                <SelectDropdown
                  data={bloodData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setBloodGroup(selectedItem.id);
                    setBloodSelected(selectedItem.blood_group);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={bloodSelected}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {bloodSelected != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {bloodSelected == selectedItem?.blood_group
                              ? selectedItem?.blood_group
                              : bloodSelected}
                          </Text>
                        ) : (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {selectedItem?.blood_group || 'Select'}
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
                          {item.blood_group}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                  dropdownIconPosition={'left'}
                  dropdownStyle={styles.dropdown2DropdownStyle}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>CITY</Text>
                <TextInput
                  value={city}
                  placeholder={'Enter city'}
                  onChangeText={text => setCity(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>COUNTRY</Text>
                <TextInput
                  value={country}
                  placeholder={'Enter country'}
                  onChangeText={text => setCountry(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>ZIP</Text>
                <TextInput
                  value={postalCode}
                  placeholder={'Zip'}
                  onChangeText={text => setPostalCode(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>
            {errorVisible ? (
              <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
            ) : null}
          </View>

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
              onPress={() => {
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
        onPress={() => onDeleteRecord()}
        setUserId={setUserId}
        isLoading={loading}
      />
    </View>
  );
};

export default ReceptionistsList;

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
    marginBottom: hp(2),
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
    marginTop: hp(24),
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
  titleText1: {
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
    width: wp(33),
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
    width: wp(37),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(24),
    justifyContent: 'center',
    marginHorizontal: wp(2),
    alignItems: 'flex-start',
  },
  actionDataView: {
    width: wp(15),
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
    marginTop: hp(15),
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
    // marginTop: hp(1),
  },
  resetButton: {
    width: wp(20),
    height: hp(4),
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
