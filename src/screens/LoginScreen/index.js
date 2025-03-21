import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import {useTranslation} from 'react-i18next';
import {COLORS, Fonts} from '../../utils';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import view from '../../images/view.png';
import hidden from '../../images/hidden.png';
import facebook from '../../images/facebook.png';
import google from '../../images/google.png';
import {portraitStyles, landscapeStyles} from './styles';
import {onGetCommonApi, onLoginApi} from '../../services/Api';
import {ErrorComponent} from '../../components/ErrorComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOrientation from '../../components/OrientationComponent';
import RNRestart from 'react-native-restart';
import {useDispatch} from 'react-redux';
import {fetchRolePermission} from '../../redux/reducer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const {t} = useTranslation();
  const {theme, colorTheme} = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSignIn = async () => {
    try {
      setIsLoading(true);
      if (email == '') {
        setEmailError(true);
        setIsLoading(false);
      } else if (password == '') {
        setPasswordError(true);
        setIsLoading(false);
      } else {
        const response = await onLoginApi(email, password);
        console.log('Get Response::', response.data);
        if (response.data.success) {
          setIsLoading(false);
          console.log('get Repsonse>>', response.data.data.token);
          AsyncStorage.setItem('accessToken', response.data.data.token);
          if (response.data.data.user.role == 'Admin') {
            const profileData = await onGetCommonApi('dynamic-permissions-get');
            if (profileData.data.flag == 1) {
              const transformedData = {
                modules: [
                  ...new Set(
                    profileData.data.data.map(item => item.main_module),
                  ),
                ], // Extract unique main_module values
                permission: profileData.data.data.flatMap(item =>
                  item.privileges.map(privilege => ({
                    end_point: privilege.end_point,
                    status: 1,
                    actions: privilege.action
                      ? privilege.action.split(', ')
                      : [],
                  })),
                ),
              };
              console.log(
                'Get Role Data From splashscreen::::',
                transformedData,
              );
              dispatch(fetchRolePermission(transformedData));
              setTimeout(() => {
                RNRestart.restart();
              }, 500);
            } else {
              RNRestart.restart();
            }
          } else {
            let margeArray = {
              modules: response.data.data.modules,
              permission: response.data.data.permission,
            };
            dispatch(fetchRolePermission(margeArray));
            RNRestart.restart();
          }
          // navigation.replace('TabStack');
        } else {
          setApiError(true);
          setApiErrorMessage('Something is wrong.');
          setIsLoading(false);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error::', error.response.data);
      if (error[0] == 'AxiosError: Network Error') {
        setApiError(true);
        setApiErrorMessage('Network Error');
        setIsLoading(false);
      } else if (error.response.data.error == 'Permission denied.') {
        setApiError(true);
        setApiErrorMessage(t('invalid_credentials'));
        setIsLoading(false);
      } else {
        setApiError(true);
        setApiErrorMessage(t('server_issue_please_try_again_later'));
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Text style={[styles.textStyle, {color: theme.headerColor}]}>
          {t('login')}
        </Text>
        {apiError && (
          <View style={styles.mainView}>
            <ErrorComponent errorMessage={apiErrorMessage} />
          </View>
        )}
        <View style={[styles.mainView]}>
          <View style={styles.textInputTitleView}>
            <Text style={[styles.emailPlaceHolder, {color: theme.text}]}>
              {t('email_address')}
            </Text>
          </View>
          <View style={[styles.textInputView, {borderColor: theme.text}]}>
            <TextInput
              value={email}
              onChangeText={text => {
                setEmail(text);
                setEmailError(false);
                setApiError(false);
              }}
              placeholder="hello@example.com"
              placeholderTextColor={COLORS.greyColor}
              style={[styles.textInput, {color: theme.text}]}
              keyboardType={'email-address'}
              textContentType={'none'}
              autoCapitalize={'none'}
            />
          </View>
          {emailError && (
            <Text style={styles.errorText}>
              {t('please_first_enter_email_address')}
            </Text>
          )}
          <View style={styles.textInputTitleView}>
            <Text style={[styles.emailPlaceHolder, {color: theme.text}]}>
              {t('password')}
            </Text>
          </View>
          <View
            style={[
              styles.textInputView,
              {
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: theme.text,
                justifyContent: 'flex-start',
              },
            ]}>
            <TextInput
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError(false);
                setApiError(false);
              }}
              placeholder="******"
              placeholderTextColor={COLORS.greyColor}
              style={[
                styles.textInput,
                {width: isPortrait ? '83%' : '87%', color: theme.text},
              ]}
              secureTextEntry={passwordVisible}
              textContentType={'none'}
            />
            <TouchableOpacity
              style={{width: isPortrait ? '9%' : '5%'}}
              onPress={() => {
                setPasswordVisible(!passwordVisible);
              }}>
              {passwordVisible ? (
                <Image
                  style={[styles.eyeIcon, {tintColor: theme.text}]}
                  source={hidden}
                />
              ) : (
                <Image
                  style={[styles.eyeIcon, {tintColor: theme.text}]}
                  source={view}
                />
              )}
            </TouchableOpacity>
          </View>
          {passwordError && (
            <Text style={styles.errorText}>
              {t('please_first_enter_password')}
            </Text>
          )}
          <Text
            style={[styles.forgotPassword, {color: theme.headerColor}]}
            onPress={() => {
              setEmail('');
              setEmailError(false);
              setPassword('');
              setPasswordError(false);
              setApiError(false);
              navigation.navigate('ForgotPassword');
            }}>
            {t('forget_password')}
          </Text>

          <TouchableOpacity
            style={[
              styles.buttonView,
              {
                opacity: isLoading ? 0.75 : 1,
                backgroundColor: theme.headerColor,
              },
            ]}
            onPress={() => onSignIn()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>{t('sign_me_in')}</Text>
            )}
          </TouchableOpacity>
          {/* <Text style={[styles.haveAnAccount, {color: theme.text}]}>
          {t('do_not_have_an_account')}
          <Text
            style={[styles.signUpText, {color: theme.headerColor}]}
            onPress={() => {
              setEmail('');
              setEmailError(false);
              setPassword('');
              setPasswordError(false);
              setApiError(false);
              navigation.navigate('SignupScreen');
            }}>
            {t('sign_up')}
          </Text>
        </Text> */}

          {/* <View style={styles.socialView}>
          <TouchableOpacity style={styles.googleView}>
            <Image style={styles.googleImage} source={google} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.facebookView}>
            <Image style={styles.facebookImage} source={facebook} />
          </TouchableOpacity>
        </View> */}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
