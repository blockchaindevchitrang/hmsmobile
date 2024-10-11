import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import headerLogo from '../../images/headerLogo.png';
import {onForgotPasswordApi} from '../../services/Api';
import {COLORS} from '../../utils';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../utils/ThemeProvider';

const ForgotPassword = ({navigation}) => {
  const {t} = useTranslation();
  const {theme, colorTheme} = useTheme();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = email => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const getTLDFromEmail = email => {
    const parts = email.split('@');
    if (parts.length === 2) {
      const domainParts = parts[1].split('.');
      if (domainParts.length > 1) {
        return `.${domainParts[domainParts.length - 1]}`; // Returns the TLD with dot (e.g., .com)
      }
    }
    return null; // Return null if the domain is invalid
  };

  const onForgotPasswordData = async () => {
    if (email === '') {
      setErrorMessage(t('email_address_is_required'));
      setEmailError(true);
    } else if (!isEmailValid(email)) {
      setErrorMessage(t('enter_a_valid_email_address'));
      setEmailError(true);
    } else {
      let domain = getTLDFromEmail(email);
      try {
        setIsLoading(true);
        const response = await onForgotPasswordApi(email, domain);
        console.log('get Repsonse>>', response.data);
        if (response.status === 200) {
          setIsLoading(false);
          navigation.navigate('LoginScreen');
        } else {
          setErrorMessage(t('enter_a_valid_email_address'));
          setEmailError(true);
          setIsLoading(false);
          console.log('get Repsonse>>', response);
        }
      } catch (error) {
        console.log('error::', error.response.data.detail);
        setErrorMessage(error.response.data.detail);
        setEmailError(true);
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.safeAreaStyle}>
      <View style={styles.container}>
        <Image style={styles.logoImage} source={headerLogo} />
        <View style={styles.mainView}>
          <Text style={styles.emailPlaceHolder}>{t('email_address')}</Text>
          <TextInput
            value={email}
            onChangeText={text => {
              if (emailError) {
                if (isEmailValid(text)) {
                  setEmail(text);
                  setEmailError(false);
                } else {
                  setEmail(text);
                }
              } else {
                setEmail(text);
                setEmailError(false);
              }
            }}
            placeholder="hello@example.com"
            placeholderTextColor={COLORS.greyColor}
            style={styles.textInput}
            autoCapitalize="none"
          />
          {emailError && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={[
              styles.buttonView,
              {
                opacity: isLoading ? 0.75 : 1,
                backgroundColor: theme.headerColor,
              },
            ]}
            onPress={() => onForgotPasswordData()}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={COLORS.white} />
            ) : (
              <Text style={styles.signinText}>{t('submit')}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.haveAnAccount}>
            <Text
              style={[styles.signUpText, {color: theme.headerColor}]}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              {`${t('login')} `}
            </Text>
            {/* /
            <Text
              style={[styles.signUpText, {color: theme.headerColor}]}
              onPress={() => {
                navigation.navigate('RegistrationScreen');
              }}>
              {` ${t('sign_up')}`}
            </Text> */}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ForgotPassword;
