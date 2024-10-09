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
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from '../ProfilePhoto';
import filter from '../../images/filter.png';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import moment from 'moment';
import man from '../../images/man.png';
import draw from '../../images/draw.png';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import close from '../../images/close.png';

const OperationReports = ({searchBreak, setSearchBreak, allData}) => {
  const {theme} = useTheme();
  const [newBloodIssueVisible, setNewBloodIssueVisible] = useState(false);
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
  const [eventTitle, setEventTitle] = useState('');
  const [departmentComment, setDepartmentComment] = useState('');

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

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={[styles.switchView, {width: wp(30)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.admission}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.mail}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.mail}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>{item.date}</Text>
          </View>
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: wp(2)}}>
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
          </View>
          <View style={styles.filterView}>
            <TouchableOpacity style={styles.filterView1}>
              <Image style={styles.filterImage} source={filter} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setNewBloodIssueVisible(true)}
              style={styles.actionView}>
              <Text style={styles.actionText}>New Operation Reports</Text>
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
                  <Text style={[styles.titleText, {width: wp(30)}]}>
                    {'CASE ID'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(55), textAlign: 'left'},
                    ]}>
                    {'PATIENT'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(55), textAlign: 'left'},
                    ]}>
                    {'DOCTORS'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(35)}]}>
                    {'DATE'}
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
              Create Operation Report
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => setNewBloodIssueVisible(false)}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileView}>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>FIRST NAME</Text>
                <TextInput
                  value={firstName}
                  placeholder={'Enter first name'}
                  onChangeText={text => setFirstName(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>LAST NAME</Text>
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
                <Text style={styles.dataHistoryText6}>EMAIL ADDRESS</Text>
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
                <Text style={styles.dataHistoryText6}>ROLE</Text>
                <TextInput
                  value={role}
                  placeholder={'Select'}
                  onChangeText={text => setRole(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText6}>PASSWORD</Text>
                <TextInput
                  value={password}
                  placeholder={'******'}
                  onChangeText={text => setPassword(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText6}>CONFIRM PASSWORD</Text>
                <TextInput
                  value={confirmPassword}
                  placeholder={'******'}
                  onChangeText={text => setConfirmPassword(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>DATE OF BIRTH</Text>
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
                <Text style={styles.dataHistoryText6}>GENDER</Text>
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
                <Text style={styles.dataHistoryText6}>ADDRESS</Text>
                <TextInput
                  value={address}
                  placeholder={'******'}
                  onChangeText={text => setAddress(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>CITY</Text>
                <TextInput
                  value={city}
                  placeholder={'Enter city'}
                  onChangeText={text => setCity(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>COUNTRY</Text>
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
                <Text style={styles.dataHistoryText6}>POSTAL CODE</Text>
                <TextInput
                  value={postalCode}
                  placeholder={'Postal Code'}
                  onChangeText={text => setPostalCode(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View>
                <Text style={styles.dataHistoryText6}>PROFILE</Text>
                <View style={styles.profilePhotoView}>
                  <TouchableOpacity
                    style={styles.editView}
                    onPress={() => openProfileImagePicker()}>
                    <Image style={styles.editImage1} source={draw} />
                  </TouchableOpacity>
                  <Image style={styles.profileImage} source={man} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => {}} style={styles.nextView}>
              <Text style={styles.nextText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.prevView}>
              <Text style={styles.prevText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        )}
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={newBloodIssueVisible}
        onRequestClose={() => setNewBloodIssueVisible(false)}>
        <View style={styles.maneModalView}>
          <TouchableWithoutFeedback
            onPress={() => {
              setNewBloodIssueVisible(false);
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>New Operation Category</Text>
              <TouchableOpacity onPress={() => setNewBloodIssueVisible(false)}>
                <Image style={styles.closeImage} source={close} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.titleText1, {marginTop: hp(1.5)}]}>
              {'Operation Category'}
            </Text>
            <TextInput
              value={eventTitle}
              placeholder={''}
              onChangeText={text => setEventTitle(text)}
              style={[styles.eventTextInput]}
            />
            <Text style={[styles.titleText1]}>{'Remained Bags:'}</Text>
            <TextInput
              value={departmentComment}
              placeholder={''}
              onChangeText={text => setDepartmentComment(text)}
              style={[styles.eventTextInput]}
            />

            <View style={styles.buttonView}>
              <TouchableOpacity onPress={() => {}} style={styles.nextView}>
                <Text style={styles.nextText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewBloodIssueVisible(false)}
                style={styles.prevView}>
                <Text style={styles.prevText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OperationReports;

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
    // textAlign: 'center',
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
    marginHorizontal: wp(2),
  },
  dataHistoryText6: {
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
    alignItems: 'flex-start',
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
  },
  titleText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    textAlign: 'left',
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
});
