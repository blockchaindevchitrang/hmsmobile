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
import useOrientation from './OrientationComponent';

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
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
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
          {item.patient_name && (
            <ProfilePhoto
              username={item.patient_name}
              style={styles.photoStyle}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text style={[styles.dataHistoryText1]}>{item.patient_email}</Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          {item.doctor_name && (
            <ProfilePhoto
              username={item.doctor_name}
              style={styles.photoStyle}
            />
          )}
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
        <View style={[styles.switchView, {width: isPortrait ? wp(30) : wp(22)}]}>
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
          <ScrollView horizontal bounces={false} showsHorizontalScrollIndicator={false}>
            <View>
              <View
                style={[
                  styles.titleActiveView,
                  {backgroundColor: theme.headerColor},
                ]}>
                <Text style={[styles.titleText, {width: isPortrait ? wp(55) : wp(37)}]}>
                  {'PATIENT'}
                </Text>
                <Text style={[styles.titleText, {width: isPortrait ? wp(55) : wp(37)}]}>
                  {'DOCTORS'}
                </Text>
                <Text style={[styles.titleText, {width: isPortrait ? wp(24) : wp(18)}]}>
                  {'DATE'}
                </Text>
                <Text style={[styles.titleText, {width: isPortrait ? wp(24) : wp(20)}]}>
                  {'PAYMENT MODE'}
                </Text>
                <Text style={[styles.titleText, {width: isPortrait ? wp(24) : wp(18)}]}>
                  {'AMOUNT'}
                </Text>
                <Text style={[styles.titleText, {width: isPortrait ? wp(30) : wp(22)}]}>
                  {'CREATED ON'}
                </Text>
              </View>
              <View style={styles.mainDataView}>
                <FlatList
                  data={allData}
                  renderItem={renderItem}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
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

const portraitStyles = StyleSheet.create({
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
  dataHistoryText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(47),
  },
  dataHistoryText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  photoStyle: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
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

const landscapeStyles = StyleSheet.create({
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
  activeView: {
    width: '96%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(0.5),
    borderRadius: wp(1.5),
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
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
    textAlign: 'left',
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  dataHistoryText1: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    width: wp(33),
  },
  dataHistoryText2: {
    fontSize: hp(1.7),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(1.5),
    borderBottomRightRadius: wp(1.5),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(37),
    marginHorizontal: wp(2),
  },
  switchView: {
    width: wp(18),
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  dataListText1: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    textAlign: 'left',
  },
  photoStyle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBox1: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 5,
  },
  ListEmptyView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(15),
  },
  emptyText: {
    fontSize: hp(2.3),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  nextView1: {
    width: '96%',
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
    paddingHorizontal: wp(2),
    backgroundColor: COLORS.headerGreenColor,
    paddingVertical: hp(0.5),
    borderRadius: 5,
    fontSize: hp(2.5),
    color: COLORS.white,
  },
  totalCountText: {
    fontSize: hp(2),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
  },
});
