import React from 'react';
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';

export const SettingScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const {theme, toggleTheme, colorTheme} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View style={styles.headerView}>
        <Header
          title={t('setting')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}>
        <View style={[styles.settingView, {borderColor: theme.text}]}>
          <Text style={[styles.text, {color: theme.text}]}>
            {colorTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            trackColor={{false: 'gray', true: 'green'}}
            ios_backgroundColor={'white'}
            thumbColor={'#fff'}
            onValueChange={toggleTheme}
            value={colorTheme === 'dark'}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 0.9,
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: hp(2),
  },
  headerView: {
    flex: 0.1,
  },
  settingView: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(6.5),
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
});

export default SettingScreen;
