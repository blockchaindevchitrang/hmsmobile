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
import styles from './styles';
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
import {onGetCommonApi, onGetSpecificCommonApi} from '../../services/Api';

const BloodIssueData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    type: 'Residential Care',
    date: '24th May, 2024',
    view: 'City Hospital N/A',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    type: 'General Inquiry',
    date: '12 Jan, 2021',
    view: 'City Hospital N/A',
    status: false,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    type: 'Feedback/Suggestions',
    date: '9 Sept, 2020',
    view: 'Ashok Patel',
    status: true,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    type: 'Feedback/Suggestions',
    date: '12 Nov, 2023',
    view: 'City Hospital N/A',
    status: false,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    type: 'Residential Care',
    date: '01 Feb, 2024',
    view: 'City Hospital N/A',
    status: true,
  },
];

export const EnquiriesScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
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

  useEffect(() => {
    onGetCallLogData();
  }, [searchAccount]);

  const onGetCallLogData = async () => {
    try {
      const response = await onGetCommonApi(
        `enquiry-get?search=${searchAccount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setEnquiryList(response.data.data.items);
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
        <View style={[styles.switchView, {width: wp(45)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightBlue}]}>
            <Text style={[styles.dataHistoryText1]}>{item.type}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>{item.created_at}</Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText, {width: wp(30)}]}>
          {item.viewed_by}
        </Text>
        <View style={[styles.switchView, {width: wp(16)}]}>
          <Switch
            trackColor={{
              false:
                item.status == 'Read' ? COLORS.greenColor : COLORS.errorColor,
              true:
                item.status == 'Read' ? COLORS.greenColor : COLORS.errorColor,
            }}
            thumbColor={item.status == 'Read' ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor={COLORS.errorColor}
            onValueChange={() => {}}
            value={item.status == 'Read'}
          />
        </View>
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
                <TouchableOpacity style={styles.filterView1}>
                  <Image style={styles.filterImage} source={filter} />
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
                        {width: wp(55), textAlign: 'left'},
                      ]}>
                      {'FULL NAME'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {width: wp(45), textAlign: 'left'},
                      ]}>
                      {'TYPE'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {width: wp(35), textAlign: 'left'},
                      ]}>
                      {'CREATED ON'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {width: wp(30), textAlign: 'left'},
                      ]}>
                      {'VIEWED BY'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {width: wp(16), textAlign: 'left'},
                      ]}>
                      {'STATUS'}
                    </Text>
                    <Text style={[styles.titleText, {width: wp(16)}]}>
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
