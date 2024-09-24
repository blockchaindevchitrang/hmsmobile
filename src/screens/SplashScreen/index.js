import React, { useEffect } from 'react';
import {StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';

export const SplashScreen = ({navigation}) => {
  const {theme, toggleTheme, colorTheme} = useTheme();

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 3000);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
          },
        ]}>
        <Text style={[styles.text, {color: theme.text}]}>SplashScreen</Text>
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
