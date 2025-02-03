import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  Animated,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import {landscapeStyles, portraitStyles} from './styles';
import Header from '../../components/Header';
import {COLORS} from '../../utils';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import {
  onGetCommonApi,
  onGetSpecificCommonApi,
  onUpdateUserDataApi,
} from '../../services/Api';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import man from '../../images/man.png';
import draw from '../../images/draw.png';
import {showMessage} from 'react-native-flash-message';
import CountryPicker from 'react-native-country-picker-modal';
import SelectDropdown from 'react-native-select-dropdown';
import {useSelector} from 'react-redux';
import useOrientation from '../../components/OrientationComponent';

export const ProfileScreen = ({navigation}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const bloodData = useSelector(state => state.bloodData);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address2, setAddress2] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(null);
  const [country1, setCountry1] = useState(null);
  const [isCountryPickerVisible, setCountryPickerVisibility] = useState(false);
  const [countryCode, setCountryCode] = useState('91');
  const [doctorContact, setDoctorContact] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [genderType, setGenderType] = useState('female');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [description, setDescription] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualification, setQualification] = useState('');
  const [doctorBlood, setDoctorBlood] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [bloodSelected, setBloodSelected] = useState('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [userId, setUserId] = useState('');
  const [doctorSelectedName, setDoctorSelectedName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const onSelect = country => {
    console.log('Get Selected Country', country);
    setCountryCode(country.callingCode[0]);
    setCountry1(country);
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

          console.log('Selected image:', imageData, image);
        }
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  useEffect(() => {
    onGetCallLogData();
  }, []);

  const onGetCallLogData = async () => {
    try {
      const response = await onGetCommonApi('get-profile');
      console.log('GetAccountData>>', response.data.data.user.id);
      if (response.status == 200) {
        onGetSingleData(response.data.data.user.id, response.data.data.user);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  const onGetSingleData = async (id, item) => {
    try {
      const response = await onGetSpecificCommonApi(`fetch-user/${id}`);
      console.log('get ValueLL:::', response.data);
      if (response.status == 200) {
        const dataResponse = response.data.message;
        setFirstName(dataResponse.first_name);
        setLastName(dataResponse.last_name);
        setCity(dataResponse.city);
        setEmail(dataResponse.email);
        setUserId(id);
        setDesignation(dataResponse?.designation);
        setDoctorContact(dataResponse?.phone);
        setCountryCode(dataResponse?.region_code);
        setGenderType(dataResponse.gender == 0 ? 'male' : 'female');
        setQualification(dataResponse?.qualification);
        setDoctorBlood(dataResponse?.blood_group);
        setAddress(dataResponse?.address1);
        setAddress2(dataResponse?.address2);
        setPostalCode(dataResponse?.postal_code);
        setCountry(dataResponse?.country);
        setDateOfBirth(new Date(dataResponse?.dob));
        if (
          dataResponse?.doctor_image &&
          isImageFormat(dataResponse?.doctor_image)
        ) {
          setAvatar(parseFileFromUrl(dataResponse?.doctor_image));
        }
        setRefresh(!refresh);
      } else {
        return 0;
      }
    } catch (err) {
      console.log('Get AccountError>', err);
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

  const onEditUsers = async () => {
    try {
      if (firstName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter first name.');
      } else if (lastName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter last name.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        setErrorMessage('');
        const formdata = new FormData();
        formdata.append('first_name', firstName);
        formdata.append('last_name', lastName);
        formdata.append('dob', moment(dateOfBirth).format('YYYY-MM-DD'));
        formdata.append('gender', genderType == 'female' ? 1 : 0);
        formdata.append('phone', doctorContact);
        formdata.append('email', email);
        formdata.append('region_code', countryCode);
        formdata.append('designation', designation);
        formdata.append('qualification', qualification);
        formdata.append('description', description);
        formdata.append('address1', address);
        formdata.append('address2', address2);
        formdata.append('city', city);
        formdata.append('zip', postalCode);
        formdata.append('blood_group', doctorBlood);
        formdata.append('country', country);
        if (avatar != null) {
          formdata.append('image', avatar);
        }
        const response = await onUpdateUserDataApi(userId, formdata);

        if (response.data.flag == 1) {
          showMessage({
            message: 'Profile Edited Successfully',
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
      console.log('Add User Error:', err.response.data);
    }
  };

  return (
    <View style={[styles.safeAreaStyle, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('update_profile')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreIcon={true}
        />
      </View>
      <View style={styles.mainView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
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
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Qualification:</Text>
                <TextInput
                  value={qualification}
                  placeholder={'Qualification'}
                  onChangeText={text => setQualification(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Blood Group:
                </Text>
                <SelectDropdown
                  data={bloodData}
                  onSelect={(selectedItem, index) => {
                    // setSelectedColor(selectedItem);
                    setDoctorBlood(selectedItem.blood_group);
                    console.log('gert Value:::', selectedItem);
                  }}
                  defaultValue={bloodSelected}
                  renderButton={(selectedItem, isOpen) => {
                    console.log('Get Response>>>', selectedItem);
                    return (
                      <View style={styles.dropdown2BtnStyle2}>
                        {doctorBlood != '' ? (
                          <Text style={styles.dropdownItemTxtStyle}>
                            {doctorBlood == selectedItem?.blood_group
                              ? selectedItem?.blood_group
                              : doctorBlood}
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
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>PHONE NUMBER:</Text>
                <View style={styles.countryCodeStyle}>
                  <TouchableOpacity
                    onPress={() =>
                      setCountryPickerVisibility(!isCountryPickerVisible)
                    }
                    style={styles.countryCodeText}>
                    <Text style={styles.textInput}>
                      {`+${countryCode}` || 'Select Country'}
                    </Text>
                  </TouchableOpacity>

                  {isCountryPickerVisible && ( // Render CountryPicker conditionally based on isCountryPickerVisible
                    <CountryPicker
                      visible={isCountryPickerVisible}
                      onClose={() => setCountryPickerVisibility(false)}
                      onSelect={onSelect}
                      withCloseButton
                      withCallingCode
                      withFilter
                      containerButtonStyle={{backgroundColor: COLORS.white}}
                    />
                  )}
                  <TextInput
                    value={doctorContact}
                    placeholder={'Phone Number'}
                    onChangeText={text => setDoctorContact(text)}
                    style={[styles.numberTextView, {width: '75%'}]}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>Designation:</Text>
                <TextInput
                  value={designation}
                  placeholder={'Designation'}
                  onChangeText={text => setDesignation(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>DATE OF BIRTH</Text>
                <Text
                  style={[
                    styles.nameTextView,
                    {width: '100%', paddingVertical: hp(1)},
                  ]}
                  onPress={() => setDateModalVisible(!dateModalVisible)}>
                  {dateOfBirth == null
                    ? 'Date Of Birth'
                    : moment(dateOfBirth).format('DD/MM/YYYY')}
                </Text>
                <DatePicker
                  open={dateModalVisible}
                  modal={true}
                  date={dateOfBirth || new Date()}
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
              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Address 1
                </Text>
                <TextInput
                  value={address}
                  placeholder={'Enter address 1'}
                  onChangeText={text => setAddress(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Address 2
                </Text>
                <TextInput
                  value={address2}
                  placeholder={'Enter Address 2'}
                  onChangeText={text => setAddress2(text)}
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

          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => onEditUsers()}
              style={styles.nextView}>
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.nextText}>Save</Text>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setNewUserVisible(false)}
              style={styles.prevView}>
              <Text style={styles.prevText}>Cancel</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;
