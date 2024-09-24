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
import DoctorComponent from '../../components/DoctorComponent';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    specialist: 'Onco',
    qualification: 'MBBS',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'MBBS',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'Phd',
    status: false,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'MBBS',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    specialist: 'Pediatrician',
    qualification: 'Phd',
    status: false,
  },
];

export const DoctorScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'doctor', title: 'Doctor'},
    {key: 'department', title: 'Doctor Departments'},
    {key: 'schedule', title: 'Schedules'},
    {key: 'holiday', title: 'Doctor Holidays'},
    {key: 'break', title: 'Breaks'},
  ]);

  const DoctorRoute = () => (
    <DoctorComponent
      allData={allData}
      search={search}
      setSearch={setSearch}
      filter={filter}
      setFilter={setFilter}
    />
  );

  const DepartmentRoute = () => (
    <ScrollView
      contentContainerStyle={{paddingBottom: hp(12)}}
      showsVerticalScrollIndicator={false}>
      <Text>Test</Text>
    </ScrollView>
  );

  const ScheduleRoute = () => (
    <ScrollView
      contentContainerStyle={{paddingBottom: hp(12)}}
      showsVerticalScrollIndicator={false}>
      <Text>Test</Text>
    </ScrollView>
  );

  const HolidayRoute = () => (
    <ScrollView
      contentContainerStyle={{paddingBottom: hp(12)}}
      showsVerticalScrollIndicator={false}>
      <Text>Test</Text>
    </ScrollView>
  );

  const BreakRoute = () => (
    <ScrollView
      contentContainerStyle={{paddingBottom: hp(12)}}
      showsVerticalScrollIndicator={false}>
      <Text>Test</Text>
    </ScrollView>
  );

  const renderScene = SceneMap({
    doctor: DoctorRoute,
    department: DepartmentRoute,
    schedule: ScheduleRoute,
    holiday: HolidayRoute,
    break: BreakRoute,
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
    props: SceneRendererProps & { navigationState: State }
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
          title={t('doctor')}
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

export default DoctorScreen;
