import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import styles from './styles';
import Header from '../../components/Header';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import {TabView, SceneMap} from 'react-native-tab-view';
import {COLORS} from '../../utils';
import TransactionComponent from '../../components/TransactionComponent';
import AppointmentComponent from '../../components/AppointmentComponent';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'Cash',
    amount: '$2,000.00',
    create_at: '20th May, 2024',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'UPI',
    amount: '$15,000.00',
    create_at: '21th May, 2024',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'Stripe',
    amount: '$1,000.00',
    create_at: '22th May, 2024',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'Cash',
    amount: '$1,000.00',
    create_at: '22th May, 2024',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    payment: 'UPI',
    amount: '$1,000.00',
    create_at: '22th May, 2024',
  },
];

const appointmentData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Confirm',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Cancel',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Pending',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Pending',
  },
  {
    id: 6,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    department: 'Allergists',
    status: 'Cancel',
  },
];

export const AppointmentScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'appointments', title: 'Appointments'},
    {key: 'transaction', title: 'Appointments Transaction'},
  ]);
  const [searchBreak, setSearchBreak] = useState('');

  const AppointmentRoute = () => (
    <AppointmentComponent
      searchBreak={searchBreak}
      setSearchBreak={setSearchBreak}
      allData={appointmentData}
    />
  );

  const TransactionRoute = () => (
    <TransactionComponent
      searchBreak={searchBreak}
      setSearchBreak={setSearchBreak}
      allData={allData}
    />
  );

  const renderScene = SceneMap({
    appointments: AppointmentRoute,
    transaction: TransactionRoute,
  });

  const renderItem =
    ({navigationState, position}) =>
    ({route, index}) => {
      const isActive = navigationState.index === index;
      return (
        <View
          style={[
            styles.tab,
            {
              backgroundColor: isActive
                ? COLORS.headerGreenColor
                : COLORS.greyColor,
            },
          ]}>
          <View style={[styles.item]}>
            <Text style={[styles.label]}>{route.title}</Text>
          </View>
        </View>
      );
    };

  const renderTabBar = (
    props: SceneRendererProps & {navigationState: State},
  ) => (
    <View style={[styles.tabbar, {backgroundColor: theme.lightColor}]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {props.navigationState.routes.map((route: Route, index: number) => {
          return (
            <TouchableWithoutFeedback
              key={route.key}
              onPress={() => props.jumpTo(route.key)}>
              {renderItem(props)({route, index})}
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('appointment')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
        />
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        pagerStyle={{backgroundColor: theme.background}}
        style={{backgroundColor: 'red'}}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />
    </View>
  );
};

export default AppointmentScreen;
