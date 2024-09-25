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
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

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
  middleName,
  setMiddleName,
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
  doctorFax,
  setDoctorFax,
  doctorEmail,
  setDoctorEmail,
  doctorContact,
  setDoctorContact,
  doctorAlternate,
  setDoctorAlternate,
}) => {
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [addDoctorVisible, setAddDoctorVisible] = useState(false);

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
            <Text style={[styles.dataHistoryText1]}>{item.mail}</Text>
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
              false: item.status ? COLORS.greenColor : COLORS.errorColor,
              true: item.status ? COLORS.greenColor : COLORS.errorColor,
            }}
            thumbColor={item.status ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor={COLORS.errorColor}
            onValueChange={() => {}}
            value={item.status}
          />
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
              <TouchableOpacity style={styles.filterView1}>
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
                        <View style={styles.subEmptyView}>
                          <Text style={styles.emptyText}>
                            {'No record found'}
                          </Text>
                        </View>
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
            <Text style={styles.dataHistoryText1}>
              Practice<Text style={styles.dataHistoryText4}>*</Text>
            </Text>
            <TextInput
              value={practice}
              placeholder={'Select'}
              onChangeText={text => setPractice(text)}
              style={[styles.nameTextView, {width: '100%'}]}
            />
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

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  Middle Name<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={middleName}
                  placeholder={'Enter middle name'}
                  onChangeText={text => setMiddleName(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText1}>
                  Practice<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={practice}
                  placeholder={'Select'}
                  onChangeText={text => setPractice(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
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
              <View style={{width: '32%'}}>
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

              <View style={{width: '32%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  State<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorState}
                  placeholder={'Select'}
                  onChangeText={text => setDoctorState(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '32%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Zip<Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorZip}
                  placeholder={'12345-1234'}
                  onChangeText={text => setDoctorZip(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
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
            </View>

            <View style={styles.nameView}>
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

              <View style={{width: '48%'}}>
                <Text style={[styles.dataHistoryText1, {color: theme.text}]}>
                  Alternate Phone
                </Text>
                <TextInput
                  value={doctorAlternate}
                  placeholder={'Enter Alternate Phone'}
                  onChangeText={text => setDoctorAlternate(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity onPress={() => {}} style={styles.prevView}>
              <Text style={styles.prevText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.nextView}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
});
