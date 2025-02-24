import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import back from '../images/back.png';
import {COLORS, Fonts} from '../utils';
import {useTranslation} from 'react-i18next';
import useOrientation from './OrientationComponent';
import {useTheme} from '../utils/ThemeProvider';

const SubHeader = ({
  backbutton,
  title,
  onPress,
  rightValue,
  readPress,
  notificationCount,
}) => {
  const {t} = useTranslation();
  const [volumeState, setVolumeState] = useState(true);
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {theme} = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeAreaStyle, {backgroundColor: theme.headerColor}]}>
      <View style={styles.container}>
        <View style={styles.titleView}>
          <TouchableOpacity style={styles.backIcon} onPress={onPress}>
            <Image style={styles.moreIcon} source={back} />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>{title}</Text>
        </View>
        {rightValue ? (
          <View style={styles.titleView}>
            <TouchableOpacity
              style={{
                width: isPortrait ? wp(25) : wp(20),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={readPress}>
              <Text
                style={[
                  styles.readAllText,
                  {
                    color: COLORS.textColor,
                  },
                ]}>
                {'Read All'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.titleView}></View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SubHeader;

const portraitStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
  },
  moreIcon: {
    width: wp(6),
    height: hp(5),
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  titleHeader: {
    fontSize: hp(2.5),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    marginLeft: wp(3),
  },
  bellIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
  },
  readAllText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greyColor,
  },
});

const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    height: hp(10),
    paddingTop: hp(2),
    // backgroundColor: 'red',
  },
  moreIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  titleHeader: {
    fontSize: hp(2.5),
    color: COLORS.black,
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
  },
  bellIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
  },
  readAllText: {
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.greyColor,
  },
});
