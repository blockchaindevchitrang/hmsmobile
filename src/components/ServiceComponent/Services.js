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
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import React, {useRef, useState} from 'react';
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
import {
  onAddAccountListApi,
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetEditAccountDataApi,
  onGetEditCommonJsonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import {DeletePopup} from '../DeletePopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import SelectDropdown from 'react-native-select-dropdown';

const filterArray = [
  {id: 3, name: 'All'},
  {id: 0, name: 'Active'},
  {id: 1, name: 'Deactive'},
];

const Services = ({
  searchBreak,
  setSearchBreak,
  allData,
  onGetData,
  totalPage,
  pageCount,
  setPageCount,
  statusId,
  setStatusId,
}) => {
  const {theme} = useTheme();
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [service, setService] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState(false);
  const [description, setDescription] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const onAddPayRollData = async () => {
    try {
      if (service == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter service name.');
      } else if (quantity == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter quantity.');
      } else if (rate == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter rate.');
      } else {
        setLoading(true);
        setErrorVisible(false);

        const urlData = `services-store?name=${service}&quantity=${quantity}&rate=${rate}&description=${description}&status=${
          status ? 1 : 0
        }`;
        // const response = await onAddCommonJsonApi(urlData, raw);
        const response = await onAddAccountListApi(urlData);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
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
      if (service == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter service name.');
      } else if (quantity == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter quantity.');
      } else if (rate == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter rate.');
      } else {
        setLoading(true);
        setErrorVisible(false);

        const urlData = `services-update/${userId}?name=${service}&quantity=${quantity}&rate=${rate}&description=${description}&status=${
          status ? 1 : 0
        }`;
        const response = await onGetEditAccountDataApi(urlData);
        // const response = await onGetEditCommonJsonApi(urlData, raw);
        console.log('Get Error::', response.data);
        if (response.data.flag == 1) {
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
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
      console.log('Error:', err);
    }
  };

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(`services-delete/${id}`);
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
      const response = await onGetSpecificCommonApi(`services-edit/${id}`);
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
        <Text style={[styles.dataHistoryText1, {width: wp(28)}]}>
          {item.name}
        </Text>
        <View style={[styles.switchView, {width: wp(28)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.quantity}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText1, {width: wp(26)}]}>
          {item.rate}
        </Text>
        <View style={[styles.switchView]}>
          <Switch
            trackColor={{
              false:
                item.status == 'Active' ? COLORS.greenColor : COLORS.errorColor,
              true:
                item.status == 'Active' ? COLORS.greenColor : COLORS.errorColor,
            }}
            thumbColor={item.status == 'Active' ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor={COLORS.errorColor}
            onValueChange={() => {}}
            value={item.status == 'Active' ? true : false}
          />
        </View>
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let allDatas = await onGetSpecificDoctor(item.id);
              setUserId(item.id);
              setService(item.name);
              setQuantity(item.quantity);
              setRate(item.rate);
              setDescription(allDatas.description);
              setStatus(item.status == 'Active' ? true : false);
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
          </View>
          <View style={styles.filterView}>
            <TouchableOpacity
              style={styles.filterView1}
              onPress={() => setFilterVisible(true)}>
              <Image style={styles.filterImage} source={filter} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setUserId('');
                setService('');
                setQuantity('');
                setRate('');
                setDescription('');
                setStatus(false);
                setErrorMessage('');
                setErrorVisible(false);
                setNewUserVisible(true);
              }}
              style={styles.actionView}>
              <Text style={styles.actionText}>New Service</Text>
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
                  <View style={styles.modalOverlay1} />
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
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValueByIndex={statusId == 3 ? 0 : statusId + 1}
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
                        onPress={() => setStatusId(3)}
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
                  <Text style={[styles.titleText, {width: wp(28)}]}>
                    {'Service'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(28)}]}>
                    {'Quantity'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(26)}]}>
                    {'Rate'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(22)}]}>
                    {'Status'}
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
          <View style={styles.nextView2}>
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
              Add New Service
            </Text>
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setNewUserVisible(false);
                }}
                style={styles.backButtonView}>
                <Text style={styles.backText}>BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileView}>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>Service:</Text>
                <TextInput
                  value={service}
                  placeholder={'Service'}
                  onChangeText={text => setService(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>

              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>Quantity:</Text>
                <TextInput
                  value={quantity}
                  placeholder={'Quantity'}
                  onChangeText={text => setQuantity(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  keyboardType={'number-pad'}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>Rate:</Text>
                <TextInput
                  value={rate}
                  placeholder={'Rate'}
                  onChangeText={text => setRate(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                  keyboardType={'number-pad'}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={styles.dataHistoryText6}>STATUS</Text>
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
        onPress={() => onDeletePayrollData(userId)}
        setUserId={setUserId}
        isLoading={loading}
      />
    </View>
  );
};

export default Services;

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
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  dataHistoryText6: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
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
    width: wp(22),
    justifyContent: 'center',
    alignItems: 'center',
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
  nextView1: {
    height: hp(4.5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    paddingHorizontal: wp(3),
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
  parameterView: {
    width: '100%',
    backgroundColor: COLORS.lightGreyColor,
    paddingVertical: hp(1),
    marginTop: hp(3),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  parameterText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
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
  nextView2: {
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
