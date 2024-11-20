import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from './Pixel';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../utils/ThemeProvider';
import danger from '../images/danger.png';

export function DeletePopup({
  modelVisible,
  setModelVisible,
  onPress,
  setUserId,
  isLoading,
}) {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const width = new Animated.Value(130);
  const height = new Animated.Value(80);

  useEffect(() => {
    // Function to animate width and height in a loop
    const animateImage = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(width, {
              toValue: 220,
              duration: 1500,
              useNativeDriver: false,
            }),
            Animated.timing(width, {
              toValue: 130,
              duration: 1500,
              useNativeDriver: false,
            }),
          ]),
          Animated.sequence([
            Animated.timing(height, {
              toValue: 120,
              duration: 1500,
              useNativeDriver: false,
            }),
            Animated.timing(height, {
              toValue: 80,
              duration: 1500,
              useNativeDriver: false,
            }),
          ]),
        ]),
      ).start();
    };

    animateImage();
  }, [width, height]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modelVisible}
      onRequestClose={() => setModelVisible(false)}>
      <View style={styles.maneModalView}>
        <TouchableWithoutFeedback
          onPress={() => {
            setUserId('');
            setModelVisible(false);
          }}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Animated.Image
            source={danger}
            style={{
              width: width,
              height: height,
              resizeMode: 'contain',
              marginVertical: hp(2),
            }}
          />
          <Text style={[styles.referralTitleText, {color: theme.headerColor}]}>
            {'Delete Record'}
          </Text>
          <Text style={styles.referralTitleText1}>
            {'Are you sure you want to delete this record?'}
          </Text>
          <View style={styles.logoutButtonView}>
            <TouchableOpacity
              style={styles.linkButton1}
              onPress={() => {
                setUserId('');
                setModelVisible(false);
              }}>
              <Text style={styles.linkText1}>{'Cancel'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.linkButton, {backgroundColor: theme.headerColor}]}
              onPress={onPress}>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.linkText}>{'Delete'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '94%',
    // height: hp(22),
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
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
    // width: '100%',
    // marginLeft: wp(3),
  },
  referralTitleText1: {
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsRegular,
    fontSize: hp(2),
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
