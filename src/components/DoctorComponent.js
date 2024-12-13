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
  ActivityIndicator,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import {COLORS, Fonts} from '../utils';
import {useTheme} from '../utils/ThemeProvider';
import filter from '../images/filter.png';
import ProfilePhoto from './ProfilePhoto';
import deleteIcon from '../images/delete.png';
import editing from '../images/editing.png';
import man from '../images/man.png';
import draw from '../images/draw.png';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {DeletePopup} from './DeletePopup';
import ImagePicker from 'react-native-image-crop-picker';
import {onGetDoctorDetailApi} from '../services/Api';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';

const filterArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Active'},
  {id: 3, name: 'Deactive'},
];

const DoctorComponent = ({
  search,
  setSearch,
  allData,
  filterData,
  setFilter,
  practice,
  setPractice,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  address1,
  setAddress1,
  address2,
  setAddress2,
  doctorCity,
  setDoctorCity,
  doctorState,
  setDoctorState,
  doctorZip,
  setDoctorZip,
  genderType,
  setGenderType,
  doctorEmail,
  setDoctorEmail,
  doctorContact,
  setDoctorContact,
  status,
  setStatus,
  description,
  setDescription,
  dateOfBirth,
  setDateOfBirth,
  dateModalVisible,
  setDateModalVisible,
  designation,
  setDesignation,
  qualification,
  setQualification,
  doctorBlood,
  setDoctorBlood,
  specialist,
  setSpecialist,
  charge,
  setCharge,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  addDoctorVisible,
  setAddDoctorVisible,
  onAddDoctorDepartmentData,
  onEditDoctorDepartmentData,
  onDeleteDepartmentData,
  deleteUser,
  setDeleteUser,
  isLoading,
  setAvatar,
  avatar,
  pageCount,
  setPageCount,
  totalPage,
  statusId,
  setStatusId,
}) => {
  const departmentData = useSelector(state => state.departmentData);
  const bloodData = useSelector(state => state.bloodData);
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [editId, setEditId] = useState('');
  const [doctorSelectedName, setDoctorSelectedName] = useState('');
  const [bloodSelected, setBloodSelected] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

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

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetDoctorDetailApi(id);
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

  const isImageFormat = url => {
    return (
      url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg')
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text numberOfLines={2} style={[styles.dataHistoryText1]}>
              {item.email}
            </Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(24)}]}>
          {item.specialist}
        </Text>
        <Text style={[styles.dataHistoryText, {width: wp(28)}]}>
          {item.qualification}
        </Text>
        <View style={[styles.switchView]}>
          <Switch
            trackColor={{
              false: item.status == 1 ? COLORS.greenColor : COLORS.errorColor,
              true: item.status == 1 ? COLORS.greenColor : COLORS.errorColor,
            }}
            thumbColor={item.status == 1 ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor={COLORS.errorColor}
            onValueChange={() => {}}
            value={item.status == 1 ? true : false}
          />
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let allData = await onGetSpecificDoctor(item.id);
              console.log('Get Value Of Doctor::', allData);
              const matchingKey = Object.entries(
                allData.doctorsDepartments,
              ).find(
                ([key, value]) =>
                  value === allData?.doctor_detail?.doctor_department,
              )?.[0];
              const [first, last] =
                allData.doctor_detail.doctor_name.split(' ');
              setEditId(allData?.doctor_detail?.id);
              setFirstName(first);
              setLastName(last);
              if (isImageFormat(allData?.doctor_detail?.doctor_image)) {
                setAvatar(
                  parseFileFromUrl(allData?.doctor_detail?.doctor_image),
                );
              }
              setGenderType(
                allData?.doctor_detail?.gender == 'Female' ? 'female' : 'male',
              );
              setDateOfBirth(new Date(allData?.doctor_detail?.date_of_birth));
              setDoctorContact(allData?.doctor_detail?.phone);
              setDoctorEmail(allData?.doctor_detail?.email);
              setDescription(allData?.doctor_detail?.description);
              setQualification(allData?.doctor_detail?.qualification);
              setSpecialist(allData?.doctor_detail?.specialist);
              setBloodSelected(allData?.doctor_detail?.blood_group);
              console.log('Get ImageLLLL', matchingKey);
              setPractice(matchingKey);
              setDoctorSelectedName(allData?.doctor_detail?.doctor_department);
              setCharge(`${allData?.doctor_detail?.appointment_charge}`);
              setDesignation(allData?.doctor_detail?.designation);
              setAddress1(allData?.doctor_detail?.address1);
              setAddress2(allData?.doctor_detail?.address2);
              setDoctorCity(allData?.doctor_detail?.city);
              setDoctorZip(allData?.doctor_detail?.zip);
              setAddDoctorVisible(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{marginLeft: wp(2)}}
            onPress={() => {
              setEditId(item.id);
              setDeleteUser(true);
            }}>
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
      {!addDoctorVisible ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <TextInput
              value={search}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearch(text)}
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
                    setEditId('');
                    setFirstName('');
                    setLastName('');
                    setGenderType('female');
                    setDateOfBirth(new Date());
                    setDoctorContact('');
                    setDoctorEmail('');
                    setDescription('');
                    setQualification('');
                    setSpecialist('');
                    setPractice('');
                    setCharge('');
                    setDesignation('');
                    setAddress1('');
                    setAddress2('');
                    setDoctorCity('');
                    setDoctorZip('');
                    setPassword('');
                    setConfirmPassword('');
                    setAddDoctorVisible(true);
                  } else {
                    alert(`Selected number: ${value}`);
                  }
                }}>
                <MenuTrigger text={''} />
                <MenuOptions style={{marginVertical: hp(0.5)}}>
                  <MenuOption value={'add'}>
                    <Text style={styles.dataHistoryText3}>New Doctor</Text>
                  </MenuOption>
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
                        defaultValue={doctorSelectedName}
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View
                  style={[
                    styles.titleActiveView,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text style={[styles.titleText, {width: wp(55)}]}>
                    {'DOCTORS'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'SPECIALIST'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(28)}]}>
                    {'QUALIFICATION'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(16)}]}>
                    {'STATUS'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(20)}]}>
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
              New Doctor
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setAddDoctorVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileView}>
            <Text style={[styles.doctorText, {paddingVertical: hp(1)}]}>
              Profile
            </Text>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  First Name<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={firstName}
                  placeholder={'Enter first name'}
                  onChangeText={text => setFirstName(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  Last Name<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={lastName}
                  placeholder={'Enter last name'}
                  onChangeText={text => setLastName(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <Text style={styles.dataHistoryText1}>
              Doctor Department:<Text style={styles.dataHistoryText4}>*</Text>
            </Text>
            <SelectDropdown
              data={departmentData}
              onSelect={(selectedItem, index) => {
                // setSelectedColor(selectedItem);
                setPractice(selectedItem.id);
                console.log('gert Value:::', selectedItem);
              }}
              defaultValue={doctorSelectedName}
              renderButton={(selectedItem, isOpen) => {
                console.log('Get Response>>>', selectedItem);
                return (
                  <View style={styles.dropdown2BtnStyle2}>
                    {practice != '' ? (
                      <Text style={styles.dropdownItemTxtStyle}>
                        {practice == selectedItem?.id
                          ? selectedItem?.title
                          : doctorSelectedName}
                      </Text>
                    ) : (
                      <Text style={styles.dropdownItemTxtStyle}>
                        {selectedItem?.title || 'Select'}
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
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              dropdownIconPosition={'left'}
              dropdownStyle={styles.dropdown2DropdownStyle}
            />

            <Text style={[styles.dataHistoryText1, {marginTop: hp(2)}]}>
              Email:<Text style={styles.dataHistoryText4}>*</Text>
            </Text>
            <TextInput
              value={doctorEmail}
              placeholder={'Email'}
              onChangeText={text => setDoctorEmail(text)}
              style={[styles.nameTextView, {width: '100%'}]}
            />

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  Designation:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={designation}
                  placeholder={'Designation'}
                  onChangeText={text => setDesignation(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Phone:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorContact}
                  placeholder={'Enter Phone'}
                  keyboardType={'numeric'}
                  onChangeText={text => setDoctorContact(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  Qualification:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={qualification}
                  placeholder={'Qualification'}
                  onChangeText={text => setQualification(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Date Of Birth:<Text style={styles.dataHistoryText4}>*</Text>
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
              <View style={{width: '32%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Blood Group:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                {/* <TextInput
                  value={doctorBlood}
                  placeholder={'Select Blood'}
                  onChangeText={text => setDoctorBlood(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                /> */}
                <SelectDropdown
                  data={bloodData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setDoctorBlood(selectedItem.id);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={bloodSelected}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {doctorBlood != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {doctorBlood == selectedItem?.id
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

              <View style={{width: '44%'}}>
                <Text
                  style={[
                    styles.dataHistoryText1,
                    {color: theme.text, marginLeft: wp(3)},
                  ]}>
                  Gender<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
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

              <View style={{width: '20%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Status:
                </Text>
                <View style={[styles.statusView, {paddingVertical: hp(1)}]}>
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
                <Text style={styles.dataHistoryText1}>
                  Specialist:<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={specialist}
                  placeholder={'Specialist'}
                  onChangeText={text => setSpecialist(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Appointment Charge:
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={charge}
                  placeholder={'Appointment Charge'}
                  onChangeText={text => setCharge(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>
            {editId == '' && (
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={styles.dataHistoryText1}>
                    Password:<Text style={styles.dataHistoryText4}>*</Text>
                  </Text>
                  <TextInput
                    value={password}
                    placeholder={'Password'}
                    onChangeText={text => setPassword(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    secureTextEntry
                  />
                </View>

                <View style={{width: '48%'}}>
                  <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                    Confirm Password:
                    <Text style={styles.dataHistoryText4}>*</Text>
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    placeholder={'Confirm Password'}
                    onChangeText={text => setConfirmPassword(text)}
                    style={[styles.nameTextView, {width: '100%'}]}
                    secureTextEntry
                  />
                </View>
              </View>
            )}
            <Text style={[styles.dataHistoryText1, {marginTop: hp(2)}]}>
              Description:<Text style={styles.dataHistoryText4}>*</Text>
            </Text>
            <TextInput
              value={description}
              placeholder={'Description'}
              onChangeText={text => setDescription(text)}
              style={[styles.commentTextInput]}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.nameView}>
              <View>
                <Text style={styles.dataHistoryText5}>Profile:</Text>
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

            <Text style={[styles.dataHistoryText1, {marginBottom: hp(1)}]}>
              <Text style={styles.dataHistoryText4}>*</Text>Mendatory
            </Text>
          </View>

          <View style={styles.contactView}>
            <Text
              style={[
                styles.doctorText,
                {paddingVertical: hp(1), color: theme.text},
              ]}>
              Contact Information
            </Text>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Address Line 1 <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={address1}
                  placeholder={'Enter Address Line 1'}
                  onChangeText={text => setAddress1(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Address Line 2
                </Text>
                <TextInput
                  value={address2}
                  placeholder={'Enter Address Line 2'}
                  onChangeText={text => setAddress2(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  City<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorCity}
                  placeholder={'Enter City'}
                  onChangeText={text => setDoctorCity(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Zip<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorZip}
                  placeholder={'12345-1234'}
                  keyboardType={'numeric'}
                  onChangeText={text => setDoctorZip(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            {/* <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Fax
                </Text>
                <TextInput
                  value={doctorFax}
                  placeholder={'Enter Fax'}
                  onChangeText={text => setDoctorFax(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Email<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorEmail}
                  placeholder={'Enter Email'}
                  onChangeText={text => setDoctorEmail(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View> */}

            {/* <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Contact Phone<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorContact}
                  placeholder={'Enter Contact Phone'}
                  onChangeText={text => setDoctorContact(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View> */}
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={
                editId != ''
                  ? () => onEditDoctorDepartmentData(editId)
                  : onAddDoctorDepartmentData
              }
              style={styles.nextView}>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.nextText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAddDoctorVisible(false)}
              style={styles.prevView}>
              <Text style={styles.prevText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      <DeletePopup
        modelVisible={deleteUser}
        setModelVisible={setDeleteUser}
        onPress={() => onDeleteDepartmentData(editId)}
        setUserId={setEditId}
        isLoading={isLoading}
      />
    </View>
  );
};

export default DoctorComponent;

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
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
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
    width: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(20),
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
    width: '94%',
    backgroundColor: '#eeeeee',
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
    backgroundColor: COLORS.white,
    marginBottom: hp(2),
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: hp(2),
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
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  dataHistoryText5: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
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
