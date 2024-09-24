import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import styles from './styles';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';

export const AppointmentScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('appointment')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <View style={[styles.mainView, {backgroundColor: theme.background}]}>
        <ScrollView
          contentContainerStyle={{paddingBottom: hp(12)}}
          showsVerticalScrollIndicator={false}>
          <Text style={[styles.text, {color: theme.text}]}>
            Appointment Screen
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default AppointmentScreen;
