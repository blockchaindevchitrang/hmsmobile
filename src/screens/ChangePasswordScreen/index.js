import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import {landscapeStyles, portraitStyles} from './styles';
import Header from '../../components/Header';
import {COLORS} from '../../utils';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import {onGetEditAccountDataApi} from '../../services/Api';
import {showMessage} from 'react-native-flash-message';
import useOrientation from '../../components/OrientationComponent';
import { hasNotch } from 'react-native-device-info';

export const ChangePasswordScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [currentPass, setCurrentPass] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refresh, setRefresh] = useState(false);

  const onEditUsers = async () => {
    try {
      if (currentPass == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter current password.');
      } else if (password == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter new password.');
      } else if (confirmPass == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter confirm password.');
      } else if (confirmPass !== password) {
        setErrorVisible(true);
        setErrorMessage('Please valid confirm password.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        setErrorMessage('');
        const urlData = `change-password?password_current=${currentPass}&password=${password}&password_confirmation=${confirmPass}`;
        const response = await onGetEditAccountDataApi(urlData);

        if (response.data.success) {
          showMessage({
            message: 'Change Password Successfully',
            type: 'success',
            duration: 3000,
          });
          setLoading(false);
          setCurrentPass('');
          setPassword('');
          setConfirmPass('');
        } else {
          setLoading(false);
          showMessage({
            message: response.data.message,
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        }
      }
    } catch (err) {
      if (err.response.data) {
        showMessage({
          message: err.response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: 'Something want wrong.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      setLoading(false);
      console.log('Add User Error:', err.response.data);
    }
  };

  return (
    <View style={[styles.safeAreaStyle, {backgroundColor: theme.lightColor}]}>
      <View
        style={{
          width: '100%',
          height: hasNotch() ? hp(5) : 0,
          backgroundColor: theme.headerColor,
        }}
      />
      <View style={styles.headerView}>
        <Header
          title={t('update_password')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreIcon={true}
        />
      </View>
      <View style={styles.mainView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={styles.profileView}>
            <View style={styles.subView}></View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText1}>CURRENT PASSWORD</Text>
                <TextInput
                  value={currentPass}
                  placeholder={'Current Password'}
                  onChangeText={text => setCurrentPass(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText1}>NEW PASSWORD</Text>
                <TextInput
                  value={password}
                  placeholder={'New Password'}
                  onChangeText={text => setPassword(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            <View style={styles.nameView}>
              <View style={{width: '100%'}}>
                <Text style={styles.dataHistoryText1}>CONFIRM PASSWORD</Text>
                <TextInput
                  value={confirmPass}
                  placeholder={'Confirm Password'}
                  onChangeText={text => setConfirmPass(text)}
                  style={[styles.nameTextView, {width: '100%'}]}
                />
              </View>
            </View>

            {errorVisible ? (
              <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
            ) : null}
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => onEditUsers()}
              style={styles.nextView}>
              {loading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={styles.nextText}>Save</Text>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => setNewUserVisible(false)}
              style={styles.prevView}>
              <Text style={styles.prevText}>Cancel</Text>
            </TouchableOpacity> */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ChangePasswordScreen;
