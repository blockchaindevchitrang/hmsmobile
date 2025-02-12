import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './Pixel/index';
import bell from '../images/bell.png';
import {COLORS, Fonts} from '../utils';
import back from '../images/back.png';
import more from '../images/more.png';
import {useTheme} from '../utils/ThemeProvider';
import useOrientation from './OrientationComponent';

const Header = ({
  title,
  onPress,
  notificationPress,
  navigation,
  backVisible,
  userRole,
  notify,
  filterVisible,
  setFilterVisible,
  moreButtonClick,
  moreIcon,
}) => {
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {theme} = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeAreaStyle, {backgroundColor: theme.headerColor}]}>
      <View style={styles.container}>
        <View style={styles.titleView}>
          {backVisible && (
            <TouchableOpacity style={styles.backIcon} onPress={onPress}>
              <Image style={styles.moreIcon} source={back} />
            </TouchableOpacity>
          )}
          <Text style={[styles.titleHeader, {color: COLORS.black}]}>
            {title}
          </Text>
        </View>
        <View style={styles.titleView}>
          {!notify && (
            <TouchableOpacity
              style={styles.bellButtonView}
              onPress={() => navigation.navigate('NotificationScreen')}>
              <Image
                style={[
                  styles.bellIcon,
                  {
                    marginHorizontal: wp(3),
                    tintColor: COLORS.black,
                  },
                ]}
                source={bell}
              />
            </TouchableOpacity>
          )}
          {!moreIcon && (
            <TouchableOpacity
              style={styles.bellButtonView}
              onPress={moreButtonClick}>
              <Image
                style={[
                  styles.bellIcon,
                  {
                    // marginHorizontal: wp(3),
                    tintColor: COLORS.black,
                  },
                ]}
                source={more}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;

const portraitStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
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
  },
  titleHeader: {
    fontSize: hp(2.5),
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
  },
  bellButtonView: {
    width: wp(13),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
  },
});

const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: wp(3),
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    paddingTop: hp(4),
  },
  moreIcon: {
    width: wp(5),
    height: hp(4),
    resizeMode: 'contain',
  },
  titleHeader: {
    fontSize: hp(2.5),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    marginLeft: wp(2),
  },
  bellIcon: {
    width: wp(4),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(10),
  },
  bellButtonView: {
    width: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(5),
  },
});
