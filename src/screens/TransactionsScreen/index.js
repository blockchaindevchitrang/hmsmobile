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
import {portraitStyles, landscapeStyles} from './styles';
import Header from '../../components/Header';
import {COLORS, Fonts} from '../../utils';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import close from '../../images/close.png';
import {onGetCommonApi} from '../../services/Api';
import filter from '../../images/filter.png';
import useOrientation from '../../components/OrientationComponent';

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
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
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
  const [transactionList, setTransactionList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    onGetTransactionData();
  }, [searchAccount]);

  const onGetTransactionData = async () => {
    try {
      const response = await onGetCommonApi(
        `my-transaction?search=${searchAccount}`,
      );
      console.log('Response User Data', response.data.data);
      if (response.data.flag === 1) {
        setTransactionList(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
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
          <Text style={[styles.dataHistoryText2]}>{item.hospital_name}</Text>
        </View>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <View
            style={[
              styles.dateBox1,
              {backgroundColor: 'rgba(167, 108, 248, 0.2)'},
            ]}>
            <Text style={[styles.dataHistoryText, {color: COLORS.purpleColor}]}>
              {item.payment_type}
            </Text>
          </View>
        </View>
        <Text style={[styles.dataHistoryText1, {width: wp(24)}]}>
          {item.amount}
        </Text>
        <View style={[styles.switchView, {width: wp(35)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText]}>
              {item.transaction_date}
            </Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(40)}]}>
          <View
            style={[
              styles.dateBox1,
              {
                backgroundColor:
                  item.is_manual_payment == '0'
                    ? 'rgba(167, 108, 248, 0.2)'
                    : item.is_manual_payment == '1'
                    ? COLORS.errorBG
                    : COLORS.lightGreen1,
              },
            ]}>
            <Text
              style={[
                styles.dataHistoryText,
                {
                  color:
                    item.is_manual_payment == '0'
                      ? COLORS.purpleColor
                      : item.is_manual_payment == '1'
                      ? COLORS.errorColor
                      : COLORS.greenColor,
                },
              ]}>
              {item.is_manual_payment == '0'
                ? 'Waiting for Approval'
                : item.is_manual_payment == '1'
                ? 'Denied'
                : 'Approved'}
            </Text>
          </View>
        </View>
        <View style={[styles.switchView, {width: wp(20)}]}>
          <View
            style={[
              styles.dateBox1,
              {
                backgroundColor: item.status
                  ? COLORS.lightGreen1
                  : COLORS.errorBG,
              },
            ]}>
            <Text
              style={[
                styles.dataHistoryText,
                {color: item.status ? COLORS.greenColor : COLORS.errorColor},
              ]}>
              {item.status ? 'Paid' : 'Unpaid'}
            </Text>
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
              <TouchableOpacity
                style={styles.filterView1}
                onPress={() => setFilterVisible(true)}>
                <Image style={styles.filterImage} source={filter} />
              </TouchableOpacity>
            </View> */}
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
                      {width: wp(35), textAlign: 'left'},
                    ]}>
                    {'HOSPITAL NAME'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(35), textAlign: 'left'},
                    ]}>
                    {'PAYMENTS'}
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
                    data={transactionList}
                    renderItem={renderItem}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={transactionList.length}
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
    </View>
  );
};

export default TransactionsScreen;
