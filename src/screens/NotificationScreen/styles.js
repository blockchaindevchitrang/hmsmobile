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
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  notificationTitleText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  timeText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greyColor,
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
  },
  notificationTitleText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  timeText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.greyColor,
  },
});
