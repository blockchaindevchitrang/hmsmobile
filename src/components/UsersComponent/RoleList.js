import {
  Text,
  View,
  Switch,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from './../Pixel/index';
import {COLORS, Fonts} from '../../utils';
import {useTheme} from '../../utils/ThemeProvider';
import ProfilePhoto from './../ProfilePhoto';
import moment from 'moment';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import filter from '../../images/filter.png';
import {
  onAddRoleApi,
  onDeleteCommonApi,
  onEditRoleApi,
  onGetCommonApi,
} from '../../services/Api';
import close from '../../images/close.png';
import useOrientation from '../OrientationComponent';
import {showMessage} from 'react-native-flash-message';
import {DeletePopup} from '../DeletePopup';

const permissionOption = [
  {
    id: 1,
    name: 'User',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 2,
    name: 'Appointments',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 3,
    name: 'Billings',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 4,
    name: 'Bed Management',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 5,
    name: 'Blood Bank',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 6,
    name: 'Doctors',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 7,
    name: 'Prescriptions',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 8,
    name: 'Diagnosis',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 9,
    name: 'Enquiries',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 10,
    name: 'Finance',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 11,
    name: 'Front Office',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 12,
    name: 'Hospital Charges',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 13,
    name: 'IPD/OPD',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 14,
    name: 'Live Consultations',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 15,
    name: 'Medicine',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 16,
    name: 'Patient',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 17,
    name: 'Vaccination',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 18,
    name: 'Documents',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 19,
    name: 'Inventory',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 20,
    name: 'Pathology',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 21,
    name: 'Reports',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 22,
    name: 'Radiology',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 23,
    name: 'SMS/Mail',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 24,
    name: 'Services',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 25,
    name: 'Settings',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
  {
    id: 26,
    name: 'Transaction',
    manageVisible: false,
    createVisible: false,
    editVisible: false,
    deleteVisible: false,
  },
];

const RoleList = ({searchBreak, setSearchBreak, allData, onGetData}) => {
  const {theme} = useTheme();
  const orientation = useOrientation();
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [newUserVisible, setNewUserVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [selectedOption, setSelectedOption] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [modulesList, setModulesList] = useState([]);
  const [totalLength, setTotalLength] = useState();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);

  useEffect(() => {
    onGetModules();
  }, []);

  const processModules = modules =>
    modules.map(module => ({
      main_module: module.main_module,
      privileges: module.privileges.map(privilege => ({
        ...privilege,
        actions: privilege.action
          ? privilege.action.split(',').map(action => ({
              name: action.trim(),
              isChecked: false,
            }))
          : [],
        isChecked: false,
      })),
      isChecked: false,
    }));

  const onGetModules = async () => {
    try {
      let dataUrl = 'dynamic-permissions-get';
      const response = await onGetCommonApi(dataUrl);
      if (response.data.flag == 1) {
        setModulesList(response.data.data);
        setPermissions(processModules(response.data.data));
        const totalPrivileges = response.data.data.reduce((total, module) => {
          return total + module.privileges.length;
        }, 0);
        setTotalLength(totalPrivileges);
        console.log(totalPrivileges, '--------');
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>', err);
    }
  };

  // const processModules1 = modules =>
  //   modules.map(module => ({
  //     main_module: module.main_module,
  //     privileges: module.privileges.map(privilege => ({
  //       ...privilege,
  //       title: privilege.privilege_title,
  //       end_point: privilege.privilege_end_point,
  //       actions: privilege.action_name
  //         ? privilege.action_name.split(',').map(action => ({
  //             name: action.trim(),
  //             isChecked: false,
  //           }))
  //         : [],
  //       isChecked: false,
  //     })),
  //     isChecked: false,
  //   }));

  const updatePrivilegesWithRole = (allPrivileges, rolePrivileges) => {
    // Flatten the role's privileges into a map of end_points and actions
    const rolePrivilegesMap = {};
    rolePrivileges.forEach(module => {
      module.privileges.forEach(priv => {
        rolePrivilegesMap[priv.privilege_end_point] = priv.action_name
          ? priv.action_name.split(',').map(action => action.trim())
          : []; // Store actions or an empty array
      });
    });

    // Update the allPrivileges array
    return allPrivileges.map(module => {
      module.privileges = module.privileges.map(priv => {
        const roleActions = rolePrivilegesMap[priv.end_point]; // Get actions for the endpoint
        console.log('Get Role Action:::', roleActions);
        if (roleActions !== undefined) {
          // If endpoint exists in rolePrivileges, mark it as checked
          if (priv.action.trim() === '') {
            // No actions available, mark the endpoint as checked
            priv.actions = []; // No actions, no additional checkboxes
            priv.isChecked = true; // Endpoint is checked
          } else {
            priv.actions = priv.action
              .split(',')
              .map(action => action.trim())
              .map(action => ({
                name: action,
                isChecked:
                  roleActions.length === 0 || roleActions.includes(action),
              }));
            priv.isChecked =
              priv.actions.length === 0 ||
              priv.actions.every(action => action.isChecked);
          }
        } else {
          // If endpoint doesn't exist in rolePrivileges, mark everything as unchecked
          if (priv.action.trim() === '') {
            // No actions available, mark the endpoint as checked
            priv.actions = []; // No actions, no additional checkboxes
            priv.isChecked = true; // Endpoint is checked
          } else {
            priv.actions = priv.action
              .split(',')
              .map(action => action.trim())
              .map(action => ({
                name: action,
                isChecked: false,
              }));
            priv.isChecked = false;
          }
        }

        return priv;
      });

      // Mark the main module as checked if all privileges are checked
      module.isChecked =
        module.privileges.length > 0 &&
        module.privileges.every(priv => priv.isChecked);

      return module;
    });
  };

  const onGetSpecificModules = async id => {
    try {
      let dataUrl = `role-permissions-edit/${id}`;
      const response = await onGetCommonApi(dataUrl);
      if (response.data.flag == 1) {
        // setModulesList(response.data.data);
        setPermissions(
          updatePrivilegesWithRole(permissions, response.data.data.privileges),
        );
        setUserId(id);
        setFirstName(response.data.data.role_name);
        setNewUserVisible(true);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>', err);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View style={[styles.nameDataView]}>
          <Text style={[styles.dataHistoryText2]}>{item.name}</Text>
        </View>
        <Text
          style={[
            styles.dataHistoryText,
            {width: isPortrait ? wp(40) : wp(75.1), textAlign: 'left'},
          ]}>
          {item?.permissions?.join(',  ')}
        </Text>
        <View style={styles.actionDataView}>
          <TouchableOpacity onPress={() => onGetSpecificModules(item.id)}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.blueColor}]}
              source={editing}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setUserId(item.id);
              setDeleteUser(true);
            }}
            style={{marginLeft: wp(2)}}>
            <Image
              style={[styles.editImage, {tintColor: COLORS.errorColor}]}
              source={deleteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onAddRole = async () => {
    try {
      if (firstName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter role name.');
      } else {
        setErrorVisible(false);
        setErrorMessage('');
        setLoading(true);
        const permissionsData = [];
        const actions = {};

        permissions.forEach(module => {
          module.privileges.forEach(privilege => {
            // Check if the privilege or its actions have isChecked = true
            const hasCheckedActions = privilege.actions.some(
              action => action.isChecked,
            );
            if (privilege.isChecked || hasCheckedActions) {
              permissionsData.push(privilege.end_point);

              // Only include checked actions
              const checkedActions = privilege.actions
                .filter(action => action.isChecked)
                .map(action => action.name);

              if (checkedActions.length > 0) {
                actions[privilege.end_point] = checkedActions;
              }
            }
          });
        });
        console.log('Get Request Data>>>', permissionsData, actions);
        let raw = JSON.stringify({
          name: firstName,
          permissions: permissionsData,
          actions,
        });
        const response = await onAddRoleApi(raw);
        if (response.data.flag == 1) {
          console.log('Get Add Role Response', response.data);
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
          showMessage({
            message: 'Record Added Successfully',
            type: 'success',
            duration: 3000,
          });
        } else {
          setLoading(false);
          showMessage({
            message: response.data.message,
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        }
      }
    } catch (err) {
      if (err.response.data) {
        showMessage({
          message: err.response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: 'Something want wrong.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      setLoading(false);
      console.log('Get Error:', err);
    }
  };

  const onEditRole = async () => {
    try {
      if (firstName == '') {
        setErrorVisible(true);
        setErrorMessage('Please enter role name.');
      } else {
        setErrorVisible(false);
        setErrorMessage('');
        setLoading(true);
        const permissionsData = [];
        const actions = {};

        permissions.forEach(module => {
          module.privileges.forEach(privilege => {
            // Check if the privilege or its actions have isChecked = true
            const hasCheckedActions = privilege.actions.some(
              action => action.isChecked,
            );
            if (privilege.isChecked || hasCheckedActions) {
              permissionsData.push(privilege.end_point);

              // Only include checked actions
              const checkedActions = privilege.actions
                .filter(action => action.isChecked)
                .map(action => action.name);

              if (checkedActions.length > 0) {
                actions[privilege.end_point] = checkedActions;
              }
            }
          });
        });
        console.log('Get Request Data>>>', permissionsData, actions);
        let raw = JSON.stringify({
          name: firstName,
          permissions: permissionsData,
          actions,
        });
        const response = await onEditRoleApi(raw, userId);
        if (response.data.flag == 1) {
          console.log('Get edit Role Response', response.data);
          onGetData();
          setLoading(false);
          setNewUserVisible(false);
          showMessage({
            message: 'Record Edited Successfully',
            type: 'success',
            duration: 3000,
          });
          onGetModules();
        } else {
          setLoading(false);
          showMessage({
            message: response.data.message,
            type: 'danger',
            duration: 6000,
            icon: 'danger',
          });
        }
      }
    } catch (err) {
      if (err.response.data) {
        showMessage({
          message: err.response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      } else {
        showMessage({
          message: 'Something want wrong.',
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
      setLoading(false);
      console.log('Get Error:', err);
    }
  };

  const onDeleteRecord = async () => {
    try {
      setLoading(true);
      let urlData = `role-delete/${userId}`;
      const response = await onDeleteCommonApi(urlData);
      if (response.data.flag == 1) {
        onGetData();
        setUserId('');
        setLoading(false);
        setDeleteUser(false);
        showMessage({
          message: 'Record Delete Successfully',
          type: 'success',
          duration: 3000,
        });
      } else {
        setLoading(false);
        setDeleteUser(false);
        showMessage({
          message: response.data.message,
          type: 'danger',
          duration: 6000,
          icon: 'danger',
        });
      }
    } catch (err) {
      setLoading(false);
      setDeleteUser(false);
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      console.log('Error Delete', err);
    }
  };

  const toggleMainModule = index => {
    const updatedPermissions = [...permissions];
    const mainModule = updatedPermissions[index];
    const isChecked = !mainModule.isChecked;

    mainModule.isChecked = isChecked;
    mainModule.privileges.forEach(privilege => {
      privilege.isChecked = isChecked;
      privilege.actions.forEach(action => (action.isChecked = isChecked));
    });

    setPermissions(updatedPermissions);
  };

  const toggleSubmodule = (mainIndex, subIndex) => {
    const updatedPermissions = [...permissions];
    const privilege = updatedPermissions[mainIndex].privileges[subIndex];
    const isChecked = !privilege.isChecked;

    privilege.isChecked = isChecked;
    privilege.actions.forEach(action => (action.isChecked = isChecked));

    // Update the main module state
    updatedPermissions[mainIndex].isChecked = updatedPermissions[
      mainIndex
    ].privileges.every(p => p.isChecked);

    setPermissions(updatedPermissions);
  };

  const toggleAction = (mainIndex, subIndex, actionIndex) => {
    const updatedPermissions = [...permissions];
    const action =
      updatedPermissions[mainIndex].privileges[subIndex].actions[actionIndex];
    const isChecked = !action.isChecked;

    action.isChecked = isChecked;

    // Update the submodule state
    const submodule = updatedPermissions[mainIndex].privileges[subIndex];
    submodule.isChecked = submodule.actions.every(a => a.isChecked);

    // Update the main module state
    updatedPermissions[mainIndex].isChecked = updatedPermissions[
      mainIndex
    ].privileges.every(p => p.isChecked);

    setPermissions(updatedPermissions);
  };

  return (
    <>
      <View style={styles.safeAreaStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(12)}}>
          <View style={[styles.subView, {flexWrap: 'wrap'}]}>
            <TextInput
              value={searchBreak}
              placeholder={'Search'}
              placeholderTextColor={theme.text}
              onChangeText={text => setSearchBreak(text)}
              style={[styles.searchView, {color: theme.text}]}
            />
            <View style={styles.filterView}>
              <TouchableOpacity
                onPress={() => {
                  setUserId('');
                  setFirstName('');
                  setErrorMessage('');
                  setErrorVisible(false);
                  onGetModules();
                  setNewUserVisible(true);
                }}
                style={styles.actionView}>
                <Text style={styles.actionText}>New Role</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[styles.activeView, {backgroundColor: theme.headerColor}]}>
            <ScrollView
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}>
              <View>
                <View
                  style={[
                    styles.titleActiveView,
                    {backgroundColor: theme.headerColor},
                  ]}>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(30) : wp(35)},
                    ]}>
                    {'ROLE'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: isPortrait ? wp(40) : wp(75.1)},
                    ]}>
                    {'PERMISSIONS'}
                  </Text>
                  <Text
                    style={[
                      styles.titleText,
                      {width: wp(16), textAlign: 'center'},
                    ]}>
                    {'ACTION'}
                  </Text>
                </View>
                <View style={styles.mainDataView}>
                  <FlatList
                    data={allData}
                    renderItem={renderItem}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={allData.length}
                    nestedScrollEnabled
                    virtualized
                    ListEmptyComponent={() => {
                      return (
                        <View style={styles.ListEmptyView}>
                          <Text style={styles.emptyText}>No record found</Text>
                        </View>
                      );
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={newUserVisible}
        onRequestClose={() => setNewUserVisible(false)}>
        <View style={styles.maneModalView}>
          <TouchableWithoutFeedback
            onPress={() => {
              setNewUserVisible(false);
            }}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={styles.permissionsContainer}
              showsVerticalScrollIndicator={false}>
              <View style={styles.headerView}>
                <Text style={styles.headerText}>New Role</Text>
                <TouchableOpacity onPress={() => setNewUserVisible(false)}>
                  <Image style={styles.closeImage} source={close} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.titleText1, {marginTop: hp(1.5)}]}>
                {'Name'}
              </Text>
              <TextInput
                value={firstName}
                placeholder={''}
                onChangeText={text => setFirstName(text)}
                style={[styles.eventTextInput]}
              />
              <View style={styles.permissionView}>
                <Text style={styles.noticeText}>
                  Assign General Permission to Roles
                </Text>
                {isPortrait
                  ? permissions.map((module, index) => (
                      <View key={index} style={styles.mainCheckboxModule}>
                        <TouchableOpacity
                          style={styles.checkbox}
                          onPress={() => toggleMainModule(index)}>
                          <View style={styles.checkboxMainView}>
                            {module.isChecked && (
                              <View style={styles.checkboxView} />
                            )}
                          </View>
                          <Text style={[styles.moduleText, {width: '50%'}]}>
                            {module.main_module}
                          </Text>
                        </TouchableOpacity>
                        <View style={{marginTop: hp(1.5)}} />
                        {module.privileges.map((privilege, subIndex) => (
                          <View
                            key={privilege.id}
                            style={[styles.permissionRow]}>
                            <TouchableOpacity
                              style={styles.checkbox}
                              onPress={() => toggleSubmodule(index, subIndex)}>
                              <View style={styles.checkboxMainView}>
                                {privilege.isChecked && (
                                  <View style={styles.checkboxView} />
                                )}
                              </View>
                              <Text style={styles.noticeText}>
                                {privilege.title}
                              </Text>
                            </TouchableOpacity>

                            <View
                              style={[styles.permissionRow1, {width: '52%'}]}>
                              {privilege.actions.map((action, actionIndex) => (
                                <TouchableOpacity
                                  key={action.name}
                                  style={styles.checkbox1}
                                  onPress={() =>
                                    toggleAction(index, subIndex, actionIndex)
                                  }>
                                  <View style={styles.checkboxMainView}>
                                    {action.isChecked && (
                                      <View style={styles.checkboxView} />
                                    )}
                                  </View>
                                  <Text style={styles.noticeText}>
                                    {action.name}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    ))
                  : permissions.map((module, index) => (
                      <View key={index} style={styles.mainCheckboxModule}>
                        <TouchableOpacity
                          style={styles.checkbox}
                          onPress={() => toggleMainModule(index)}>
                          <View style={styles.checkboxMainView}>
                            {module.isChecked && (
                              <View style={styles.checkboxView} />
                            )}
                          </View>
                          <Text style={styles.moduleText}>
                            {module.main_module}
                          </Text>
                        </TouchableOpacity>
                        <View style={{marginTop: hp(1.5)}} />
                        {module.privileges.map((privilege, subIndex) => (
                          <View key={privilege.id} style={styles.permissionRow}>
                            <TouchableOpacity
                              style={styles.checkbox}
                              onPress={() => toggleSubmodule(index, subIndex)}>
                              <View style={styles.checkboxMainView}>
                                {privilege.isChecked && (
                                  <View style={styles.checkboxView} />
                                )}
                              </View>
                              <Text style={styles.noticeText}>
                                {privilege.title}
                              </Text>
                            </TouchableOpacity>

                            <View
                              style={[styles.permissionRow1, {width: '60%'}]}>
                              {privilege.actions.map((action, actionIndex) => (
                                <TouchableOpacity
                                  key={action.name}
                                  style={styles.checkbox1}
                                  onPress={() =>
                                    toggleAction(index, subIndex, actionIndex)
                                  }>
                                  <View style={styles.checkboxMainView}>
                                    {action.isChecked && (
                                      <View style={styles.checkboxView} />
                                    )}
                                  </View>
                                  <Text style={styles.noticeText}>
                                    {action.name}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
              </View>
              {errorVisible ? (
                <Text style={styles.dataHistoryText4}>{errorMessage}</Text>
              ) : null}
              <View style={styles.buttonView}>
                <TouchableOpacity
                  onPress={() => {
                    userId != '' ? onEditRole() : onAddRole();
                  }}
                  style={styles.nextView}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color={COLORS.white} />
                  ) : (
                    <Text style={styles.nextText}>Save</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNewUserVisible(false)}
                  style={styles.prevView}>
                  <Text style={styles.prevText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <DeletePopup
        modelVisible={deleteUser}
        setModelVisible={setDeleteUser}
        onPress={() => onDeleteRecord()}
        setUserId={setUserId}
        isLoading={loading}
      />
    </>
  );
};

export default RoleList;

const portraitStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp(3),
    marginVertical: hp(2),
  },
  checkboxMainView: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(2),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxView: {
    width: wp(2),
    height: wp(2),
    borderRadius: 3,
    backgroundColor: COLORS.headerGreenColor,
  },
  mainCheckboxModule: {
    backgroundColor: '#d4eefe',
    padding: wp(2),
    borderRadius: 5,
    marginTop: hp(1),
  },
  searchView: {
    width: '50%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // paddingHorizontal: wp(3),
    // paddingBottom: hp(1),
  },
  filterView1: {
    height: hp(5),
    width: hp(5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
  },
  filterImage: {
    width: wp(6),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  actionView: {
    height: hp(5),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  actionText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  activeView: {
    width: '92%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(0.5),
    borderRadius: wp(3),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  titleActiveView: {
    width: '100%',
    height: hp(5),
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp(1),
    paddingBottom: hp(0.5),
  },
  titleText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
    textAlign: 'left',
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(2),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  dataHistoryText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  dataHistoryText4: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
    width: '92%',
    alignSelf: 'center',
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(30),
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  editImage: {
    width: wp(4),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  buttonView: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(2),
  },
  nextView: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  nextText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  prevView: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGreyColor,
    marginLeft: wp(2),
  },
  prevText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  closeImage: {
    width: wp(5),
    height: hp(2),
    resizeMode: 'contain',
    tintColor: COLORS.greyColor,
    marginLeft: wp(2),
  },
  ListEmptyView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(15),
  },
  emptyText: {
    fontSize: hp(2.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  container: {
    width: '94%',
    height: '94%',
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerView: {
    width: '96%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  headerText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.black,
  },
  eventTextInput: {
    width: '92%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  titleText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    marginHorizontal: wp(3),
    textAlign: 'left',
  },
  staffOption: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  buttonView1: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  staffText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.black,
  },
  permissionView: {
    paddingVertical: hp(2),
    width: '92%',
    alignSelf: 'center',
  },
  noticeText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  permissionsContainer: {
    paddingVertical: 10,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexWrap: 'wrap',
    paddingLeft: wp(2),
  },
  permissionRow1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    // paddingHorizontal: wp(3),
  },
  moduleText: {
    width: '30%',
    fontSize: hp(2.2),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.black,
  },
  permissionCheckboxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: hp(1),
  },
  checkbox1: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: wp(2),
    paddingLeft: wp(3),
    paddingBottom: hp(2),
  },
  checkboxText: {
    fontSize: hp(1.7),
    marginLeft: 10,
  },
});

const landscapeStyles = StyleSheet.create({
  safeAreaStyle: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  subView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp(3),
    marginVertical: hp(2),
  },
  checkboxMainView: {
    width: wp(3),
    height: wp(3),
    marginRight: wp(2),
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxView: {
    width: wp(2),
    height: wp(2),
    borderRadius: 3,
    backgroundColor: COLORS.headerGreenColor,
  },
  mainCheckboxModule: {
    backgroundColor: '#d4eefe',
    padding: wp(2),
    borderRadius: 5,
    marginTop: hp(1),
  },
  searchView: {
    width: '50%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
  },
  filterView: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-end',
    // paddingHorizontal: wp(3),
    // paddingBottom: hp(1),
  },
  filterView1: {
    height: hp(5),
    width: hp(5),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
  },
  filterImage: {
    width: wp(6),
    height: hp(3),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  actionView: {
    height: hp(4),
    paddingHorizontal: wp(3),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  actionText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.white,
  },
  activeView: {
    width: '96%',
    minHeight: hp(35),
    maxHeight: hp(80),
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    marginTop: hp(0.5),
    borderRadius: wp(1),
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  titleActiveView: {
    width: '100%',
    height: hp(5),
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp(1),
    paddingBottom: hp(0.5),
  },
  titleText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.white,
    marginHorizontal: wp(2),
    textAlign: 'left',
  },
  dataHistoryView: {
    width: '100%',
    paddingVertical: hp(1),
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  dataHistoryText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
    marginHorizontal: wp(2),
    textAlign: 'center',
  },
  dataHistoryText2: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsBold,
    color: COLORS.blueColor,
  },
  dataHistoryText4: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.errorColor,
    width: '96%',
    alignSelf: 'center',
  },
  mainDataView: {
    minHeight: hp(29),
    maxHeight: hp(74),
    width: '100%',
    backgroundColor: COLORS.white,
    paddingBottom: hp(1),
    borderBottomLeftRadius: wp(1),
    borderBottomRightRadius: wp(1),
  },
  nameDataView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(35),
    marginHorizontal: wp(2),
  },
  actionDataView: {
    width: wp(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    flexDirection: 'row',
  },
  editImage: {
    width: wp(3),
    height: hp(2.5),
    resizeMode: 'contain',
  },
  buttonView: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: hp(3),
  },
  nextView: {
    height: hp(4),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.blueColor,
    marginLeft: wp(2),
  },
  nextText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2),
    color: COLORS.white,
  },
  prevView: {
    height: hp(4),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightGreyColor,
    marginLeft: wp(2),
  },
  prevText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2),
    color: COLORS.white,
  },
  closeImage: {
    width: wp(5),
    height: hp(2),
    resizeMode: 'contain',
    tintColor: COLORS.greyColor,
    marginLeft: wp(2),
  },
  ListEmptyView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(15),
  },
  emptyText: {
    fontSize: hp(2.5),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  container: {
    width: '94%',
    height: '94%',
    paddingVertical: hp(2),
    backgroundColor: COLORS.white,
    borderRadius: 10,
    // marginLeft: -wp(2.5),
    // paddingTop: hp(3),
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  maneModalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerView: {
    width: '96%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  headerText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.black,
  },
  eventTextInput: {
    width: '96%',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: COLORS.greyColor,
    fontFamily: Fonts.FONTS.PoppinsMedium,
    fontSize: hp(2),
    color: COLORS.black,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: hp(3),
    marginTop: hp(1),
  },
  titleText1: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsSemiBold,
    color: COLORS.black,
    marginHorizontal: wp(3),
    textAlign: 'left',
  },
  staffOption: {
    height: hp(4.5),
    paddingHorizontal: wp(4),
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  buttonView1: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  staffText: {
    fontFamily: Fonts.FONTS.PoppinsBold,
    fontSize: hp(2.2),
    color: COLORS.black,
  },
  permissionView: {
    width: '96%',
    alignSelf: 'center',
  },
  noticeText: {
    fontSize: hp(1.8),
    fontFamily: Fonts.FONTS.PoppinsMedium,
    color: COLORS.black,
  },
  permissionsContainer: {
    paddingVertical: 10,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexWrap: 'wrap',
    paddingHorizontal: wp(3),
  },
  permissionRow1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingHorizontal: wp(3),
  },
  moduleText: {
    width: '35%',
    fontSize: hp(2),
    fontFamily: Fonts.FONTS.PoppinsBold,
  },
  permissionCheckboxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  checkbox1: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: wp(2),
    paddingHorizontal: hp(1),
    paddingBottom: hp(2),
  },
  checkboxText: {
    fontSize: hp(1.7),
    marginLeft: 10,
  },
});

{
  /*
  <Modal
animationType="fade"
transparent={true}
visible={newUserVisible}
onRequestClose={() => setNewUserVisible(false)}>
<View style={styles.maneModalView}>
  <TouchableWithoutFeedback
    onPress={() => {
      setNewUserVisible(false);
    }}>
    <View style={styles.modalOverlay} />
  </TouchableWithoutFeedback>
  <View style={styles.container}>
    <ScrollView
      contentContainerStyle={styles.permissionsContainer}
      showsVerticalScrollIndicator={false}>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>New Role</Text>
        <TouchableOpacity onPress={() => setNewUserVisible(false)}>
          <Image style={styles.closeImage} source={close} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.titleText1, {marginTop: hp(1.5)}]}>
        {'Name'}
      </Text>
      <TextInput
        value={firstName}
        placeholder={''}
        onChangeText={text => setFirstName(text)}
        style={[styles.eventTextInput]}
      />
      <View style={styles.buttonView1}>
        <TouchableOpacity
          onPress={() => setSelectedOption(true)}
          style={[
            styles.staffOption,
            {
              backgroundColor: !selectedOption
                ? COLORS.white
                : theme.lightGreen,
            },
          ]}>
          <Text
            style={[
              styles.staffText,
              {color: selectedOption ? COLORS.white : theme.lightGreen},
            ]}>
            Staff
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedOption(false)}
          style={[
            styles.staffOption,
            {
              backgroundColor: selectedOption
                ? COLORS.white
                : theme.lightGreen,
            },
          ]}>
          <Text
            style={[
              styles.staffText,
              {
                color: !selectedOption
                  ? COLORS.white
                  : theme.lightGreen,
              },
            ]}>
            HRM
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.permissionView}>
        <Text style={styles.noticeText}>
          Assign General Permission to Roles
        </Text>
        {isPortrait ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingRight: wp(15)}}>
            <View>
              {modulesList.map((module, index) => (
                <View key={index} style={styles.permissionRow}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => {
                      setRefresh(!refresh);
                    }}>
                    <View style={styles.checkboxMainView}>
                      <View style={styles.checkboxView} />
                    </View>
                    <Text style={styles.moduleText}>
                      {module.main_module}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.permissionCheckboxes}>
                    {['Manage', 'Create', 'Edit', 'Delete'].map(
                      (action, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.checkbox}
                          onPress={() => {
                            if (action == 'Manage') {
                              permissionOption[index].manageVisible =
                                !module.manageVisible;
                            }
                            if (action == 'Create') {
                              permissionOption[index].createVisible =
                                !module.createVisible;
                            }
                            if (action == 'Edit') {
                              permissionOption[index].editVisible =
                                !module.editVisible;
                            }
                            if (action == 'Delete') {
                              permissionOption[index].deleteVisible =
                                !module.deleteVisible;
                            }
                            setRefresh(!refresh);
                          }}>
                          <View style={styles.checkboxMainView}>
                            {action == 'Manage' &&
                            module.manageVisible ? (
                              <View style={styles.checkboxView} />
                            ) : null}
                            {action == 'Create' &&
                            module.createVisible ? (
                              <View style={styles.checkboxView} />
                            ) : null}
                            {action == 'Edit' && module.editVisible ? (
                              <View style={styles.checkboxView} />
                            ) : null}
                            {action == 'Delete' &&
                            module.deleteVisible ? (
                              <View style={styles.checkboxView} />
                            ) : null}
                          </View>
                          <Text style={styles.checkboxText}>
                            {action}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          modulesList.map((module, index) => (
            <View key={index} style={styles.permissionRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => {
                  setRefresh(!refresh);
                }}>
                <View style={styles.checkboxMainView}>
                  <View style={styles.checkboxView} />
                </View>
                <Text style={styles.moduleText}>
                  {module.main_module}
                </Text>
              </TouchableOpacity>
              <View style={styles.permissionCheckboxes}>
                {['Manage', 'Create', 'Edit', 'Delete'].map(
                  (action, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.checkbox}
                      onPress={() => {
                        if (action == 'Manage') {
                          permissionOption[index].manageVisible =
                            !module.manageVisible;
                        }
                        if (action == 'Create') {
                          permissionOption[index].createVisible =
                            !module.createVisible;
                        }
                        if (action == 'Edit') {
                          permissionOption[index].editVisible =
                            !module.editVisible;
                        }
                        if (action == 'Delete') {
                          permissionOption[index].deleteVisible =
                            !module.deleteVisible;
                        }
                        setRefresh(!refresh);
                      }}>
                      <View style={styles.checkboxMainView}>
                        {action == 'Manage' && module.manageVisible ? (
                          <View style={styles.checkboxView} />
                        ) : null}
                        {action == 'Create' && module.createVisible ? (
                          <View style={styles.checkboxView} />
                        ) : null}
                        {action == 'Edit' && module.editVisible ? (
                          <View style={styles.checkboxView} />
                        ) : null}
                        {action == 'Delete' && module.deleteVisible ? (
                          <View style={styles.checkboxView} />
                        ) : null}
                      </View>
                      <Text style={styles.checkboxText}>{action}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </View>
            </View>
          ))
        )}
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => onAddRole()}
          style={styles.nextView}>
          <Text style={styles.nextText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setNewUserVisible(false)}
          style={styles.prevView}>
          <Text style={styles.prevText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
</View>
</Modal> */
}
