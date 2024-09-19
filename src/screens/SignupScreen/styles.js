import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from '../../components/Pixel/index';
import {COLORS, Fonts} from '../../utils/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  textInputView: {
    width: '100%',
    borderWidth: 0.3,
    borderColor: COLORS.textColor,
    borderRadius: 5,
    height: hp(6),
    justifyContent: 'center',
    marginTop: hp(1),
  },
  textInput: {
    marginHorizontal: wp(3),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    fontSize: hp(2),
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
    fontSize: hp(2.1),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsMedium,
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
    width: wp(15),
    height: hp(9),
    resizeMode: 'contain',
  },
  forgotView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    fontSize: hp(1.8),
    color: COLORS.errorColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    marginTop: hp(1),
    marginLeft: wp(1),
  },
  socialView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: hp(2),
  },
  googleView: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(10),
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleImage: {
    width: wp(6),
    height: hp(4),
    resizeMode: 'contain',
  },
  facebookView: {
    marginLeft: wp(4),
  },
  facebookImage: {
    width: wp(10),
    height: hp(8),
    resizeMode: 'contain',
  },
});

export default styles;
