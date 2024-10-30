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
import {useDispatch} from 'react-redux';
import {onDashboardGetApi, onGetAllUsersDataApi, onGetBloodBankApi, onGetDoctorApi, onGetDoctorDepartmentApi, onGetRoleDataApi} from '../../services/Api';
import {fetchBloodData, fetchDashboardData, fetchDepartmentData, fetchDoctorData, fetchRoleData, fetchUserData} from '../../redux/reducer';

export const SplashScreen = ({navigation}) => {
  const {theme, toggleTheme, colorTheme} = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      onCheckAuth();
    }, 3000);
  }, []);

  const onCheckAuth = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token !== null) {
      const DashboardData = await onDashboardGetApi();
      console.log('Get Doctor Response::', DashboardData.data.data);
      if (DashboardData.data.data) {
        dispatch(fetchDashboardData(DashboardData.data.data));
      }
      navigation.replace('TabStack');
      const DoctorData = await onGetDoctorApi('doctor-get');
      console.log('Get Doctor Response::', DoctorData.data.data);
      if (DoctorData.data.data) {
        dispatch(fetchDoctorData(DoctorData.data.data));
      }

      const DepartmentData = await onGetDoctorDepartmentApi('');
      console.log('Get Department Response::', DepartmentData.data.data);
      if (DepartmentData.data.data) {
        dispatch(fetchDepartmentData(DepartmentData.data.data));
      }

      const bloodData = await onGetBloodBankApi('');
      console.log('Get Department Response::', bloodData.data.data);
      if (bloodData.data.data) {
        dispatch(fetchBloodData(bloodData.data.data));
      }

      const userData = await onGetAllUsersDataApi();
      console.log('Get Department Response::', userData.data.data);
      if (userData.data.data) {
        const usersData = userData.data.data;
        const accountantData = usersData.filter(
          user => user.department === 'Patient',
        );
        dispatch(fetchUserData(accountantData));
      }

      const roleData = await onGetRoleDataApi();
      console.log('Get Department Response::', roleData.data.data);
      if (roleData.data.data) {
        dispatch(fetchRoleData(roleData.data.data));
      }
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
