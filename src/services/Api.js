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
  console.log('Get Login Url:::', Api.baseUrl1);
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `show-dashboard`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};

export const onComingDashboardGetApi = async columnName => {
  console.log('Get Login Url:::', Api.baseUrl1);
  const token = await AsyncStorage.getItem('accessToken');
  const url = Api.baseUrl1 + `upcoming-appointment?columnName=${columnName}`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => resolve(res))
      .catch(err => reject(err));
  });
};
