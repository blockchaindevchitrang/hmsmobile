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
import editing from '../../images/editing.png';
import close from '../../images/close.png';
import ImagePicker from 'react-native-image-crop-picker';
import photo from '../../images/photo.png';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import {DeletePopup} from '../DeletePopup';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import draw from '../../images/draw.png';
import {onAddDocumentApi, onGetCommonApi, onUpdateDocumentApi} from '../../services/Api';
import {
  onAddAccountListApi,
  onDeleteCommonApi,
  onGetEditAccountDataApi,
  onGetSpecificCommonApi,
} from '../../services/Api';

const DocumentList = ({searchBreak, setSearchBreak, allData, onGetData}) => {
  const user_data = useSelector(state => state.user_data);
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [newAccountVisible, setNewAccountVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentTypeId, setDocumentTypeId] = useState('');
  const [patient, setPatient] = useState('');
  const [patientId, setPatientId] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [note, setNote] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    onIncomeHeadGet();
  }, []);

  const onIncomeHeadGet = async () => {
    try {
      const response = await onGetCommonApi('document-type-get');
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setDocumentTypeList(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

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
        setErrorMessage('Please enter document title.');
      } else if (documentTypeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select document type.');
      } else if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (avatar == null) {
        setErrorVisible(true);
        setErrorMessage('Please select image.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('patient_id', patientId);
        formdata.append('document_type_id', documentTypeId);
        formdata.append('notes', note);
        if (avatar != null) {
          formdata.append('file', avatar);
        }
        const response = await onAddDocumentApi(formdata);
        if (response.status == 200) {
          onGetData();
          setLoading(false);
          setNewAccountVisible(false);
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
      if (title == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter document title.');
      } else if (documentTypeId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select document type.');
      } else if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (avatar == null) {
        setErrorVisible(true);
        setErrorMessage('Please select image.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        const formdata = new FormData();
        formdata.append('title', title);
        formdata.append('patient_id', patientId);
        formdata.append('document_type_id', documentTypeId);
        formdata.append('notes', note);
        if (avatar != null) {
          formdata.append('file', avatar);
        }
        const response = await onUpdateDocumentApi(formdata, userId);
        if (response.status == 200) {
          onGetData();
          setLoading(false);
          setNewAccountVisible(false);
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
      console.log('Error:', err.response.data);
    }
  };

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(`document-delete/${id}`);
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

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificCommonApi(`document-edit/${id}`);
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
        <View style={[styles.nameDataView, {width: wp(35)}]}>
          <Text style={[styles.dataHistoryText2]}>{item.title}</Text>
        </View>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.document_type}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.patient_name} />
          <View>
            <Text style={[styles.dataHistoryText1]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText5]}>{item.patient_email}</Text>
          </View>
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              setUserId(item.id);
              let allDatas = await onGetSpecificDoctor(item.id);
              setTitle(item?.title);
              setDocumentTypeId(allDatas?.document_type_id);
              setDocumentType(item?.document_type);
              setPatient(item?.patient_name);
              setPatientId(allDatas?.patient_id);
              setNote(allDatas?.notes);
              if (item.file_name != '') {
                if (isImageFormat(item?.file_name)) {
                  setAvatar(parseFileFromUrl(item?.file_name));
                }
              }
              setNewAccountVisible(true);
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
    <>
      <View style={styles.safeAreaStyle}>
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
                onPress={() => {
                  setUserId('');
                  setTitle('');
                  setDocumentTypeId('');
                  setDocumentType('');
                  setPatient('');
                  setPatientId('');
                  setNote('');
                  setAvatar(null);
                  setNewAccountVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>New Document</Text>
              </TouchableOpacity>
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
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(35), textAlign: 'left'},
                    ]}>
                    {'FILE NAME'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(35)}]}>
                    {'DOCUMENT TYPE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(55)}]}>
                    {'ACCOUNTANTS'}
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
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={newAccountVisible}
        onRequestClose={() => setNewAccountVisible(false)}>
        <View style={styles.maneModalView}>
          <TouchableWithoutFeedback
            onPress={() => {
              setNewAccountVisible(false);
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>New Document</Text>
              <TouchableOpacity onPress={() => setNewAccountVisible(false)}>
                <Image style={styles.closeImage} source={close} />
              </TouchableOpacity>
            </View>

            <View style={styles.profileView}>
              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Title:'}</Text>
                  <TextInput
                    value={title}
                    placeholder={'From Title'}
                    onChangeText={text => setTitle(text)}
                    style={[styles.nameTextView]}
                  />
                </View>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Document Type:'}</Text>
                  <SelectDropdown
                    data={documentTypeList}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setDocumentTypeId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={documentType}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {documentTypeId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {documentTypeId == selectedItem?.id
                                ? selectedItem?.name
                                : documentType}
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
                  <Text style={[styles.titleText1]}>{'Patient:'}</Text>
                  <SelectDropdown
                    data={user_data}
                    onSelect={(selectedItem, index) => {
                      // setSelectedColor(selectedItem);
                      setPatientId(selectedItem.id);
                      console.log('gert Value:::', selectedItem);
                    }}
                    defaultValue={patient}
                    renderButton={(selectedItem, isOpen) => {
                      console.log('Get Response>>>', selectedItem);
                      return (
                        <View style={styles.dropdown2BtnStyle2}>
                          {patientId != '' ? (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {patientId == selectedItem?.id
                                ? `${selectedItem?.patient_user?.first_name} ${selectedItem?.patient_user?.last_name}`
                                : patient}
                            </Text>
                          ) : (
                            <Text style={styles.dropdownItemTxtStyle}>
                              {selectedItem?.patient_user?.first_name || 'Select'}
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
                  <Text style={styles.dataHistoryText5}>Attachment</Text>
                  <View style={styles.profilePhotoView}>
                    <TouchableOpacity
                      style={styles.editView}
                      onPress={() => openProfileImagePicker()}>
                      <Image style={styles.editImage1} source={draw} />
                    </TouchableOpacity>
                    <Image
                      style={
                        avatar != null
                          ? styles.profileImage1
                          : styles.profileImage
                      }
                      source={avatar != null ? {uri: avatar?.uri} : photo}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={[styles.titleText1]}>{'Notes:'}</Text>
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
          </View>
        </View>
      </Modal>
      <DeletePopup
        modelVisible={deleteUser}
        setModelVisible={setDeleteUser}
        onPress={() => onDeletePayrollData(userId)}
        setUserId={setUserId}
        isLoading={loading}
      />
    </>
  );
};

export default DocumentList;

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
    // justifyContent: 'flex-end',
    // paddingHorizontal: wp(3),
    // paddingBottom: hp(1),
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
    // marginHorizontal: wp(3),
    textAlign: 'left',
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
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
  dataHistoryText5: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    width: wp(45),
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
    // alignItems: 'center',
    width: wp(55),
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
    width: '100%',
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
    marginBottom: hp(3),
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
});
