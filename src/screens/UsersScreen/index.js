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
import UserList from '../../components/UsersComponent/UserList';
import AccountantList from '../../components/UsersComponent/AccountantList';
import NursesList from '../../components/UsersComponent/NursesList';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    role: 'Admin',
    verify: false,
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    role: 'Admin',
    verify: false,
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    role: 'Doctor',
    verify: true,
    status: true,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    role: 'Doctor',
    verify: false,
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    role: 'Lab Technicians',
    verify: false,
    status: true,
  },
];

const accountantData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: 'NA',
    status: true,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    status: true,
  },
];

const NurseData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: 'NA',
    status: true,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    status: true,
  },
];

export const UsersScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'user', title: 'Users'},
    {key: 'role', title: 'Role'},
    {key: 'accountant', title: 'Accountants'},
    {key: 'nurses', title: 'Nurses'},
    {key: 'receptionists', title: 'Receptionists'},
    {key: 'technicians', title: 'Lab Technicians'},
    {key: 'pharmacists', title: 'Pharmacists'},
  ]);
  const [searchUser, setSearchUser] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [searchAccountant, setSearchAccountant] = useState('');
  const [searchBreak, setSearchBreak] = useState('');
  const [searchNurse, setSearchNurse] = useState('');

  const UserRoute = () => (
    <UserList
      searchBreak={searchUser}
      setSearchBreak={setSearchUser}
      allData={allData}
    />
  );

  const RoleRoute = () => (
    <TransactionComponent
      searchBreak={searchRole}
      setSearchBreak={setSearchRole}
      allData={allData}
    />
  );

  const AccountantRoute = () => (
    <AccountantList
      searchBreak={searchAccountant}
      setSearchBreak={setSearchAccountant}
      allData={accountantData}
    />
  );

  const NursesRoute = () => (
    <NursesList
      searchBreak={searchNurse}
      setSearchBreak={setSearchNurse}
      allData={allData}
    />
  );

  const ReceptionistRoute = () => (
    <TransactionComponent
      searchBreak={searchBreak}
      setSearchBreak={setSearchBreak}
      allData={allData}
    />
  );

  const TechnicianRoute = () => (
    <TransactionComponent
      searchBreak={searchBreak}
      setSearchBreak={setSearchBreak}
      allData={allData}
    />
  );

  const PharmacistRoute = () => (
    <TransactionComponent
      searchBreak={searchBreak}
      setSearchBreak={setSearchBreak}
      allData={allData}
    />
  );

  const renderScene = SceneMap({
    user: UserRoute,
    role: RoleRoute,
    accountant: AccountantRoute,
    nurses: NursesRoute,
    receptionists: ReceptionistRoute,
    technicians: TechnicianRoute,
    pharmacists: PharmacistRoute,
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
          title={t('users')}
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

export default UsersScreen;
