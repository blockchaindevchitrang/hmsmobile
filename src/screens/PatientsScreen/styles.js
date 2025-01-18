import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

export const portraitStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerView: {
    flex: 0.1,
    width: '100%',
  },
  mainView: {
    flex: 0.9,
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: '90%',
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
  },
  menuContainer: {
    alignItems: 'center',
    // backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
  },
  menuOption: {
    marginBottom: 15,
    backgroundColor: '#ffd6a5',
    borderRadius: 10,
    width: '90%',
    height: hp(6.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButton: {
    width: '79%',
    height: hp(6.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    textAlign: 'center',
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
  },
  mainModalView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoImage: {
    width: wp(50),
    height: hp(12),
    resizeMode: 'contain',
  },
  logoMenu: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const landscapeStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  headerView: {
    flex: 0.12,
    width: '100%',
  },
  mainView: {
    flex: 0.88,
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeButton: {
    marginTop: hp(3),
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: '40%',
    alignSelf: 'center',
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.white,
  },
  menuContainer: {
    alignItems: 'center',
    // backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  menuOption: {
    marginBottom: 15,
    backgroundColor: '#ffd6a5',
    borderRadius: 10,
    // width: '3%',
    // maxWidth: '90%',
    paddingHorizontal: wp(5),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(3),
  },
  optionButton: {
    width: '100%',
    height: hp(6.4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    textAlign: 'center',
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
  },
  mainModalView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoImage: {
    width: wp(50),
    height: hp(12),
    resizeMode: 'contain',
  },
  logoMenu: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
