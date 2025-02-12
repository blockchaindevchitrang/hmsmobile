import React, { useEffect, useState } from 'react';
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
import { onGetCommonApi } from '../../services/Api';
import moment from 'moment';

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

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.dataHistoryView}>
        <Text style={styles.notificationTitleText}>{item.title}</Text>
        <Text style={styles.timeText}>
          {moment(item.created_at).format('DD-MM-YYYY')}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('notification')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          notify={true}
          moreIcon={true}
        />
      </View>
      <View style={[styles.mainView, {backgroundColor: theme.background}]}>
        <View style={styles.mainHeaderView}>
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
