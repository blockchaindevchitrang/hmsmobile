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
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import {COLORS, Fonts} from '../utils';
import {useTheme} from '../utils/ThemeProvider';
import deleteIcon from '../images/delete.png';
import editing from '../images/editing.png';
import close from '../images/close.png';
import {DeletePopup} from './DeletePopup';

const DepartmentComponent = ({
  searchDepartment,
  setSearchDepartment,
  allData,
  eventTitle,
  setEventTitle,
  departmentComment,
  setDepartmentComment,
  statusVisible,
  setStatusVisible,
  departmentType,
  setDepartmentType,
  addDoctorVisible,
  setAddDoctorVisible,
  onAddDoctorDepartmentData,
  onEditDoctorDepartmentData,
  onDeleteDepartmentData,
  deleteUser,
  setDeleteUser,
  isLoading,
}) => {
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [editId, setEditId] = useState('');

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={styles.nameDataView}>
          <Text style={[styles.dataHistoryText2]}>{item.title}</Text>
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={() => {
              setEditId(item.id);
              setEventTitle(item.title);
              setDepartmentComment(item.description);
              setStatusVisible(item.status == 1 ? true : false);
              setDepartmentType(item.type);
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
    <>
      <View style={styles.safeAreaStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.subView}>
            <TextInput
              value={searchDepartment}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearchDepartment(text)}
              style={[styles.searchView, {color: theme.text}]}
            />
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setEditId('');
                  setEventTitle('');
                  setDepartmentComment('');
                  setStatusVisible(false);
                  setDepartmentType('debit');
                  setAddDoctorVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>New Doctor Department</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
            <View>
              <View
                style={[
                  styles.titleActiveView,
                  {backgroundColor: theme.headerColor},
                ]}>
                <Text style={[styles.titleText, {width: '75%'}]}>
                  {'DOCTOR DEPARTMENT'}
                </Text>
                <Text style={[styles.titleText, {width: '25%'}]}>
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
                      <Text style={styles.emptyText}>{'No record found'}</Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={addDoctorVisible}
        onRequestClose={() => setAddDoctorVisible(false)}>
        <View style={styles.maneModalView}>
          <TouchableWithoutFeedback
            onPress={() => {
              setAddDoctorVisible(false);
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>Add New Doctor Department</Text>
              <TouchableOpacity onPress={() => setAddDoctorVisible(false)}>
                <Image style={styles.closeImage} source={close} />
              </TouchableOpacity>
            </View>
            <TextInput
              value={eventTitle}
              placeholder={'Event title'}
              onChangeText={text => setEventTitle(text)}
              style={[styles.eventTextInput]}
            />

            <TextInput
              value={departmentComment}
              placeholder={'Leave a comment...'}
              onChangeText={text => setDepartmentComment(text)}
              style={[styles.commentTextInput]}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.statusView}>
              <Text style={styles.statusText}>Status: </Text>
              <Switch
                trackColor={{
                  false: statusVisible ? COLORS.greenColor : COLORS.errorColor,
                  true: statusVisible ? COLORS.greenColor : COLORS.errorColor,
                }}
                thumbColor={statusVisible ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor={COLORS.errorColor}
                onValueChange={() => setStatusVisible(!statusVisible)}
                value={statusVisible}
              />
            </View>
            <View style={[styles.statusView]}>
              <Text style={styles.statusText}>Type: </Text>
              <View style={[styles.optionView]}>
                <TouchableOpacity
                  onPress={() => setDepartmentType('debit')}
                  style={[
                    styles.roundBorder,
                    {
                      backgroundColor:
                        departmentType == 'debit'
                          ? COLORS.blueColor
                          : COLORS.white,
                      borderWidth: departmentType == 'debit' ? 0 : 0.5,
                    },
                  ]}>
                  <View style={styles.round} />
                </TouchableOpacity>
                <Text style={styles.statusText}>Debit</Text>
              </View>
              <View style={[styles.optionView]}>
                <TouchableOpacity
                  onPress={() => setDepartmentType('credit')}
                  style={[
                    styles.roundBorder,
                    {
                      backgroundColor:
                        departmentType == 'credit'
                          ? COLORS.blueColor
                          : COLORS.white,
                      borderWidth: departmentType == 'credit' ? 0 : 0.5,
                    },
                  ]}>
                  <View style={styles.round} />
                </TouchableOpacity>
                <Text style={styles.statusText}>Credit</Text>
              </View>
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
          </View>
        </View>
      </Modal>
      <DeletePopup
        modelVisible={deleteUser}
        setModelVisible={setDeleteUser}
        onPress={() => onDeleteDepartmentData(editId)}
        setUserId={setEditId}
        isLoading={isLoading}
      />
    </>
  );
};

export default DepartmentComponent;

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
    width: '47%',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(1.8),
    color: COLORS.black,
    borderRadius: 5,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionView: {
    height: hp(5),
    paddingHorizontal: wp(1.5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  actionText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(1.8),
    color: COLORS.white,
  },
  activeView: {
    width: '94%',
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
  },
  dataHistoryView: {
    width: '100%',
    height: hp(8),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  dataHistoryText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
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
    width: '65%',
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  editImage: {
    width: wp(4),
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
  closeImage: {
    width: wp(3.5),
    height: hp(2.5),
    resizeMode: 'contain',
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
    marginVertical: hp(3),
  },
  commentTextInput: {
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
    height: hp(14),
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1.5),
    width: '92%',
    alignSelf: 'center',
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
});
