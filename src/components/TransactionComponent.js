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
import ProfilePhoto from './ProfilePhoto';
import moment from 'moment';

const TransactionComponent = ({
  searchBreak,
  setSearchBreak,
  allData,
  pageCount,
  setPageCount,
  totalPage,
}) => {
  const {theme} = useTheme();
  const menuRef = useRef(null);

  const convertDate = dateString => {
    // First, remove the ordinal suffix (st, nd, rd, th) from the date string
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, '$1');

    // Use regex to manually extract the parts of the date
    const dateParts = cleanDateString.match(
      /(\d+)\s(\w+),\s(\d{4})\s(\d+):(\d+)\s(AM|PM)/,
    );

    if (!dateParts) return 'Invalid date format'; // Return an error if the date can't be parsed

    let [, day, month, year, hours, minutes, period] = dateParts;

    // Convert month name to number
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthIndex = monthNames.indexOf(month) + 1;

    // Convert 12-hour format to 24-hour format
    if (period === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }

    // Ensure two-digit formatting for day, month, hours, minutes
    const formattedMonth = String(monthIndex).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Return the date in 'YYYY-MM-DD HH:MM:SS' format
    return `${year}-${formattedMonth}-${formattedDay} ${formattedHours}:${formattedMinutes}:00`;
  };

  function formatDate(createdAt) {
    // Use a regular expression to match the date portion (up to the comma)
    const dateMatch = createdAt.match(/^(\d{1,2}[a-z]{2} \w+, \d{4})/);

    // Return the matched date portion, or an empty string if no match is found
    return dateMatch ? dateMatch[0] : '';
  }

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={[styles.nameDataView]}>
          <ProfilePhoto username={item.patient_name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.patient_email}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          <ProfilePhoto username={item.doctor_name} />
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.doctor_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.doctor_email}</Text>
          </View>
        </View>
        <View style={[styles.switchView]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text
              style={[styles.dataListText1, {textAlign: 'center'}]}
              numberOfLines={2}>
              {convertDate(item.appointment_date)}
            </Text>
          </View>
        </View>
        <View style={[styles.switchView]}>
          <View
            style={[
              styles.dateBox1,
              {backgroundColor: theme.purpleColor, width: wp(15)},
            ]}>
            <Text style={[styles.dataListText1]}>{item.payment_mode}</Text>
          </View>
        </View>
        <View style={[styles.switchView]}>
          <Text style={styles.dataListText1}>{item.appointment_charge}</Text>
        </View>
        <View style={[styles.switchView, {width: wp(30)}]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={styles.dataListText1} numberOfLines={2}>
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
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
        <View style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View
                style={[
                  styles.titleActiveView,
                  {backgroundColor: theme.headerColor},
                ]}>
                <Text style={[styles.titleText, {width: wp(55)}]}>
                  {'PATIENT'}
                </Text>
                <Text style={[styles.titleText, {width: wp(55)}]}>
                  {'DOCTORS'}
                </Text>
                <Text style={[styles.titleText, {width: wp(24)}]}>
                  {'DATE'}
                </Text>
                <Text style={[styles.titleText, {width: wp(24)}]}>
                  {'PAYMENT MODE'}
                </Text>
                <Text style={[styles.titleText, {width: wp(24)}]}>
                  {'AMOUNT'}
                </Text>
                <Text style={[styles.titleText, {width: wp(30)}]}>
                  {'CREATED ON'}
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
    </View>
  );
};

export default TransactionComponent;

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
    textAlign: 'left',
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
    width: wp(24),
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
  nextView1: {
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
