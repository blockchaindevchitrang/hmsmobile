import React from 'react';
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';

export const SplashScreen = ({navigation}) => {
  const {theme, toggleTheme, colorTheme} = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={[styles.text, {color: theme.text}]}>LoginScreen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>
          <Text style={[styles.text, {color: theme.text}]}>SettingScreen</Text>
        </TouchableOpacity>
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
});

export default SplashScreen;
