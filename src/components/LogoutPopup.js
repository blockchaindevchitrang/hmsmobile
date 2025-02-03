import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../utils/ThemeProvider';
import useOrientation from './OrientationComponent';
// import Modal from 'react-native-modal';

export function LogoutPopup({modelVisible, setModelVisible, onPress}) {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modelVisible}
      onRequestClose={() => setModelVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModelVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={[styles.referralTitleText, {color: theme.headerColor}]}>
            {t('exit_app')}
          </Text>
          <Text style={styles.referralTitleText1}>
            {t('are_you_sure_you_want_to_exit_this_app')}
          </Text>
          <View style={styles.logoutButtonView}>
            <TouchableOpacity
              style={styles.linkButton1}
              onPress={() => setModelVisible(false)}>
              <Text style={styles.linkText1}>{t('Small_cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.linkButton, {backgroundColor: theme.headerColor}]}
              onPress={onPress}>
              <Text style={styles.linkText}>{t('Logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const portraitStyles = StyleSheet.create({
  container: {
    width: '94%',
    // height: hp(22),
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  referralTitleText: {
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    width: '100%',
    marginLeft: wp(3),
  },
  referralTitleText1: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    fontSize: hp(1.8),
    marginLeft: wp(5),
    marginTop: hp(2),
  },
  referralView: {
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.lightGreyColor,
    marginVertical: hp(3),
    borderRadius: 8,
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
  },
  referralText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  linkButton: {
    width: '30%',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(3),
  },
  linkButton1: {
    width: '30%',
    height: hp(5.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(2),
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  linkText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  logoutButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(3),
  },
});

const landscapeStyles = StyleSheet.create({
  container: {
    width: '50%',
    // height: hp(22),
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  referralTitleText: {
    fontSize: hp(2.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.primary,
    width: '100%',
    marginLeft: wp(3),
  },
  referralTitleText1: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    fontSize: hp(1.8),
    marginLeft: wp(3),
    marginTop: hp(2),
  },
  referralView: {
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.lightGreyColor,
    marginVertical: hp(3),
    borderRadius: 8,
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
  },
  referralText: {
    fontSize: hp(1.6),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  linkButton: {
    width: '25%',
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(3),
  },
  linkButton1: {
    width: '25%',
    height: hp(4.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginRight: wp(2),
  },
  linkText: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
  },
  linkText1: {
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
  },
  logoutButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(4),
  },
});

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
// } from 'react-native';
// import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
// import {COLORS, Fonts} from '../utils';
// import Modal from 'react-native-modal';

// export function LogoutPopup({modelVisible, setModelVisible, onPress}) {
//   return (
//     <Modal
//       isVisible={modelVisible}
//       animationIn={'bounceInUp'}
//       animationOut={'bounceOutDown'}
//       deviceWidth={wp(100)}
//       onBackdropPress={() => setModelVisible(false)}>
//       <View style={styles.container}>
//         <Text style={styles.referralTitleText}>Exit App</Text>
//         <Text style={styles.referralTitleText1}>
//           {'Are you sure you want to exit this app.'}
//         </Text>
//         <View style={styles.logoutButtonView}>
//           <TouchableOpacity
//             style={styles.linkButton1}
//             onPress={() => setModelVisible(false)}>
//             <Text style={styles.linkText1}>Cancel</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.linkButton} onPress={onPress}>
//             <Text style={styles.linkText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     width: '105%',
//     height: hp(22),
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     marginLeft: -wp(2.5),
//     paddingTop: hp(3),
//   },
//   referralTitleText: {
//     fontSize: hp(2.8),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.primary,
//     width: '100%',
//     marginLeft: wp(3),
//   },
//   referralTitleText1: {
//     color: COLORS.black,
//     fontFamily: Fonts.FONTS.PoppinsRegular,
//     fontSize: hp(1.8),
//     marginLeft: wp(5),
//     marginTop: hp(2),
//   },
//   referralView: {
//     width: '94%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 0.5,
//     borderColor: COLORS.lightGreyColor,
//     marginVertical: hp(3),
//     borderRadius: 8,
//     paddingVertical: hp(2),
//     paddingHorizontal: wp(2),
//     alignSelf: 'center',
//   },
//   referralText: {
//     fontSize: hp(1.6),
//     fontFamily: Fonts.FONTS.PoppinsMedium,
//     color: COLORS.black,
//   },
//   linkButton: {
//     width: '30%',
//     height: hp(5.5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//     marginRight: wp(3),
//   },
//   linkButton1: {
//     width: '30%',
//     height: hp(5.5),
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     alignSelf: 'flex-end',
//     marginRight: wp(2),
//   },
//   linkText: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.white,
//   },
//   linkText1: {
//     fontSize: hp(2),
//     fontFamily: Fonts.FONTS.PoppinsSemiBold,
//     color: COLORS.black,
//   },
//   logoutButtonView: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginTop: hp(3),
//   },
// });
