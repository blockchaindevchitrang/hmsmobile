import React, {useState, useRef, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  Animated,
  Image,
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
import headerLogo from '../../images/headerLogo.png';
import UserList from '../../components/UsersComponent/UserList';
import AccountantList from '../../components/UsersComponent/AccountantList';
import NursesList from '../../components/UsersComponent/NursesList';
import {BlurView} from '@react-native-community/blur';
import ReceptionistsList from '../../components/UsersComponent/ReceptionistsList';
import LabTechniciansList from '../../components/UsersComponent/LabTechniciansList';
import PharmacistsList from '../../components/UsersComponent/PharmacistsList';
import {
  onGetAllUsersDataApi,
  onGetCommonApi,
  onGetRoleDataApi,
  onGetRolePermissionDataApi,
} from '../../services/Api';
import RoleList from '../../components/UsersComponent/RoleList';
import {useSelector} from 'react-redux';

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

const AccountantData = [
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
    qualification: 'mca',
    bod: 'N/A',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    qualification: 'bsc',
    bod: 'N/A',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: 'NA',
    status: false,
    qualification: 'mca',
    bod: '8th April, 1999',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    qualification: 'bsc',
    bod: '10th May, 1998',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    status: false,
    qualification: 'msc',
    bod: 'N/A',
  },
];

const ReceptionistsData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    status: true,
    designation: 'Jr',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    designation: 'Doctor',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: 'NA',
    status: false,
    designation: 'Receptionist',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    status: true,
    designation: 'N/A',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    status: false,
    designation: 'Lab Technician',
  },
];

const LabTechniciansData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    status: true,
    designation: 'Lab',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    designation: 'Moderator',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    designation: 'N/A',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    designation: 'N/A',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    designation: 'Lab',
  },
];

const PharmacistsData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    status: true,
    blood: 'N/A',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    blood: 'O+',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    blood: 'N/A',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    blood: 'AB-',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    blood: 'A+',
  },
];

export const UsersScreen = ({navigation}) => {
  const roleData = useSelector(state => state.roleData);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'user', title: 'Users'},
    // {key: 'role', title: 'Role'},
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
  const [searchReceptionist, setSearchReceptionist] = useState('');
  const [searchLabTechnician, setSearchLabTechnician] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Users');
  const [userData, setUserData] = useState([]);
  const [accountantData, setAccountantData] = useState([]);
  const [nursesData, setNursesData] = useState([]);
  const [receptionistData, setReceptionistData] = useState([]);
  const [labTechniciansData, setLabTechniciansData] = useState([]);
  const [pharmacistsData, setPharmacistsData] = useState([]);
  const [rolePermission, setRolePermission] = useState([]);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [nurseTotalPage, setNurseTotalPage] = useState('1');
  const [accountantTotalPage, setAccountantTotalPage] = useState('1');
  const [receptionistTotalPage, setReceptionistTotalPage] = useState('1');
  const [labTechnicianTotalPage, setLabTechnicianTotalPage] = useState('1');
  const [pharmacistTotalPage, setPharmacistTotalPage] = useState('1');
  const [userActive, setUserActive] = useState(1);
  const [userType, setUserType] = useState(0);
  const [userTypeName, setUserTypeName] = useState('All');
  const [nurseActive, setNurseActive] = useState(1);
  const [accountantActive, setAccountantActive] = useState(1);
  const [receptionistActive, setReceptionistActive] = useState(1);
  const [labTechnicianActive, setLabTechnicianActive] = useState(1);
  const [pharmacistActive, setPharmacistActive] = useState(1);
  const [userDepartment, setUserDepartment] = useState('');
  const [refresh, setRefresh] = useState(false);

  // const UserRoute = () => (
  //   <UserList
  //     searchBreak={searchUser}
  //     setSearchBreak={setSearchUser}
  //     allData={allData}
  //   />
  // );

  // const RoleRoute = () => (
  //   <TransactionComponent
  //     searchBreak={searchRole}
  //     setSearchBreak={setSearchRole}
  //     allData={allData}
  //   />
  // );

  // const AccountantRoute = () => (
  //   <AccountantList
  //     searchBreak={searchAccountant}
  //     setSearchBreak={setSearchAccountant}
  //     allData={accountantData}
  //   />
  // );

  // const NursesRoute = () => (
  //   <NursesList
  //     searchBreak={searchNurse}
  //     setSearchBreak={setSearchNurse}
  //     allData={NurseData}
  //   />
  // );

  // const ReceptionistRoute = () => (
  //   <TransactionComponent
  //     searchBreak={searchBreak}
  //     setSearchBreak={setSearchBreak}
  //     allData={allData}
  //   />
  // );

  // const TechnicianRoute = () => (
  //   <TransactionComponent
  //     searchBreak={searchBreak}
  //     setSearchBreak={setSearchBreak}
  //     allData={allData}
  //   />
  // );

  // const PharmacistRoute = () => (
  //   <TransactionComponent
  //     searchBreak={searchBreak}
  //     setSearchBreak={setSearchBreak}
  //     allData={allData}
  //   />
  // );

  // const renderScene = SceneMap({
  //   user: UserRoute,
  //   role: RoleRoute,
  //   accountant: AccountantRoute,
  //   nurses: NursesRoute,
  //   receptionists: ReceptionistRoute,
  //   technicians: TechnicianRoute,
  //   pharmacists: PharmacistRoute,
  // });

  // const renderItem =
  //   ({navigationState, position}) =>
  //   ({route, index}) => {
  //     const isActive = navigationState.index === index;
  //     return (
  //       <View
  //         style={[
  //           styles.tab,
  //           {
  //             backgroundColor: isActive
  //               ? COLORS.headerGreenColor
  //               : COLORS.greyColor,
  //           },
  //         ]}>
  //         <View style={[styles.item]}>
  //           <Text style={[styles.label]}>{route.title}</Text>
  //         </View>
  //       </View>
  //     );
  //   };

  // const renderTabBar = (
  //   props: SceneRendererProps & {navigationState: State},
  // ) => (
  //   <View style={[styles.tabbar, {backgroundColor: theme.lightColor}]}>
  //     <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  //       {props.navigationState.routes.map((route: Route, index: number) => {
  //         return (
  //           <TouchableWithoutFeedback
  //             key={route.key}
  //             onPress={() => props.jumpTo(route.key)}>
  //             {renderItem(props)({route, index})}
  //           </TouchableWithoutFeedback>
  //         );
  //       })}
  //     </ScrollView>
  //   </View>
  // );

  useEffect(() => {
    onGetUserData();
  }, [searchUser, pageCount, userTypeName, userActive]);

  useEffect(() => {
    onGetRolePermissionData();
  }, []);

  const animations = useRef(
    [0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
  ).current;

  const toggleMenu = open => {
    const toValue = open ? 0 : 300; // For closing, move down
    const opacityValue = open ? 1 : 0; // For fading
    if (open) {
      // Start opening animations
      setOptionModalView(true); // Show modal first
      setTimeout(() => {
        Animated.stagger(
          150,
          animations.map((anim, index) =>
            Animated.parallel([
              Animated.timing(anim, {
                toValue,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(opacities[index], {
                toValue: opacityValue,
                duration: 300,
                useNativeDriver: true,
              }),
            ]),
          ),
        ).start();
      }, 100);
    } else {
      // Start closing animations
      Animated.stagger(
        140,
        animations.map((anim, index) =>
          Animated.parallel([
            Animated.timing(anim, {
              toValue,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacities[index], {
              toValue: opacityValue,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ),
      ).start(() => {
        setOptionModalView(false); // Hide modal after animations complete
      });
    }
  };

  const onGetUserData = async () => {
    try {
      let urlData = `get-users?search=${searchUser}&page=${pageCount}&department_name=${userTypeName == 'All' ? '' : userTypeName}&${userActive == 2 ? 'active=1' : userActive == 3 && 'deactive=0'}`;
      // const response = await onGetAllUsersDataApi();
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        const usersData = response.data.data;

        // Set data to respective states
        // setAccountantData(accountantData);
        // setNursesData(nursesData);
        // setReceptionistData(receptionistData);
        // setLabTechniciansData(labTechniciansData);
        // setPharmacistsData(pharmacistsData);
        setUserData(response.data.data);
        setTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onGetNurseData();
  }, [searchUser, pageCount, nurseActive]);

  const onGetNurseData = async () => {
    try {
      let urlData = `get-users?search=${searchNurse}&page=${pageCount}&department_name=Nurse&${nurseActive == 2 ? 'active=1' : nurseActive == 3 && 'deactive=0'}`;
      // const response = await onGetAllUsersDataApi();
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        // Set data to respective states
        setNursesData(response.data.data);
        setNurseTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onGetAccountantData();
  }, [searchUser, pageCount, accountantActive]);

  const onGetAccountantData = async () => {
    try {
      let urlData = `get-users?search=${searchAccountant}&page=${pageCount}&department_name=Accountant&${accountantActive == 2 ? 'active=1' : accountantActive == 3 && 'deactive=0'}`;
      // const response = await onGetAllUsersDataApi();
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        // Set data to respective states
        setAccountantData(response.data.data);
        setAccountantTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onGetReceptionistData();
  }, [searchUser, pageCount, receptionistActive]);

  const onGetReceptionistData = async () => {
    try {
      let urlData = `get-users?search=${searchReceptionist}&page=${pageCount}&department_name=Receptionist&${receptionistActive == 2 ? 'active=1' : receptionistActive == 3 && 'deactive=0'}`;
      // const response = await onGetAllUsersDataApi();
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        // Set data to respective states
        setReceptionistData(response.data.data);
        setReceptionistTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onGetPharmacistData();
  }, [searchUser, pageCount, pharmacistActive]);

  const onGetPharmacistData = async () => {
    try {
      let urlData = `get-users?search=${searchPharmacists}&page=${pageCount}&department_name=Pharmacist&${pharmacistActive == 2 ? 'active=1' : pharmacistActive == 3 && 'deactive=0'}`;
      // const response = await onGetAllUsersDataApi();
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        // Set data to respective states
        setPharmacistsData(response.data.data);
        setPharmacistTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onGetLabTechniciansData();
  }, [searchUser, pageCount, labTechnicianActive]);

  const onGetLabTechniciansData = async () => {
    try {
      let urlData = `get-users?search=${searchLabTechnician}&page=${pageCount}&department_name=Lab Technician&${labTechnicianActive == 2 ? 'active=1' : labTechnicianActive == 3 && 'deactive=0'}`;
      // const response = await onGetAllUsersDataApi();
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.status === 200) {
        // Set data to respective states
        setLabTechniciansData(response.data.data);
        setLabTechnicianTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  const onGetRolePermissionData = async () => {
    try {
      const response = await onGetRolePermissionDataApi();
      console.log('Response Role Data', response.data);
      if (response.status === 200) {
        setRolePermission(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('users')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        pagerStyle={{backgroundColor: theme.background}}
        style={{backgroundColor: 'red'}}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      /> */}
      <View style={styles.mainView}>
        {selectedView == 'Users' ? (
          <UserList
            searchBreak={searchUser}
            setSearchBreak={setSearchUser}
            allData={userData}
            onGetData={onGetUserData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={totalPage}
            setStatusId={setUserActive}
            statusId={userActive}
            setTypeId={setUserType}
            typeId={userType}
            setUserTypeName={setUserTypeName}
            userTypeName={userTypeName}
          />
        ) : selectedView == 'Accountant' ? (
          <AccountantList
            searchBreak={searchAccountant}
            setSearchBreak={setSearchAccountant}
            allData={accountantData}
            onGetData={onGetAccountantData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={accountantTotalPage}
            setStatusId={setAccountantActive}
            statusId={accountantActive}
          />
        ) : selectedView == 'Nurses' ? (
          <NursesList
            searchBreak={searchNurse}
            setSearchBreak={setSearchNurse}
            allData={nursesData}
            onGetData={onGetNurseData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={nurseTotalPage}
            setStatusId={setNurseActive}
            statusId={nurseActive}
          />
        ) : selectedView == 'Receptionists' ? (
          <ReceptionistsList
            searchBreak={searchReceptionist}
            setSearchBreak={setSearchReceptionist}
            allData={receptionistData}
            onGetData={onGetReceptionistData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={receptionistTotalPage}
            setStatusId={setReceptionistActive}
            statusId={receptionistActive}
          />
        ) : selectedView == 'Lab Technicians' ? (
          <LabTechniciansList
            searchBreak={searchLabTechnician}
            setSearchBreak={setSearchLabTechnician}
            allData={labTechniciansData}
            onGetData={onGetLabTechniciansData}
            pageCount={pageCount}
            setPageCount={setPageCount}
            totalPage={labTechnicianTotalPage}
            setStatusId={setLabTechnicianActive}
            statusId={labTechnicianActive}
          />
        ) : (
          selectedView == 'Pharmacists' && (
            <PharmacistsList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={pharmacistsData}
              onGetData={onGetPharmacistData}
              pageCount={pageCount}
              setPageCount={setPageCount}
              totalPage={pharmacistTotalPage}
              setStatusId={setPharmacistActive}
              statusId={pharmacistActive}
            />
          )
        )}
      </View>
      <Modal
        visible={optionModalView}
        transparent={true}
        animationType="fade"
        onRequestClose={() => toggleMenu(false)}>
        {/* Background blur */}
        <BlurView
          style={styles.absolute}
          blurType="light" // You can use 'light', 'dark', or 'extraDark' for the blur effect.
          blurAmount={10}
          reducedTransparencyFallbackColor="white"
        />

        <View style={styles.mainModalView}>
          <View style={styles.menuContainer}>
            {[
              'Logo',
              'Users',
              'Accountant',
              'Nurses',
              'Receptionists',
              'Lab Technicians',
              'Pharmacists',
            ].map((option, index) => (
              <>
                {option == 'Logo' ? (
                  <Animated.View
                    key={index}
                    style={[
                      {
                        transform: [{translateY: animations[index]}],
                        opacity: opacities[index],
                        marginBottom: hp(1),
                      },
                    ]}>
                    <Image source={headerLogo} style={styles.headerLogoImage} />
                  </Animated.View>
                ) : (
                  <Animated.View
                    key={index}
                    style={[
                      styles.menuOption,
                      {
                        transform: [{translateY: animations[index]}],
                        opacity: opacities[index],
                        backgroundColor: theme.headerColor,
                      },
                    ]}>
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        setSelectedView(option);
                        setPageCount('1');
                        toggleMenu(false);
                      }}>
                      <Text style={styles.menuItem}>{option}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </>
            ))}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleMenu(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsersScreen;

//  {/* ) : selectedView == 'Role' ? (
//           <RoleList
//             searchBreak={searchAccountant}
//             setSearchBreak={setSearchAccountant}
//             allData={roleData}
//           /> */}
