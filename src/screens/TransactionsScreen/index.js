import React, {useState, useRef} from 'react';
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

const BloodIssueData = [
  {
    id: 1,
    name: 'City Hospital N/A',
    payment: 'Stripe',
    amount: '$991.64',
    date: '22:02:00 2023-03-24',
    approved: 'Approved',
    status: 'Paid',
  },
  {
    id: 2,
    name: 'City Hospital N/A',
    payment: 'Stripe',
    amount: '$991.64',
    date: '22:02:00 2023-03-24',
    approved: 'Approved',
    status: 'Paid',
  },
  {
    id: 3,
    name: 'City Hospital N/A',
    payment: 'Stripe',
    amount: '$991.64',
    date: '22:02:00 2023-03-24',
    approved: 'Approved',
    status: 'Paid',
  },
  {
    id: 4,
    name: 'City Hospital N/A',
    payment: 'Stripe',
    amount: '$991.64',
    date: '22:02:00 2023-03-24',
    approved: 'Approved',
    status: 'Paid',
  },
  {
    id: 5,
    name: 'City Hospital N/A',
    payment: 'Stripe',
    amount: '$991.64',
    date: '22:02:00 2023-03-24',
    approved: 'Approved',
    status: 'Paid',
  },
];

export const TransactionsScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [searchAccount, setSearchAccount] = useState('');
  const [newBloodIssueVisible, setNewBloodIssueVisible] = useState(false);
  const [issueDate, setIssueDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [Amount, setAmount] = useState('');
  const [Remarks, setRemarks] = useState('');

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={[styles.nameDataView, {width: wp(35)}]}>
          <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
        </View>
        <View style={[styles.nameDataView, {width: wp(35)}]}>
          <Text style={[styles.dataHistoryText]}>{item.payment}</Text>
        </View>
        <Text style={[styles.dataHistoryText1, {width: wp(24)}]}>
          {item.amount}
        </Text>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>{item.date}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(40)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>{item.approved}</Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(20)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('transactions')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreIcon={true}
        />
      </View>
      <View style={styles.mainView}>
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
            {/* <View style={styles.filterView}>
             
            </View> */}
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
                    {'HOSPITAL NAME'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(35), textAlign: 'left'},
                    ]}>
                    {'PAYMENT METHOD'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(24)}]}>
                    {'AMOUNT'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(35)}]}>
                    {'TRANSACTION DATE'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(40)}]}>
                    {'PAYMENT APPROVED'}
                  </Text>
                  <Text style={[styles.titleText, {width: wp(20)}]}>
                    {'STATUS'}
                  </Text>
                </View>
                <View style={styles.mainDataView}>
                  <FlatList
                    data={BloodIssueData}
                    renderItem={renderItem}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={BloodIssueData.length}
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
          <View style={styles.container1}>
            <View style={styles.headerView1}>
              <Text style={styles.headerText}>New Blood Issues</Text>
              <TouchableOpacity onPress={() => setNewBloodIssueVisible(false)}>
                <Image style={styles.closeImage} source={close} />
              </TouchableOpacity>
            </View>
            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>
                  {'Issue Date:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={issueDate}
                  placeholder={'Issue Date'}
                  onChangeText={text => setIssueDate(text)}
                  style={[styles.nameTextView]}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>
                  {'Doctor Name:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorName}
                  placeholder={'Doctor Name'}
                  onChangeText={text => setDoctorName(text)}
                  style={[styles.nameTextView]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>
                  {'Patient Name:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={patientName}
                  placeholder={'Patient Name'}
                  onChangeText={text => setPatientName(text)}
                  style={[styles.nameTextView]}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>
                  {'Doctor Name:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={doctorName}
                  placeholder={'Doctor Name'}
                  onChangeText={text => setDoctorName(text)}
                  style={[styles.nameTextView]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>
                  {'Blood Group:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={bloodGroup}
                  placeholder={'Blood Group'}
                  onChangeText={text => setBloodGroup(text)}
                  style={[styles.nameTextView]}
                />
              </View>
              <View style={{width: '48%'}}>
                <Text style={[styles.titleText1]}>
                  {'Amount:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={Amount}
                  placeholder={'Amount'}
                  onChangeText={text => setAmount(text)}
                  style={[styles.nameTextView]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={[styles.titleText1]}>
                  {'Remarks:'}
                  <Text style={styles.dataHistoryText4}>*</Text>
                </Text>
                <TextInput
                  value={Remarks}
                  placeholder={'Enter Remarks'}
                  onChangeText={text => setRemarks(text)}
                  style={[styles.commentTextInput]}
                  multiline
                  textAlignVertical="top"
                />
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
      </Modal>
    </View>
  );
};

export default TransactionsScreen;
