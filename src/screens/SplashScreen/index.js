import React, {useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import headerLogo from '../../images/headerLogo.png';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SplashScreen = ({navigation}) => {
  const {theme, toggleTheme, colorTheme} = useTheme();

  useEffect(() => {
    setTimeout(() => {
      onCheckAuth();
    }, 3000);
  }, []);

  const onCheckAuth = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token !== null) {
      navigation.replace('TabStack');
    } else {
      navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}>
        <Image source={headerLogo} style={styles.headerLogoImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  headerLogoImage: {
    width: wp(50),
    height: hp(12),
    resizeMode: 'contain',
  },
});

export default SplashScreen;
