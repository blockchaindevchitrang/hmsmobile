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
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import {landscapeStyles, portraitStyles} from './styles';
import Header from '../../components/Header';
import {COLORS, Fonts} from '../../utils';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import close from '../../images/close.png';
import filter from '../../images/filter.png';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import view from '../../images/view.png';
import printing from '../../images/printing.png';
import ProfilePhoto from '../../components/ProfilePhoto';
import {
  onAddAccountListApi,
  onGetCommonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import SelectDropdown from 'react-native-select-dropdown';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

const filterArray = [
  {id: 1, name: 'All'},
  {id: 2, name: 'Read'},
  {id: 3, name: 'Unread'},
];

export const EnquiriesScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const menuRef = useRef(null);
  const [searchAccount, setSearchAccount] = useState('');
  const [newBloodIssueVisible, setNewBloodIssueVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [type, setType] = useState('');
  const [viewBy, setViewBy] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [enquiryList, setEnquiryList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [singleDataShow, setSingleDataShow] = useState(null);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [statusId, setStatusId] = useState(1);
  const [filterVisible, setFilterVisible] = useState(false);
  const [enquiryAction, setEnquiryAction] = useState([]);

  useEffect(() => {
    // Helper function to process privileges
    const processPrivileges = (privilege, actions, setAction) => {
      // const privilege = privileges.find(item => item.end_point === endPoint);
      if (privilege) {
        setAction(actions);
      }
    };

    // Iterate over role permissions
    rolePermission?.permission?.forEach(item => {
      if (item.status === 1) {
        processPrivileges(
          item.end_point == 'enquiries',
          item.actions,
          setEnquiryAction,
        );
      }
    });
  }, [rolePermission]);

  useEffect(() => {
    onGetCallLogData();
  }, [searchAccount, statusId, pageCount]);

  const onGetCallLogData = async () => {
    try {
      const response = await onGetCommonApi(
        `enquiry-get?search=${searchAccount}&page=${pageCount}${
          statusId == 2 ? '&status=1' : statusId == 3 ? '&status=0' : ''
        }`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setEnquiryList(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  const onGetSingleData = async id => {
    try {
      const response = await onGetSpecificCommonApi(`enquiry-view/${id}`);
      if (response.status == 200) {
        console.log('get ValueLL:::', response.data.data);
        return response.data.data;
      } else {
        return 0;
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  const onChangeStatusData = async (status, index, id) => {
    try {
      let arrayData = enquiryList;
      arrayData[index].status = status ? 'Read' : 'Unread';

      setEnquiryList(arrayData);
      setRefresh(!refresh);

      const response = await onAddAccountListApi(`enquiry/${id}/status`);
      console.log('get ValueLL:::', response.data);
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
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.full_name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.full_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.email}</Text>
          </View>
        </View>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(45) : wp(32)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightBlue}]}>
            <Text style={[styles.dataHistoryText1]}>{item.type}</Text>
          </View>
        </View>
        <View
          style={[styles.switchView, {width: isPortrait ? wp(35) : wp(28)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.created_at}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(30) : wp(24)},
          ]}>
          {item.viewed_by}
        </Text>
        {enquiryAction.includes('status') && (
          <View
            style={[styles.switchView, {width: isPortrait ? wp(16) : wp(12)}]}>
            <Switch
              trackColor={{
                false:
                  item.status == 'Read' ? COLORS.greenColor : COLORS.errorColor,
                true:
                  item.status == 'Read' ? COLORS.greenColor : COLORS.errorColor,
              }}
              thumbColor={item.status == 'Read' ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor={COLORS.errorColor}
              onValueChange={status =>
                onChangeStatusData(status, index, item.id)
              }
              value={item.status == 'Read'}
            />
          </View>
        )}
        <View style={styles.actionDataView}>
          <TouchableOpacity
            onPress={async () => {
              let forData = await onGetSingleData(item.id);
              setName(item.full_name);
              setEmail(item.email);
              setContact(forData.enquiry.contact_no);
              setType(item.type);
              setViewBy(item.viewed_by == null ? '' : item.viewed_by);
              setStatus(item.status);
              setMessage(forData.enquiry.message);
              setNewBloodIssueVisible(true);
            }}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.greenColor}]}
              source={view}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('enquiries')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreIcon={true}
        />
      </View>
      <View style={styles.mainView}>
        {!newBloodIssueVisible ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <View style={styles.subView}>
              <TextInput
                value={searchAccount}
                placeholder={'Search'}
                placeholderTextColor={theme.text}
                onChangeText={text => setSearchAccount(text)}
                style={[styles.searchView, {color: theme.text}]}
              />
              <View style={styles.filterView}>
                <TouchableOpacity
                  style={styles.filterView1}
                  onPress={() => setFilterVisible(true)}>
                  <Image style={styles.filterImage} source={filter} />
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
                          width: isPortrait ? wp(55) : wp(37),
                          textAlign: 'left',
                        },
                      ]}>
                      {'FULL NAME'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {
                          width: isPortrait ? wp(45) : wp(32),
                          textAlign: 'center',
                        },
                      ]}>
                      {'TYPE'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {
                          width: isPortrait ? wp(35) : wp(28),
                          textAlign: 'center',
                        },
                      ]}>
                      {'CREATED ON'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {
                          width: isPortrait ? wp(30) : wp(24),
                          textAlign: 'left',
                        },
                      ]}>
                      {'VIEWED BY'}
                    </Text>
                    {enquiryAction.includes('status') && (
                      <Text
                        style={[
                          styles.titleText,
                          {
                            width: isPortrait ? wp(16) : wp(12),
                            textAlign: 'center',
                          },
                        ]}>
                        {'STATUS'}
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.titleText,
                        {width: isPortrait ? wp(16) : wp(12)},
                      ]}>
                      {'ACTION'}
                    </Text>
                  </View>
                  <View style={styles.mainDataView}>
                    <FlatList
                      data={enquiryList}
                      renderItem={renderItem}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      initialNumToRender={enquiryList.length}
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
                Enquiry Details
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
                  <Text style={[styles.titleText1]}>{'Name:'}</Text>
                  <Text style={[styles.nameTextView1]}>{name}</Text>
                </View>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Email:'}</Text>
                  <Text style={[styles.nameTextView1]}>{email}</Text>
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Contact:'}</Text>
                  <Text style={[styles.nameTextView1]}>{contact}</Text>
                </View>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Type:'}</Text>
                  <Text style={[styles.nameTextView1]}>{type}</Text>
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Viewed By:'}</Text>
                  <Text style={[styles.nameTextView1]}>{viewBy}</Text>
                </View>
                <View style={{width: '48%'}}>
                  <Text style={[styles.titleText1]}>{'Status:'}</Text>
                  <View
                    style={[
                      styles.dateBox1,
                      {backgroundColor: theme.lightColor},
                    ]}>
                    <Text style={[styles.dataHistoryText1]}>{status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.nameView}>
                <View style={{width: '100%'}}>
                  <Text style={[styles.titleText1]}>{'Message:'}</Text>
                  <Text style={[styles.nameTextView1]}>{message}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      {/* <Modal
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
          <View style={styles.container1}>
            <View style={styles.headerView1}>
              <Text style={styles.headerText}>New Blood Issues</Text>
              <TouchableOpacity onPress={() => setNewBloodIssueVisible(false)}>
                <Image style={styles.closeImage} source={close} />
              </TouchableOpacity>
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>{'Name:'}</Text>
                <Text style={[styles.nameTextView1]}>{name}</Text>
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>{'Email:'}</Text>
                <Text style={[styles.nameTextView1]}>{email}</Text>
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>{'Contact:'}</Text>
                <Text style={[styles.nameTextView1]}>{contact}</Text>
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>{'Type:'}</Text>
                <Text style={[styles.nameTextView1]}>{type}</Text>
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>{'Viewed By:'}</Text>
                <Text style={[styles.nameTextView1]}>{viewBy}</Text>
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>{'Status:'}</Text>
                <View
                  style={[
                    styles.dateBox1,
                    {backgroundColor: theme.lightColor},
                  ]}>
                  <Text style={[styles.dataHistoryText1]}>{status}</Text>
                </View>
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={[styles.titleText1]}>{'Message:'}</Text>
                <Text style={[styles.nameTextView1]}>{message}</Text>
              </View>
            </View>
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
      </Modal> */}
    </View>
  );
};

export default EnquiriesScreen;
