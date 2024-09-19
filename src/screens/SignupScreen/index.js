import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
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
import styles from './styles';

export const SignupScreen = ({navigation}) => {
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

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <Text style={[styles.textStyle, {color: theme.headerColor}]}>
        {t('sign_up_your_account')}
      </Text>
      <View style={[styles.mainView]}>
        <Text style={[styles.emailPlaceHolder, {color: theme.text}]}>
          {`${t('email_address')}*`}
        </Text>
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

        <Text style={[styles.emailPlaceHolder, {color: theme.text}]}>
          {`${t('password')}*`}
        </Text>
        <View
          style={[
            styles.textInputView,
            {
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: theme.text,
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
            style={[styles.textInput, {width: '83%', color: theme.text}]}
            secureTextEntry={passwordVisible}
            textContentType={'none'}
          />
          <TouchableOpacity
            style={{width: '9%'}}
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

        <TouchableOpacity
          style={[
            styles.buttonView,
            {opacity: isLoading ? 0.75 : 1, backgroundColor: theme.headerColor},
          ]}
          onPress={() => navigation.navigate('DashboardScreen')}>
          {isLoading ? (
            <ActivityIndicator size={'large'} color={COLORS.white} />
          ) : (
            <Text style={styles.signinText}>{t('sign_me_up')}</Text>
          )}
        </TouchableOpacity>
        <Text style={[styles.haveAnAccount, {color: theme.text}]}>
          {t('already_have_an_account')}
          <Text
            style={[styles.signUpText, {color: theme.headerColor}]}
            onPress={() => {
              setEmail('');
              setEmailError(false);
              setPassword('');
              setPasswordError(false);
              setApiError(false);
              navigation.navigate('LoginScreen');
            }}>
            {t('sign_in')}
          </Text>
        </Text>

        <View style={styles.socialView}>
          <TouchableOpacity style={styles.googleView}>
            <Image style={styles.googleImage} source={google} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.facebookView}>
            <Image style={styles.facebookImage} source={facebook} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;
