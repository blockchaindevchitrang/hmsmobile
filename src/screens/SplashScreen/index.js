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
import {
  onDashboardGetApi,
  onGetAccountListApi,
  onGetAllUsersDataApi,
  onGetBedApi,
  onGetBedTypeApi,
  onGetBloodBankApi,
  onGetBloodDonorApi,
  onGetCommonApi,
  onGetDoctorApi,
  onGetDoctorDepartmentApi,
  onGetPatientApi,
  onGetPatientCasesApi,
  onGetRoleDataApi,
} from '../../services/Api';
import {
  fetchAccountData,
  fetchAllUserData,
  fetchBedData,
  fetchBedTypeData,
  fetchBloodData,
  fetchBloodDonorData,
  fetchCaseData,
  fetchChargeCategoryData,
  fetchChargeData,
  fetchDashboardData,
  fetchDepartmentData,
  fetchDoctorData,
  fetchRoleData,
  fetchUserData,
} from '../../redux/reducer';

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
      navigation.replace('TabStack');

      const userData = await onGetPatientApi();
      console.log('Get Department Response::', userData.data.data);
      if (userData.data.data) {
        const usersData = userData.data.data;
        dispatch(fetchUserData(usersData));
      }

      const bedData = await onGetBedApi();
      console.log('Get Department Response::', bedData.data.data);
      if (bedData.data.data) {
        const usersData = bedData.data.data;
        dispatch(fetchBedData(usersData));
      }

      const bloodDonorData = await onGetBloodDonorApi();
      console.log('Get Department Response::', bloodDonorData.data.data);
      if (bloodDonorData.data.data) {
        const usersData = bloodDonorData.data.data;
        dispatch(fetchBloodDonorData(usersData));
      }

      const bedTypeData = await onGetBedTypeApi('created_at', 'ASC');
      console.log('Get Department Response::', bedTypeData.data.data);
      if (bedTypeData.data.data) {
        const usersData = bedTypeData.data.data;
        dispatch(fetchBedTypeData(usersData));
      }

      const roleData = await onGetRoleDataApi();
      console.log('Get Department Response::', roleData.data.data);
      if (roleData.data.data) {
        dispatch(fetchRoleData(roleData.data.data));
      }

      const allUserData = await onGetAllUsersDataApi();
      console.log('Get Department Response::', allUserData.data.data);
      if (allUserData.data.data) {
        dispatch(fetchAllUserData(allUserData.data.data));
      }

      const accountData = await onGetAccountListApi('');
      console.log('Get accountData Response::', accountData.data.data);
      if (accountData.data.data) {
        dispatch(fetchAccountData(accountData.data.data));
      }

      const caseData = await onGetPatientCasesApi('');
      console.log('Get Department Response::', caseData.data.data);
      if (caseData.data.data) {
        dispatch(fetchCaseData(caseData.data.data));
      }

      const categoryData = await onGetCommonApi('charge-category-get');
      console.log('Get Department Response::', categoryData.data.data.items);
      if (categoryData.data.data.items) {
        dispatch(fetchChargeCategoryData(categoryData.data.data.items));
      }

      const chargeData = await onGetCommonApi('charge-get');
      console.log('Get Department Response::', chargeData.data.data.items);
      if (chargeData.data.data.items) {
        dispatch(fetchChargeData(chargeData.data.data.items));
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
