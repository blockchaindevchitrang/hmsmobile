import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

export const portraitStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  textStyle: {
    fontSize: hp(2.8),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
  mainView: {
    width: '90%',
  },
  emailPlaceHolder: {
    fontSize: hp(2.1),
    color: COLORS.textColor,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    marginTop: hp(2.5),
  },
  textInput: {
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    fontSize: hp(2),
    width: '100%',
    borderWidth: 0.5,
    borderColor: COLORS.textColor,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: hp(0.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  forgotPassword: {
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    fontSize: hp(2),
    textAlign: 'right',
    marginTop: hp(1),
  },
  buttonView: {
    width: '100%',
    borderRadius: 5,
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    backgroundColor: COLORS.primary,
  },
  signinText: {
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.white,
    fontSize: hp(2.2),
  },
  haveAnAccount: {
    fontSize: hp(2),
    color: COLORS.black,
    marginTop: hp(3),
    textAlign: 'center',
  },
  signUpText: {
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    fontSize: hp(2),
    textAlign: 'center',
  },
  eyeIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
  },
  logoImage: {
    width: wp(40),
    height: hp(12),
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: hp(1.8),
    color: COLORS.errorColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    marginTop: hp(1),
    marginLeft: wp(1),
  },
});

export const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  textStyle: {
    fontSize: hp(2.8),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
  mainView: {
    width: '50%',
  },
  emailPlaceHolder: {
    fontSize: hp(1.9),
    color: COLORS.textColor,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    marginTop: hp(2.5),
  },
  textInput: {
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    fontSize: hp(2),
    width: '100%',
    borderWidth: 0.5,
    borderColor: COLORS.textColor,
    borderRadius: 5,
    justifyContent: 'center',
    marginTop: hp(0.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(1.5),
  },
  forgotPassword: {
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    fontSize: hp(2),
    textAlign: 'right',
    marginTop: hp(1),
  },
  buttonView: {
    width: '100%',
    borderRadius: 5,
    height: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(4),
    backgroundColor: COLORS.primary,
  },
  signinText: {
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.white,
    fontSize: hp(2.2),
  },
  haveAnAccount: {
    fontSize: hp(2),
    color: COLORS.black,
    marginTop: hp(3),
    textAlign: 'center',
  },
  signUpText: {
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    fontSize: hp(2),
    textAlign: 'center',
  },
  eyeIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
  },
  logoImage: {
    width: wp(35),
    height: hp(10),
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: hp(1.8),
    color: COLORS.errorColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    marginTop: hp(1),
    marginLeft: wp(1),
  },
});
