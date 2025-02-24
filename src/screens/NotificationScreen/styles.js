import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

export const portraitStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flex: 0.1,
  },
  textStyle: {
    fontSize: hp(2.8),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
  mainView: {
    flex: 0.9,
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
  },
  mainHeaderView: {
    width: '96%',
    alignSelf: 'center',
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
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightColor,
    paddingHorizontal: wp(2),
    marginTop: hp(1.5),
    borderRadius: 5,
  },
  notificationTitleText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  timeText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.textColor,
  },
  readAllView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    marginVertical: hp(1),
    alignSelf: 'flex-end',
    backgroundColor: COLORS.blueColor,
    borderRadius: 3,
  },
  readAllText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
});

export const landscapeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerView: {
    flex: 0.12,
  },
  textStyle: {
    fontSize: hp(2.8),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
  mainView: {
    flex: 0.88,
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
  },
  mainHeaderView: {
    width: '96%',
    alignSelf: 'center',
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
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightColor,
    paddingHorizontal: wp(2),
    marginTop: hp(1.5),
    borderRadius: 8,
  },
  notificationTitleText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  timeText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.textColor,
  },
  readAllView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    marginVertical: hp(1),
    alignSelf: 'flex-end',
    backgroundColor: COLORS.blueColor,
    borderRadius: 5,
  },
  readAllText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
});
