import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import {landscapeStyles, portraitStyles} from './styles';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import useOrientation from '../../components/OrientationComponent';
import {onGetCommonApi} from '../../services/Api';
import moment from 'moment';
import {COLORS} from '../../utils';
import SubHeader from '../../components/SubHeader';

export const NotificationScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [notificationData, setNotificationData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    onGetCallLogData();
  }, []);

  const onGetCallLogData = async () => {
    try {
      const response = await onGetCommonApi('get-profile');
      console.log('GetAccountData>>', response.data.data.user.id);
      if (response.status == 200) {
        onGetNotificationData(response.data.data.user.role);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  const onGetNotificationData = async role => {
    try {
      const response = await onGetCommonApi(`get-notification/${role}`);
      if (response.data.success) {
        setNotificationData(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:>', err);
    }
  };

  const onReadAllFunction = async () => {
    try {
      const response = await onGetCommonApi('read-all-notification');
      if (response.data.success) {
        onGetCallLogData();
      }
    } catch (err) {
      console.log('Error:>', err);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {
            backgroundColor:
              item.read_at != null
                ? COLORS.lightColor
                : COLORS.headerGreenColor,
          },
        ]}>
        <View style={{width: '70%'}}>
          <Text style={styles.notificationTitleText}>{item.title}</Text>
          {item.text != null && (
            <Text style={styles.timeText}>{item.text}</Text>
          )}
        </View>
        <View>
          <Text style={styles.timeText}>
            {isPortrait
              ? `${moment(item.created_at).format('DD-MM-YYYY')}\n${moment(
                  item.created_at,
                ).format('hh:mm:ss')}`
              : moment(item.created_at).format('DD-MM-YYYY hh:mm:ss')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        {/* <Header
          title={t('notification')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          notify={true}
          moreIcon={true}
        /> */}
        <SubHeader
          title={t('notification')}
          onPress={() => navigation.goBack()}
          rightValue={true}
          readPress={() => onReadAllFunction()}
        />
      </View>
      <View style={[styles.mainView, {backgroundColor: theme.background}]}>
        <View style={styles.mainHeaderView}>
          {/* {notificationData.length > 0 && (
            <TouchableOpacity
              onPress={() => onReadAllFunction()}
              style={styles.readAllView}>
              <Text style={styles.readAllText}>Read All</Text>
            </TouchableOpacity>
          )} */}
          <FlatList
            data={notificationData}
            renderItem={renderItem}
            bounces={false}
            showsVerticalScrollIndicator={false}
            initialNumToRender={notificationData.length}
            nestedScrollEnabled
            virtualized
            ListEmptyComponent={() => (
              <View key={0} style={styles.ListEmptyView}>
                <Text style={styles.emptyText}>{'No record found'}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default NotificationScreen;
