import React, {useEffect, useState} from 'react';
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
import setting from '../../images/setting.png';
import styles from './styles';
import Header from '../../components/Header';
import {onComingDashboardGetApi, onDashboardGetApi} from '../../services/Api';
import moment from 'moment';

export const DashboardScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [dashboardData, setDashboardData] = useState([]);
  const [upcomingDashboardData, setUpcomingDashboardData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    onGetDashboardData();
    onUpcomingData();
  }, []);

  const onGetDashboardData = async () => {
    try {
      const response = await onDashboardGetApi();
      console.log('Get onGetDashboardData>>', response);
      if (response.status === 200) {
        console.log('Get onGetDashboardData>>', response.data.data);
        setDashboardData(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const onUpcomingData = async () => {
    try {
      const response = await onComingDashboardGetApi('test');
      console.log('Get onUpcomingData>>', response);
      if (response.status === 200) {
        console.log('Get onUpcomingData>>', response.data);
        setUpcomingDashboardData(response.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const formatNumber = num => {
    console.log('get Number:::', num);
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('dashboard')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <View style={[styles.mainView, {backgroundColor: theme.background}]}>
        <ScrollView
          contentContainerStyle={{paddingBottom: hp(12)}}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {`TK ${formatNumber(dashboardData?.invoiceAmount)}`}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Invoice Amount'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {`TK ${formatNumber(dashboardData?.billAmount)}`}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Billed Amount'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {`TK ${formatNumber(dashboardData?.paymentAmount)}`}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Payment Amount'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {`TK ${formatNumber(dashboardData?.advancePaymentAmount)}`}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Adv Pay-Amount'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {dashboardData?.doctors}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Doctors'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {dashboardData?.patients}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Patients'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {dashboardData?.nurses}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Nurses'}
              </Text>
            </View>
          </View>

          <View style={[styles.boxView, {backgroundColor: theme.lightColor}]}>
            <View
              style={[styles.roundView, {backgroundColor: theme.headerColor}]}>
              <Image
                source={setting}
                style={[styles.iconStyle1, {tintColor: COLORS.white}]}
              />
            </View>
            <View>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {dashboardData?.availableBeds}
              </Text>
              <Text style={[styles.optionText, {color: theme.text}]}>
                {'Available Beds'}
              </Text>
            </View>
          </View>

          <View
            style={[styles.enquireView, {backgroundColor: theme.grayColor}]}>
            <Text style={styles.titleText}>Enquiries</Text>
          </View>

          <View style={[styles.noticeView, {backgroundColor: COLORS.white}]}>
            <Text style={styles.titleText}>Notice Board</Text>

            <View style={styles.listView}>
              <View
                style={[styles.titleView, {backgroundColor: theme.grayColor}]}>
                <Text style={styles.titleListText}>TITLE</Text>
                <Text style={styles.titleListText}>CREATED ON</Text>
              </View>
              {dashboardData?.noticeBoards?.length > 0 ? (
                dashboardData?.noticeBoards.map((item, index) => {
                  return (
                    <View style={[styles.dataView]}>
                      <Text
                        style={[
                          styles.dataListText,
                          {color: theme.headerColor},
                        ]}>
                        {item.title}
                      </Text>
                      <View
                        style={[
                          styles.dateBox,
                          {backgroundColor: theme.lightColor},
                        ]}>
                        <Text style={styles.dataListText}>
                          {moment(item.created_at).format('DD MMM, YYYY')}
                        </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.dataFoundView}>
                  <Text style={styles.dataFoundText}>Data not found</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.noticeView1, {backgroundColor: COLORS.white}]}>
            <Text style={styles.titleText1}>Upcoming Appointment</Text>

            <View style={styles.listView1}>
              <View style={[styles.titleView1]}>
                <Text style={[styles.titleListText, {width: '37%'}]}>
                  PATIENT
                </Text>
                <Text style={[styles.titleListText, {width: '37%'}]}>
                  DOCTORS
                </Text>
                <Text style={[styles.titleListText1, {width: '26%'}]}>
                  DATE
                </Text>
              </View>
              <View style={[styles.dataView1]}>
                <Text style={[styles.dataListText]}>enfshdu</Text>
                <Text style={[styles.dataListText]}>enfshdu</Text>
                <View
                  style={[
                    styles.dateBox1,
                    {backgroundColor: theme.lightColor},
                  ]}>
                  <Text style={styles.dataListText1} numberOfLines={2}>
                    22:20:00 2023-05-25
                  </Text>
                </View>
              </View>
              <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default DashboardScreen;
