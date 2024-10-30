import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

export default class Api {
  static baseUrl1 = Config.BASE_URL;
}

// export const sendPushNotification = async (token, title, body, sound) => {
//   const FIREBASE_API_KEY = Config.FIREBASE_API_KEY;

//   const message = {
//     registration_ids: [token],
//     notification: {
//       title: title,
//       body: body,
//       vibrate: 1,
//       sound: sound,
//       show_in_foreground: true,
//       priority: 'high',
//       content_available: true,
//     },
//   };

//   let headers = new Headers({
//     'Content-Type': 'application/json',
//     Authorization: 'key=' + FIREBASE_API_KEY,
//   });
//   console.log('Get Respomse Notification:::::', JSON.stringify(message));
//   let response = await fetch(Config.NOTIFICATION_URL, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(message),
//   });
//   // console.log("=><*", response);
//   response = await response.json();
//   //  console.log("=><*", response);
// };

export const onLoginApi = async (email, password) => {
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + `login?email=${email}&password=${password}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onForgotPasswordApi = async (email, domain) => {
  console.log('Get Login Url:::', Api.baseUrl1);
  const url =
    Api.baseUrl1 + `forgot-password?email=${email}&url_domain=${domain}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDashboardGetApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'show-dashboard';
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onComingDashboardGetApi = async columnName => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `upcoming-appointment`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddUsersApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + 'store-users';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateUserDataApi = async (id, body) => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + `update-user/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .patch(url, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteUserDataApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `delete-user/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAllUsersDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'get-users';
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetSpecificUsersDataApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `fetch-user?id=${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetRoleDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'get-roles';
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetRolePermissionDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'get-permissions';
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetProfileDataApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'get-profile';
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddRoleApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + 'add-role';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddAppointmentApi = async dataUrl => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + dataUrl;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAppointmentDataApi = async filterUrl => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + filterUrl;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFilterAppointmentApi = async text => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `appointment-get?search=${text}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onCancelAppointmentApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + `appointment-cancel/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onSuccessAppointmentApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + `appointment-success/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetAppointmentPaymentHistoryApi = async text => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `appointment-payment-complete?search=${text}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetDoctorDetailApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `doctor-edit/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetFilterDoctorDepartmentApi = async (text, limit) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + `filter-doctor-department?search=${text}&limit=${limit}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetDoctorDepartmentApi = async text => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `filter-doctor-department?search=${text}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddDoctorDepartmentApi = async (title, des, status, type) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    `store-doctor-department?title=${title}&description=${des}&status=${status}&type=${type}`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify({}), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateDoctorDepartmentApi = async (
  id,
  title,
  des,
  status,
  type,
) => {
  const token = await AsyncStorage.getItem('accessToken');

  const url =
    Api.baseUrl1 +
    `update-doctor-department/${id}?title=${title}&description=${des}&status=${status}&type=${type}`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .patch(url, JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteDepartmentApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `delete-doctor-department/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBedTypeApi = async (sortCol, sortType) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + `bed-type-get?sortCol=${sortCol}&sortType=${sortType}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddBedTypeApi = async (title, des) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + `bed-type-create?title=${title}&description=${des}`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateBedTypeApi = async (id, title, des) => {
  const token = await AsyncStorage.getItem('accessToken');

  const url =
    Api.baseUrl1 + `bed-type-update/${id}?title=${title}&description=${des}`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .patch(url, JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBedTypeApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `bed-type-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddBedApi = async (name, charge, bed_type, description) => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url =
    Api.baseUrl1 +
    `bed-create?name=${name}&charge=${charge}&bed_type=${bed_type}&description=${description}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateBedApi = async (
  id,
  name,
  charge,
  bed_type,
  description,
) => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url =
    Api.baseUrl1 +
    `bed-update/${id}?name=${name}&charge=${charge}&bed_type=${bed_type}&description=${description}`;
  return new Promise((resolve, reject) => {
    axios
      .patch(url, JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBedApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `bed-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBedApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `bed-get?all=100`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBedAssignApi = async (sortCol, sortType) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 + `bed-assign-get?sortCol=${sortCol}&sortType=${sortType}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBedAssignApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `bed-assign-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddBedAssignApi = async filterUrl => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + filterUrl;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateBedAssignApi = async filterUrl => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + filterUrl;
  return new Promise((resolve, reject) => {
    axios
      .patch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBloodBankApi = async (group, bags) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'blood-bank-get';
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBloodBankApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `blood-bank-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddBloodBankApi = async (group, bags) => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + `blood_group=${group}+&remained_bags=${bags}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateBloodBankApi = async filterUrl => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + filterUrl;
  return new Promise((resolve, reject) => {
    axios
      .patch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetBloodDonorApi = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + 'blood-donor-get';
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetDoctorApi = async endPoint => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + endPoint;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddDoctorApi = async requestData => {
  const token = await AsyncStorage.getItem('accessToken');
  console.log('Get Login Url:::', Api.baseUrl1);
  const url = Api.baseUrl1 + 'doctor-store';
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateDoctorApi = async (requestData, id) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `doctor-update/${id}`;
  console.log('Get Login Url:::', url, requestData);
  return new Promise((resolve, reject) => {
    axios
      .post(url, requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteDoctorApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `doctor-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetDoctorHolidayApi = async text => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `doctor-holiday-get?search=${text}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddDoctorHolidayApi = async (doctor_id, date, reason) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    `doctor-holiday-store?doctor_id=${doctor_id}&date=${date}&reason=${reason}`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify({}), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onUpdateDoctorHolidayApi = async (id, doctor_id, date, reason) => {
  const token = await AsyncStorage.getItem('accessToken');

  const url =
    Api.baseUrl1 +
    `doctor-holiday-update/${id}?doctor_id=${doctor_id}&date=${date}&reason=${reason}`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .patch(url, JSON.stringify({}), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteHolidayApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `doctor-holiday-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onGetDoctorBreakApi = async text => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `lunch-break-get?search=${text}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onAddDoctorBreakApi = async (
  doctor_id,
  break_from,
  break_to,
  optionType,
  date,
) => {
  const token = await AsyncStorage.getItem('accessToken');
  const url =
    Api.baseUrl1 +
    `lunch-break-store?doctor_id=${doctor_id}&break_from=${break_from}&break_to=${break_to}&${
      optionType == 'every' ? 'every_day=1' : `date=${date}`
    }`;
  console.log('Get Login Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .post(url, JSON.stringify({}), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onDeleteBreakApi = async id => {
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `lunch-break-delete/${id}`;
  console.log('Get Doctor Details Url:::', url);
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
