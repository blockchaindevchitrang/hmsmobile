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
} from '../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from '../ProfilePhoto';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import close from '../../images/close.png';
import calendar from '../../images/calendar.png';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import photo from '../../images/photo.png';
import draw from '../../images/draw.png';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import {
  onAddAccountListApi,
  onAddInvestigationApi,
  onDeleteCommonApi,
  onGetEditAccountDataApi,
  onGetSpecificCommonApi,
  onUpdateInvestigationApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import ImagePicker from 'react-native-image-crop-picker';

const statusArray = [
  {id: 0, name: 'Not Solved'},
  {id: 1, name: 'Solved'},
];

const InvestigationReports = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
}) => {
  const user_data = useSelector(state => state.user_data);
  const doctorData = useSelector(state => state.doctorData);
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [addDoctorVisible, setAddHolidayVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [statusId, setStatusId] = useState('0');
  const [statusName, setStatusName] = useState('Not Solved');
  const [description, setDescription] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const onAddPayRollData = async () => {
    try {
      if (title == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter title.');
      } else if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else if (statusId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select status.');
      } else {
        setLoading(true);
        setErrorVisible(false);

        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('patient_id', patientId);
        formdata.append('doctor_id', doctorId);
        formdata.append('date', moment(dateOfBirth).format('YYYY-MM-DD'));
        formdata.append('status', statusId);
        formdata.append('description', description);
        // if (avatar != null) {
        //   formdata.append('attachment', avatar);
        // }
        const response = await onAddInvestigationApi(formdata);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setAddHolidayVisible(false);
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
      if (title == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter title.');
      } else if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else if (statusId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select status.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('patient_id', patientId);
        formdata.append('doctor_id', doctorId);
        formdata.append('date', moment(dateOfBirth).format('YYYY-MM-DD'));
        formdata.append('status', statusId);
        formdata.append('description', description);
        if (avatar != null) {
          formdata.append('attachment', avatar);
        }
        const response = await onUpdateInvestigationApi(formdata, userId);
        // const response = await onGetEditCommonJsonApi(urlData, raw);
        console.log('Get Error::', response.data);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setAddHolidayVisible(false);
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
      const response = await onDeleteCommonApi(
        `investigation-report-delete/${id}`,
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
        `investigation-report-edit/${id}`,
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

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.patient_name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText6]}>{item.patient_email}</Text>
          </View>
        </View>
        <Text style={[styles.dataListText1, {width: wp(24)}]}>
          {item.title}
        </Text>
        <View style={[styles.switchView]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataListText1]}>{item.date}</Text>
          </View>
        </View>
        <Text style={[styles.dataListText1, {width: wp(24)}]}>
          {item.status}
        </Text>
        <Text style={[styles.dataListText1, {width: wp(32)}]}>
          {item.attachment != null ? 'Download' : 'N/A'}
        </Text>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let allDatas = await onGetSpecificDoctor(item.id);
              setUserId(item.id);
              setTitle(item.title);
              setPatientId(allDatas.investigationReport.patient_id);
              setPatientName(item?.patient_name);
              setDoctorId(allDatas.investigationReport.doctor_id);
              doctorData.map(item1 => {
                if (item1.id == allDatas?.investigationReport?.doctor_id) {
                  setDoctorName(item1.name);
                  return;
                }
              });
              setStatusId(allDatas.investigationReport?.status);
              setStatusName(item.status);
              setDescription(allDatas.investigationReport?.description);
              setDateOfBirth(new Date(allDatas.investigationReport?.date));
              if (item?.attachment != null) {
                if (isImageFormat(item?.attachment)) {
                  setAvatar(parseFileFromUrl(item?.attachment));
                }
              } else {
                setAvatar(null);
              }
              setAddHolidayVisible(true);
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
      {!addDoctorVisible ? (
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
          </View>
          <View style={styles.filterView}>
            <TouchableOpacity
              onPress={() => {
                setUserId('');
                setTitle('');
                setPatientId('');
                setPatientName('');
                setDoctorId('');
                setDoctorName('');
                setStatusId('');
                setStatusName('');
                setDescription('');
                setDateOfBirth(new Date());
                setAvatar(null);
                setErrorMessage('');
                setErrorVisible(false);
                setAddHolidayVisible(true);
              }}
              style={styles.actionView}>
              <Text style={styles.actionText}>New Investigation Reports</Text>
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
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(55), textAlign: 'left'},
                    ]}>
                    {'User'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'Title'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(32)}]}>
                    {'Date'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'Status'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(32)}]}>
                    {'Attachment'}
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
              Investigation Reports
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setAddHolidayVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.nameView}>
            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Title:<Text style={styles.dataHistoryText4}>*</Text>
              </Text>
              <TextInput
                value={title}
                placeholder={'Title'}
                onChangeText={text => setTitle(text)}
                style={[styles.nameTextView, {width: '100%'}]}
              />
            </View>

            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Patient:<Text style={styles.dataHistoryText4}>*</Text>
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
          </View>
          <View style={styles.nameView}>
            <View style={{width: '48%'}}>
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Doctor:
              </Text>
              <SelectDropdown
                data={doctorData}
                onSelect={(selectedItem, index) => {
                  // setSelectedColor(selectedItem);
                  setDoctorId(selectedItem.id);
                  console.log('gert Value:::', selectedItem);
                }}
                defaultValue={doctorName}
                renderButton={(selectedItem, isOpen) => {
                  console.log('Get Response>>>', selectedItem);
                  return (
                    <View style={styles.dropdown2BtnStyle2}>
                      {doctorId != '' ? (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {doctorId == selectedItem?.id
                            ? selectedItem?.name
                            : doctorName}
                        </Text>
                      ) : (
                        <Text style={styles.dropdownItemTxtStyle}>
                          {selectedItem?.name || 'Select Doctor'}
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
              <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                Date:
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
                maximumDate={new Date()}
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
            <View>
              <Text style={styles.dataHistoryText5}>Attachment:</Text>
              <View style={styles.profilePhotoView}>
                <TouchableOpacity
                  style={styles.editView}
                  onPress={() => openProfileImagePicker()}>
                  <Image style={styles.editImage1} source={draw} />
                </TouchableOpacity>
                <Image
                  style={
                    avatar != null ? styles.profileImage1 : styles.profileImage
                  }
                  source={avatar != null ? {uri: avatar?.uri} : photo}
                />
              </View>
            </View>
          </View>
          <View style={styles.nameView}>
            <View style={{width: '100%'}}>
              <Text style={styles.dataHistoryText6}>Status:</Text>
              <SelectDropdown
                data={statusArray}
                onSelect={(selectedItem, index) => {
                  // setSelectedColor(selectedItem);
                  setStatusId(selectedItem.id);
                  console.log('gert Value:::', selectedItem);
                }}
                defaultValue={statusName}
                defaultValueByIndex={0}
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
              onPress={() => setAddHolidayVisible(false)}
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

export default InvestigationReports;

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
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
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
    width: '92%',
    alignSelf: 'center',
    marginBottom: hp(2),
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
    width: wp(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
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
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    marginVertical: hp(2),
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
    textAlign: 'center',
    marginHorizontal: wp(2),
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
});
