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
import {landscapeStyles, portraitStyles} from './styles';
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
import useOrientation from '../../components/OrientationComponent';

let arrayData = [
  'Logo',
  'Users',
  'Role',
  'Accountant',
  'Nurses',
  'Receptionists',
  'Lab Technicians',
  'Pharmacists',
];

export const UsersScreen = ({navigation}) => {
  const roleData = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchUser, setSearchUser] = useState('');
  const [searchAccountant, setSearchAccountant] = useState('');
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
  const [refresh, setRefresh] = useState(false);
  const [userAction, setUserAction] = useState([]);
  const [roleAction, setRoleAction] = useState([]);
  const [accountantAction, setAccountantAction] = useState([]);
  const [nurseAction, setNurseAction] = useState([]);
  const [receptionAction, setReceptionAction] = useState([]);
  const [labAction, setLabAction] = useState([]);
  const [pharmacistAction, setPharmacistAction] = useState([]);

  useEffect(() => {
    // let dataArray = [];
    // let userVisible = false;
    // let roleVisible = false;
    // let accountantVisible = false;
    // let nurseVisible = false;
    // let receptionistVisible = false;
    // let labVisible = false;
    // let pharmacistVisible = false;
    // rolePermission.map(item => {
    //   if (item.main_module == 'Users') {
    //     item.privileges.map(item1 => {
    //       if (item1.end_point == 'view_users') {
    //         setUserAction(item1.action.split(',').map(action => action.trim()));
    //         userVisible = true;
    //       } else if (item1.end_point == 'accountants') {
    //         setAccountantAction(
    //           item1.action.split(',').map(action => action.trim()),
    //         );
    //         accountantVisible = true;
    //       } else if (item1.end_point == 'nurses') {
    //         setNurseAction(
    //           item1.action.split(',').map(action => action.trim()),
    //         );
    //         nurseVisible = true;
    //       } else if (item1.end_point == 'receptionist') {
    //         setReceptionAction(
    //           item1.action.split(',').map(action => action.trim()),
    //         );
    //         receptionistVisible = true;
    //       } else if (item1.end_point == 'lab-technicians') {
    //         setLabAction(item1.action.split(',').map(action => action.trim()));
    //         labVisible = true;
    //       } else if (item1.end_point == 'phamacists') {
    //         setPharmacistAction(
    //           item1.action.split(',').map(action => action.trim()),
    //         );
    //         pharmacistVisible = true;
    //       } else if (item1.end_point == 'role') {
    //         setRoleAction(item1.action.split(',').map(action => action.trim()));
    //         roleVisible = true;
    //       }
    //     });
    //     if (!userVisible && !roleVisible && !accountantVisible && !nurseVisible && !receptionistVisible && !labVisible) {
    //       arrayData = [
    //         'Logo',
    //         'Users',
    //         'Role',
    //         'Accountant',
    //         'Nurses',
    //         'Receptionists',
    //         'Lab Technicians',
    //       ];
    //     } else if (!userVisible && !roleVisible && !accountantVisible && !nurseVisible && !receptionistVisible && !pharmacistVisible) {
    //       arrayData = [
    //         'Logo',
    //         'Users',
    //         'Role',
    //         'Accountant',
    //         'Nurses',
    //         'Receptionists',
    //         'Pharmacists',
    //       ];
    //     }
    //   }
    // });
    const visibility = {
      userVisible: false,
      roleVisible: false,
      accountantVisible: false,
      nurseVisible: false,
      receptionistVisible: false,
      labVisible: false,
      pharmacistVisible: false,
    };

    // Helper function to process privileges
    const processPrivileges = (
      privileges,
      endPoint,
      setAction,
      visibilityKey,
    ) => {
      const privilege = privileges.find(item => item.end_point === endPoint);
      if (privilege) {
        setAction(privilege.action.split(',').map(action => action.trim()));
        visibility[visibilityKey] = true;
      }
    };

    // Iterate over role permissions
    roleData.forEach(item => {
      if (item.main_module === 'Users') {
        processPrivileges(
          item.privileges,
          'view_users',
          setUserAction,
          'userVisible',
        );
        processPrivileges(
          item.privileges,
          'accountants',
          setAccountantAction,
          'accountantVisible',
        );
        processPrivileges(
          item.privileges,
          'nurses',
          setNurseAction,
          'nurseVisible',
        );
        processPrivileges(
          item.privileges,
          'receptionist',
          setReceptionAction,
          'receptionistVisible',
        );
        processPrivileges(
          item.privileges,
          'lab-technicians',
          setLabAction,
          'labVisible',
        );
        processPrivileges(
          item.privileges,
          'phamacists',
          setPharmacistAction,
          'pharmacistVisible',
        );
        processPrivileges(
          item.privileges,
          'role',
          setRoleAction,
          'roleVisible',
        );
      }
    });

    // Handle arrayData based on visibility
    const {
      userVisible,
      roleVisible,
      accountantVisible,
      nurseVisible,
      receptionistVisible,
      labVisible,
      pharmacistVisible,
    } = visibility;

    arrayData = [
      'Logo',
      userVisible && 'Users',
      roleVisible && 'Role',
      accountantVisible && 'Accountant',
      nurseVisible && 'Nurses',
      receptionistVisible && 'Receptionists',
      labVisible && 'Lab Technicians',
      pharmacistVisible && 'Pharmacists',
    ].filter(Boolean);
  }, [roleData]);

  useEffect(() => {
    onGetUserData();
  }, [searchUser, pageCount, userTypeName, userActive]);

  useEffect(() => {
    onGetRolePermissionData();
  }, []);

  const animations = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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
      const roleData = await onGetRoleDataApi();
      console.log('Get roleData Response::', roleData.data.data);
      if (roleData.data.data) {
        setRolePermission(roleData.data.data);
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
            userAction={userAction}
          />
        ) : selectedView == 'Role' ? (
          <RoleList
            searchBreak={searchAccountant}
            setSearchBreak={setSearchAccountant}
            allData={rolePermission}
            onGetData={onGetRolePermissionData}
            roleAction={roleAction}
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
            accountantAction={accountantAction}
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
            nurseAction={nurseAction}
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
            receptionAction={receptionAction}
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
            labAction={labAction}
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
              pharmacistAction={pharmacistAction}
            />
          )
        )}
      </View>
      <Modal
        visible={optionModalView}
        transparent={true}
        animationType="fade"
        onRequestClose={() => toggleMenu(false)}>
        <TouchableWithoutFeedback onPress={() => toggleMenu(false)}>
          <View style={{flex: 1}}>
            <BlurView
              style={styles.absolute}
              blurType="light" // You can use 'light', 'dark', or 'extraDark' for the blur effect.
              blurAmount={10}
              reducedTransparencyFallbackColor="white"
            />

            <View style={styles.mainModalView}>
              <View style={styles.menuContainer}>
                {arrayData.map((option, index) => (
                  <>
                    {option == 'Logo' ? (
                      <Animated.View
                        key={index}
                        style={[
                          styles.logoMenu,
                          {
                            transform: [{translateY: animations[index]}],
                            opacity: opacities[index],
                            marginBottom: hp(1),
                          },
                        ]}>
                        <Image
                          source={headerLogo}
                          style={styles.headerLogoImage}
                        />
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

                <View style={styles.logoMenu}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => toggleMenu(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
