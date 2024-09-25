import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
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
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp(8),
  },
  tab: {
    alignItems: 'center',
    marginHorizontal: wp(2),
    height: hp(4.2),
    paddingHorizontal: wp(3),
    backgroundColor: COLORS.greyColor,
    borderRadius: 5,
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: hp(2.2),
    color: COLORS.white,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
});

export default styles;
