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
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../utils/ThemeProvider';
import {landscapeStyles, portraitStyles} from './styles';
import Header from '../../components/Header';
import {COLORS, Fonts} from '../../utils';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../components/Pixel';
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import close from '../../images/close.png';
import {
  onAddAccountListApi,
  onAddCommonJsonApi,
  onDeleteCommonApi,
  onGetCommonApi,
  onGetEditCommonJsonApi,
  onGetSpecificCommonApi,
} from '../../services/Api';
import SelectDropdown from 'react-native-select-dropdown';
import DatePicker from 'react-native-date-picker';
import {DeletePopup} from '../../components/DeletePopup';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import deleteIcon from '../../images/delete.png';
import editing from '../../images/editing.png';
import view from '../../images/view.png';
import printing from '../../images/printing.png';
import ProfilePhoto from '../../components/ProfilePhoto';
import moment from 'moment';
import {useSelector} from 'react-redux';
import useOrientation from '../../components/OrientationComponent';

const durationArray = [
  {id: 1, name: 'One day only'},
  {id: 2, name: 'For three only'},
  {id: 3, name: 'For one week'},
  {id: 4, name: 'For 2 week'},
  {id: 5, name: 'For 1 month'},
];

const timeArray = [
  {id: 1, name: 'After Meal'},
  {id: 2, name: 'Before Meal'},
];

const doseArray = [
  {id: 1, name: 'Every Morning'},
  {id: 2, name: 'Every Morning & Evening'},
  {id: 3, name: 'Three times a day'},
  {id: 4, name: '4 times a day'},
];

const daysArray = [
  {id: 1, name: 'Days'},
  {id: 2, name: 'Month'},
  {id: 3, name: 'Years'},
];

export const PrescriptionScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const user_data = useSelector(state => state.user_data);
  const doctorData = useSelector(state => state.doctorData);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const menuRef = useRef(null);
  const [searchAccount, setSearchAccount] = useState('');
  const [newBloodIssueVisible, setNewBloodIssueVisible] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [insurance, setInsurance] = useState('');
  const [lowIncome, setLowIncome] = useState('');
  const [reference, setReference] = useState('');
  const [medicineArray, setMedicineArray] = useState([]);
  const [parameterArray, setParameterArray] = useState([
    {
      medicineId: '',
      medicineName: '',
      dosage: '',
      durationId: '',
      duration: '',
      timeId: '',
      time: '',
      doseId: '',
      doseInterval: '',
      comment: '',
    },
  ]);
  const [bloodPressure, setBloodPressure] = useState('');
  const [allergies, setAllergies] = useState('');
  const [tendencyBleed, setTendencyBleed] = useState('');
  const [heartDisease, setHeartDisease] = useState('');
  const [diabetic, setDiabetic] = useState('');
  const [addedAt, setAddedAt] = useState(null);
  const [addDateModal, setAddDateModal] = useState(false);
  const [pregnancy, setPregnancy] = useState('');
  const [breastFeeding, setBreastFeeding] = useState('');
  const [medication, setMedication] = useState('');
  const [surgery, setSurgery] = useState('');
  const [accident, setAccident] = useState('');
  const [others, setOthers] = useState('');
  const [pulseRate, setPulseRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [description, setDescription] = useState('');
  const [test, setTest] = useState('');
  const [advice, setAdvice] = useState('');
  const [nextVisit, setNextVisit] = useState('');
  const [nextVisitId, setNextVisitId] = useState('');
  const [nextVisitName, setNextVisitName] = useState('');
  const [status, setStatus] = useState(false);
  const [prescription, setPrescription] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUser, setDeleteUser] = useState(false);
  const [prescriptionAction, setPrescriptionAction] = useState([]);

  useEffect(() => {
    // Helper function to process privileges
    const processPrivileges = (privileges, endPoint, setAction) => {
      const privilege = privileges.find(item => item.end_point === endPoint);
      if (privilege) {
        setAction(privilege.action.split(',').map(action => action.trim()));
      }
    };

    // Iterate over role permissions
    rolePermission.forEach(item => {
      if (item.main_module === 'Enquiries') {
        processPrivileges(item.privileges, 'enquiries', setPrescriptionAction);
      }
    });
  }, [rolePermission]);

  useEffect(() => {
    onGetMedicineCategoryData();
  }, [searchAccount]);

  const onGetMedicineCategoryData = async () => {
    try {
      const response = await onGetCommonApi(
        `prescription-get?search=${searchAccount}`,
      );
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setPrescription(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetMedicineData();
  }, []);

  const onGetMedicineData = async () => {
    try {
      const response = await onGetCommonApi('medicine-get');
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicineArray(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  const onAddPayRollData = async () => {
    try {
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let medicineId = [];
        let dosage = [];
        let day = [];
        let time = [];
        let doseInterval = [];
        let comment = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (!item.medicineId || !item.dosage) {
            hasEmptyFields = true;
          } else {
            medicineId.push(item.medicineId);
            dosage.push(item.dosage);
            day.push(item.durationId);
            time.push(item.timeId);
            doseInterval.push(item.doseId);
            if (item.comment != '') {
              comment.push(item.comment);
            }
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage('Please fill in all medicine details.');
          showMessage({
            message: 'Please fill in all medicine details.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }
        let raw = JSON.stringify({
          patient_id: patientId,
          doctor_id: doctorId,
          health_insurance: insurance,
          low_income: lowIncome,
          reference: reference,
          food_allergies: allergies,
          tendency_bleed: tendencyBleed,
          heart_disease: heartDisease,
          high_blood_pressure: bloodPressure,
          diabetic: diabetic,
          surgery: surgery,
          accident: accident,
          others: others,
          current_medication: medication,
          female_pregnancy: pregnancy,
          breast_feeding: breastFeeding,
          temperature: temperature,
          plus_rate: pulseRate,
          problem_description: description,
          test: test,
          advice: advice,
          next_visit_qty: nextVisit,
          next_visit_time: nextVisitName,
          status: status ? 1 : 0,
          medicine: medicineId,
          dosage: dosage,
          day: day,
          time: time,
          dose_interval: doseInterval,
          comment: comment,
        });
        const urlData = 'prescription-store';
        const response = await onAddCommonJsonApi(urlData, raw);
        if (response.data.flag == 1) {
          onGetMedicineCategoryData();
          setLoading(false);
          setNewBloodIssueVisible(false);
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
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      setLoading(false);
      console.log('Error:', err);
    }
  };

  const onEditPayRollData = async () => {
    try {
      if (patientId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select patient.');
      } else if (doctorId == '') {
        setErrorVisible(true);
        setErrorMessage('Please select doctor.');
      } else {
        setLoading(true);
        setErrorVisible(false);
        let medicineId = [];
        let dosage = [];
        let day = [];
        let time = [];
        let doseInterval = [];
        let comment = [];
        let hasEmptyFields = false;
        parameterArray.map(item => {
          if (!item.medicineId || !item.dosage) {
            hasEmptyFields = true;
          } else {
            medicineId.push(item.medicineId);
            dosage.push(item.dosage);
            day.push(item.durationId);
            time.push(item.timeId);
            doseInterval.push(item.doseId);
            if (item.comment != '') {
              comment.push(item.comment);
            }
          }
        });

        if (hasEmptyFields) {
          setErrorVisible(true);
          setErrorMessage('Please fill in all medicine details.');
          showMessage({
            message: 'Please fill in all medicine details.',
            type: 'danger',
            duration: 3000,
          });
          return; // Exit the function without calling the API
        }
        let raw = JSON.stringify({
          patient_id: patientId,
          doctor_id: doctorId,
          health_insurance: insurance,
          low_income: lowIncome,
          reference: reference,
          food_allergies: allergies,
          tendency_bleed: tendencyBleed,
          heart_disease: heartDisease,
          high_blood_pressure: bloodPressure,
          diabetic: diabetic,
          surgery: surgery,
          accident: accident,
          others: others,
          current_medication: medication,
          female_pregnancy: pregnancy,
          breast_feeding: breastFeeding,
          temperature: temperature,
          plus_rate: pulseRate,
          problem_description: description,
          test: test,
          advice: advice,
          next_visit_qty: nextVisit,
          next_visit_time: nextVisitName,
          status: status ? 1 : 0,
          medicine: medicineId,
          dosage: dosage,
          day: day,
          time: time,
          dose_interval: doseInterval,
          comment: comment,
        });
        const urlData = `prescription-update/${userId}`;
        const response = await onGetEditCommonJsonApi(urlData, raw);
        if (response.data.flag == 1) {
          onGetMedicineCategoryData();
          setLoading(false);
          setNewBloodIssueVisible(false);
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
      showMessage({
        message: 'Something want wrong.',
        type: 'danger',
        duration: 6000,
        icon: 'danger',
      });
      setLoading(false);
      console.log('Error:', err.response.data);
    }
  };

  const onDeletePayrollData = async id => {
    try {
      setLoading(true);
      const response = await onDeleteCommonApi(`prescription-delete/${id}`);
      if (response.data.flag == 1) {
        onGetMedicineCategoryData();
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
      if (err.response.data.message) {
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
      console.log('Get Error', err);
    }
  };

  const onGetSpecificDoctor = async id => {
    try {
      const response = await onGetSpecificCommonApi(`prescription-show/${id}`);
      if (response.status == 200) {
        console.log('get ValueLL:::', response.data.data);
        return response.data.data;
      } else {
        return 0;
      }
    } catch (err) {
      console.log('Get Error', err);
    }
  };

  const onChangeStatusData = async (status, index, id) => {
    try {
      let arrayData = prescription;
      arrayData[index].status = status;

      setPrescription(arrayData);
      setRefresh(!refresh);

      const response = await onAddAccountListApi(`prescription/${id}/status`);
      console.log('get ValueLL:::', response.data);
      if (response.data.flag == 1) {
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.dataHistoryView,
          {backgroundColor: index % 2 == 0 ? '#eeeeee' : COLORS.white},
        ]}>
        <View
          style={[
            styles.nameDataView,
            {
              width: isPortrait
                ? wp(55)
                : prescriptionAction.includes('view') ||
                  prescriptionAction.includes('print') ||
                  prescriptionAction.includes('edit') ||
                  prescriptionAction.includes('delete')
                ? wp(37)
                : wp(55),
            },
          ]}>
          {item.patient_name && (
            <ProfilePhoto
              style={styles.photoStyle}
              username={item.patient_name}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.patient_name}</Text>
            <Text
              style={[
                styles.dataHistoryText5,
                {
                  width: isPortrait
                    ? wp(45)
                    : prescriptionAction.includes('view') ||
                      prescriptionAction.includes('print') ||
                      prescriptionAction.includes('edit') ||
                      prescriptionAction.includes('delete')
                    ? wp(33)
                    : wp(45),
                },
              ]}>
              {item.patient_email}
            </Text>
          </View>
        </View>
        <View style={styles.nameDataView}>
          {item.doctor_name && (
            <ProfilePhoto
              style={styles.photoStyle}
              username={item.doctor_name}
            />
          )}
          <View>
            <Text style={[styles.dataHistoryText2]}>{item.doctor_name}</Text>
            <Text style={[styles.dataHistoryText5]}>{item.doctor_email}</Text>
          </View>
        </View>
        <View
          style={[
            styles.switchView,
            {
              width: isPortrait
                ? wp(35)
                : prescriptionAction.includes('status')
                ? wp(24)
                : wp(40),
            },
          ]}>
          <View style={[styles.dateBox1, {backgroundColor: theme.lightColor}]}>
            <Text style={[styles.dataHistoryText1]}>
              {moment(item.added_at).format('DD MMM, YYYY')}
            </Text>
          </View>
        </View>
        {prescriptionAction.includes('status') && (
          <View
            style={[styles.switchView, {width: isPortrait ? wp(16) : wp(12)}]}>
            <Switch
              trackColor={{
                false: item.status ? COLORS.greenColor : COLORS.errorColor,
                true: item.status ? COLORS.greenColor : COLORS.errorColor,
              }}
              thumbColor={item.status ? '#f4f3f4' : '#f4f3f4'}
              ios_backgroundColor={COLORS.errorColor}
              onValueChange={status =>
                onChangeStatusData(status, index, item.id)
              }
              value={item.status}
            />
          </View>
        )}
        {prescriptionAction.includes('view') ||
        prescriptionAction.includes('print') ||
        prescriptionAction.includes('edit') ||
        prescriptionAction.includes('delete') ? (
          <View style={styles.actionDataView}>
            {prescriptionAction.includes('view') && (
              <TouchableOpacity>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.greenColor}]}
                  source={view}
                />
              </TouchableOpacity>
            )}
            {prescriptionAction.includes('edit') && (
              <TouchableOpacity
                onPress={async () => {
                  let allDatas = await onGetSpecificDoctor(item.id);
                  setUserId(item.id);
                  setPatientId(allDatas.patient_id);
                  setPatientName(item.patient_name);
                  setDoctorId(allDatas.doctor_id);
                  setDoctorName(item.doctor_name);
                  setAddedAt(new Date(item.added_at));
                  setStatus(item.status);
                  setAllergies(allDatas.food_allergies);
                  setTendencyBleed(allDatas.tendency_bleed);
                  setHeartDisease(allDatas.heart_disease);
                  setBloodPressure(allDatas.high_blood_pressure);
                  setDiabetic(allDatas.diabetic);
                  setSurgery(allDatas.surgery);
                  setAccident(allDatas.accident);
                  setOthers(allDatas.others);
                  setMedication(allDatas.current_medication);
                  setPregnancy(allDatas.female_pregnancy);
                  setBreastFeeding(allDatas.breast_feeding);
                  setInsurance(allDatas.health_insurance);
                  setLowIncome(allDatas.low_income);
                  setReference(allDatas.reference);
                  setPulseRate(allDatas.plus_rate);
                  setTemperature(allDatas.temperature);
                  setDescription(allDatas.problem_description);
                  setTest(allDatas.test);
                  setAdvice(allDatas.advice);
                  setNextVisit(allDatas.next_visit_qty);
                  setNextVisitName(allDatas.next_visit_time);
                  setNewBloodIssueVisible(true);
                }}
                style={{marginLeft: isPortrait ? wp(2) : wp(1)}}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.blueColor}]}
                  source={editing}
                />
              </TouchableOpacity>
            )}
            {prescriptionAction.includes('print') && (
              <TouchableOpacity
                style={{marginLeft: isPortrait ? wp(2) : wp(1)}}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.goldenColor}]}
                  source={printing}
                />
              </TouchableOpacity>
            )}
            {prescriptionAction.includes('delete') && (
              <TouchableOpacity
                onPress={() => {
                  setUserId(item.id);
                  setDeleteUser(true);
                }}
                style={{marginLeft: isPortrait ? wp(2) : wp(1)}}>
                <Image
                  style={[styles.editImage, {tintColor: COLORS.errorColor}]}
                  source={deleteIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('prescription')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreIcon={true}
        />
      </View>
      <View style={styles.mainView}>
        {!newBloodIssueVisible ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <View style={styles.subView}>
              <TextInput
                value={searchAccount}
                placeholder={'Search'}
                placeholderTextColor={theme.text}
                onChangeText={text => setSearchAccount(text)}
                style={[styles.searchView, {color: theme.text}]}
              />
              <View style={styles.filterView}>
                {prescriptionAction.includes('create') && (
                  <TouchableOpacity
                    onPress={() => {
                      setUserId('');
                      setParameterArray([
                        {
                          medicineId: '',
                          medicineName: '',
                          dosage: '',
                          durationId: '',
                          duration: '',
                          timeId: '',
                          time: '',
                          doseId: '',
                          doseInterval: '',
                          comment: '',
                        },
                      ]);
                      setPatientId('');
                      setPatientName('');
                      setDoctorId('');
                      setDoctorName('');
                      setAddedAt(new Date());
                      setStatus(true);
                      setAllergies('');
                      setTendencyBleed('');
                      setHeartDisease('');
                      setBloodPressure('');
                      setDiabetic('');
                      setSurgery('');
                      setAccident('');
                      setOthers('');
                      setMedication('');
                      setPregnancy('');
                      setBreastFeeding('');
                      setInsurance('');
                      setLowIncome('');
                      setReference('');
                      setPulseRate('');
                      setTemperature('');
                      setDescription('');
                      setTest('');
                      setAdvice('');
                      setNextVisit('');
                      setNextVisitName('');
                      setErrorMessage('');
                      setErrorVisible(false);
                      setNewBloodIssueVisible(true);
                    }}
                    style={styles.actionView}>
                    <Text style={styles.actionText}>New Perception</Text>
                  </TouchableOpacity>
                )}
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
                        {
                          width: isPortrait
                            ? wp(55)
                            : prescriptionAction.includes('view') ||
                              prescriptionAction.includes('print') ||
                              prescriptionAction.includes('edit') ||
                              prescriptionAction.includes('delete')
                            ? wp(37)
                            : wp(55),
                          textAlign: 'left',
                        },
                      ]}>
                      {'PATIENT'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {
                          width: isPortrait ? wp(55) : wp(37),
                          textAlign: 'left',
                        },
                      ]}>
                      {'DOCTORS'}
                    </Text>
                    <Text
                      style={[
                        styles.titleText,
                        {
                          width: isPortrait
                            ? wp(35)
                            : prescriptionAction.includes('status')
                            ? wp(24)
                            : wp(40),
                        },
                      ]}>
                      {'ADDED AT'}
                    </Text>
                    {prescriptionAction.includes('status') && (
                      <Text
                        style={[
                          styles.titleText,
                          {width: isPortrait ? wp(16) : wp(12)},
                        ]}>
                        {'STATUS'}
                      </Text>
                    )}
                    {prescriptionAction.includes('view') ||
                    prescriptionAction.includes('print') ||
                    prescriptionAction.includes('edit') ||
                    prescriptionAction.includes('delete') ? (
                      <Text
                        style={[
                          styles.titleText,
                          {width: isPortrait ? wp(24) : wp(20)},
                        ]}>
                        {'ACTION'}
                      </Text>
                    ) : null}
                  </View>
                  <View style={styles.mainDataView}>
                    <FlatList
                      data={prescription}
                      renderItem={renderItem}
                      bounces={false}
                      showsHorizontalScrollIndicator={false}
                      initialNumToRender={prescription.length}
                      nestedScrollEnabled
                      virtualized
                      ListEmptyComponent={() => (
                        <View key={0} style={styles.ListEmptyView}>
                          <Text style={styles.emptyText}>
                            {'No record found'}
                          </Text>
                        </View>
                      )}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: hp(12)}}>
            <View style={styles.subView}>
              <Text style={[styles.doctorText, {color: theme.text}]}>
                New Prescription
              </Text>
              <View style={styles.filterView}>
                <TouchableOpacity
                  onPress={() => setNewBloodIssueVisible(false)}
                  style={styles.backButtonView}>
                  <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>
              </View>
            </View>
            {isPortrait ? (
              <View style={styles.profileView}>
                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Patient:</Text>
                    <SelectDropdown
                      data={user_data}
                      onSelect={(selectedItem, index) => {
                        // setSelectedColor(selectedItem);
                        setPatientId(selectedItem.id);
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValue={patientName}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View style={styles.dropdown2BtnStyle2}>
                            {patientId != '' ? (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {patientId == selectedItem?.id
                                  ? `${selectedItem?.patient_user?.first_name} ${selectedItem?.patient_user?.last_name}`
                                  : patientName}
                              </Text>
                            ) : (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {selectedItem?.patient_user?.first_name ||
                                  'Select Patient'}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {`${item?.patient_user?.first_name} ${item?.patient_user?.last_name}`}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                  </View>

                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Doctor:</Text>
                    <SelectDropdown
                      data={doctorData}
                      onSelect={(selectedItem, index) => {
                        // setSelectedColor(selectedItem);
                        setDoctorId(selectedItem.id);
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValue={doctorName}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View style={styles.dropdown2BtnStyle2}>
                            {doctorId != '' ? (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {doctorId == selectedItem?.id
                                  ? selectedItem?.name
                                  : doctorName}
                              </Text>
                            ) : (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {selectedItem?.name || 'Select Doctor'}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Health Insurance:
                    </Text>
                    <TextInput
                      value={insurance}
                      placeholder={'Health Insurance'}
                      onChangeText={text => setInsurance(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Low Income:</Text>
                    <TextInput
                      value={lowIncome}
                      placeholder={'Low Income'}
                      onChangeText={text => setLowIncome(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Reference:</Text>
                    <TextInput
                      value={reference}
                      placeholder={'Reference'}
                      onChangeText={text => setReference(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Status:</Text>
                    <View style={styles.statusView}>
                      <Switch
                        trackColor={{
                          false: status ? COLORS.greenColor : COLORS.errorColor,
                          true: status ? COLORS.greenColor : COLORS.errorColor,
                        }}
                        thumbColor={status ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={COLORS.errorColor}
                        onValueChange={() => setStatus(!status)}
                        value={status}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.parameterView}>
                  <Text style={styles.parameterText}>Medicines</Text>
                  <TouchableOpacity
                    onPress={() => {
                      let NewItemAdd = {
                        medicineId: '',
                        medicineName: '',
                        dosage: '',
                        durationId: '',
                        duration: '',
                        timeId: '',
                        time: '',
                        doseId: '',
                        doseInterval: '',
                        comment: '',
                      };
                      setParameterArray(modifierAdd => [
                        ...modifierAdd,
                        NewItemAdd,
                      ]);
                    }}
                    style={styles.nextView2}>
                    <Text style={styles.nextText}>Add</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={parameterArray}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          backgroundColor: '#eeeeee',
                          paddingBottom: hp(1),
                          marginVertical: hp(1),
                        }}>
                        <View
                          style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                          <View style={{width: '48%'}}>
                            <Text style={styles.dataHistoryText1}>
                              MEDICINES
                            </Text>
                            <SelectDropdown
                              data={medicineArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].medicineId =
                                  selectedItem.id;
                                setRefresh(!refresh);
                              }}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.medicineId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.medicineId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.medicineName}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name ||
                                          'Select Medicine'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>

                          <View style={{width: '48%'}}>
                            <Text style={styles.dataHistoryText1}>DOSAGE</Text>
                            <TextInput
                              value={item.dosage}
                              placeholder={'Dosage'}
                              onChangeText={text => {
                                setRefresh(!refresh);
                                parameterArray[index].dosage = text;
                              }}
                              style={[styles.nameTextView, {width: '100%'}]}
                            />
                          </View>
                        </View>

                        <View
                          style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                          <View style={{width: '48%'}}>
                            <Text style={styles.dataHistoryText1}>
                              DURATION
                            </Text>
                            <SelectDropdown
                              data={durationArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].durationId =
                                  selectedItem.id;
                                parameterArray[index].duration =
                                  selectedItem.name;
                                setRefresh(!refresh);
                              }}
                              defaultValueByIndex={0}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.durationId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.durationId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.duration}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name ||
                                          'Select Medicine'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                          <View style={{width: '48%'}}>
                            <Text style={styles.dataHistoryText1}>TIME</Text>
                            <SelectDropdown
                              data={timeArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].timeId = selectedItem.id;
                                parameterArray[index].time = selectedItem.name;
                                setRefresh(!refresh);
                              }}
                              defaultValueByIndex={0}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.timeId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.timeId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.time}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name || 'Select Time'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                        </View>
                        <View
                          style={[styles.nameView, {paddingHorizontal: wp(2)}]}>
                          <View style={{width: '40%'}}>
                            <Text style={styles.dataHistoryText1}>
                              DOSEINTERVAL
                            </Text>
                            <SelectDropdown
                              data={doseArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].doseId = selectedItem.id;
                                parameterArray[index].doseInterval =
                                  selectedItem.name;
                                setRefresh(!refresh);
                              }}
                              defaultValueByIndex={0}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.doseId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.doseId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.doseInterval}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name || 'Select Time'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                          <View style={{width: '35%'}}>
                            <Text style={styles.dataHistoryText1}>COMMENT</Text>
                            <TextInput
                              value={item.quantity}
                              placeholder={''}
                              onChangeText={text => {
                                setRefresh(!refresh);
                                parameterArray[index].comment = text;
                              }}
                              style={[styles.nameTextView, {width: '100%'}]}
                              keyboardType={'number-pad'}
                            />
                          </View>
                          <View style={[styles.buttonView, {width: '15%'}]}>
                            <TouchableOpacity
                              onPress={() => {
                                const existDataValue = parameterArray;
                                const filterData = existDataValue.filter(
                                  (dataValue, index1) => index1 !== index,
                                );
                                console.log(' =====>', filterData);
                                setParameterArray(filterData);
                              }}
                              style={{marginLeft: wp(2)}}>
                              <Image
                                style={[
                                  styles.editImage,
                                  {tintColor: COLORS.errorColor},
                                ]}
                                source={deleteIcon}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{paddingBottom: hp(1)}}
                />
                <View style={styles.parameterView}>
                  <Text style={styles.parameterText}>Physical Information</Text>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>
                      High Blood Pressure:
                    </Text>
                    <TextInput
                      value={bloodPressure}
                      placeholder={'High Blood Pressure'}
                      onChangeText={text => setBloodPressure(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Food Allergies:</Text>
                    <TextInput
                      value={allergies}
                      placeholder={'Food Allergies'}
                      onChangeText={text => setAllergies(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Tendency Bleed:</Text>
                    <TextInput
                      value={tendencyBleed}
                      placeholder={'Tendency Bleed'}
                      onChangeText={text => setTendencyBleed(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Heart Disease:</Text>
                    <TextInput
                      value={heartDisease}
                      placeholder={'Heart Disease'}
                      onChangeText={text => setHeartDisease(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Diabetic:</Text>
                    <TextInput
                      value={diabetic}
                      placeholder={'Diabetic'}
                      onChangeText={text => setDiabetic(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Added At:</Text>
                    <Text
                      style={[
                        styles.nameTextView,
                        {width: '100%', paddingVertical: hp(1)},
                      ]}
                      onPress={() => setAddDateModal(!addDateModal)}>
                      {addedAt != null
                        ? moment(addedAt).format('DD-MM-YYYY')
                        : 'Added At'}
                    </Text>
                    <DatePicker
                      open={addDateModal}
                      modal={true}
                      date={addedAt || new Date()}
                      mode={'date'}
                      onConfirm={date => {
                        console.log('Console Log>>', date);
                        setAddDateModal(false);
                        setAddedAt(date);
                      }}
                      onCancel={() => {
                        setAddDateModal(false);
                      }}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Female Pregnancy:
                    </Text>
                    <TextInput
                      value={pregnancy}
                      placeholder={'Female Pregnancy'}
                      onChangeText={text => setPregnancy(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Breast Feeding:</Text>
                    <TextInput
                      value={breastFeeding}
                      placeholder={'Breast Feeding'}
                      onChangeText={text => setBreastFeeding(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Current Medication:
                    </Text>
                    <TextInput
                      value={medication}
                      placeholder={'Current Medication'}
                      onChangeText={text => setMedication(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Surgery:</Text>
                    <TextInput
                      value={surgery}
                      placeholder={'Surgery'}
                      onChangeText={text => setSurgery(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Accident:</Text>
                    <TextInput
                      value={accident}
                      placeholder={'Accident'}
                      onChangeText={text => setAccident(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Others:</Text>
                    <TextInput
                      value={others}
                      placeholder={'Others'}
                      onChangeText={text => setOthers(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Pulse Rate:</Text>
                    <TextInput
                      value={pulseRate}
                      placeholder={'Pulse Rate'}
                      onChangeText={text => setPulseRate(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Temperature:</Text>
                    <TextInput
                      value={temperature}
                      placeholder={'Temperature'}
                      onChangeText={text => setTemperature(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Problem Description:
                    </Text>
                    <TextInput
                      value={description}
                      placeholder={'Problem Description'}
                      onChangeText={text => setDescription(text)}
                      style={[styles.commentTextInput]}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>Test:</Text>
                    <TextInput
                      value={test}
                      placeholder={'Test'}
                      onChangeText={text => setTest(text)}
                      style={[styles.commentTextInput]}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>Advice:</Text>
                    <TextInput
                      value={advice}
                      placeholder={'Advice'}
                      onChangeText={text => setAdvice(text)}
                      style={[styles.commentTextInput]}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.nameView1}>
                  <Text style={styles.dataHistoryText1}>Next Visit:</Text>
                  <View style={styles.nameView2}>
                    <TextInput
                      value={nextVisit}
                      placeholder={'1'}
                      onChangeText={text => setNextVisit(text)}
                      style={[styles.nameTextView, {width: '30%'}]}
                    />
                    <SelectDropdown
                      data={daysArray}
                      onSelect={(selectedItem, index1) => {
                        // setSelectedColor(selectedItem);
                        console.log('gert Value:::', parameterArray);
                        setNextVisitId(selectedItem.id);
                        setNextVisitName(selectedItem.name);
                        setRefresh(!refresh);
                      }}
                      defaultValueByIndex={0}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View
                            style={[styles.dropdown2BtnStyle2, {width: '65%'}]}>
                            {nextVisitName != '' ? (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {nextVisitName == selectedItem?.name
                                  ? `${selectedItem?.name}`
                                  : nextVisitName}
                              </Text>
                            ) : (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {selectedItem?.name || 'Select'}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item1, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item1?.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.profileView}>
                <View style={styles.nameView}>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Patient:</Text>
                    <SelectDropdown
                      data={user_data}
                      onSelect={(selectedItem, index) => {
                        // setSelectedColor(selectedItem);
                        setPatientId(selectedItem.id);
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValue={patientName}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View style={styles.dropdown2BtnStyle2}>
                            {patientId != '' ? (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {patientId == selectedItem?.id
                                  ? `${selectedItem?.patient_user?.first_name} ${selectedItem?.patient_user?.last_name}`
                                  : patientName}
                              </Text>
                            ) : (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {selectedItem?.patient_user?.first_name ||
                                  'Select Patient'}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {`${item?.patient_user?.first_name} ${item?.patient_user?.last_name}`}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Doctor:</Text>
                    <SelectDropdown
                      data={doctorData}
                      onSelect={(selectedItem, index) => {
                        // setSelectedColor(selectedItem);
                        setDoctorId(selectedItem.id);
                        console.log('gert Value:::', selectedItem);
                      }}
                      defaultValue={doctorName}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View style={styles.dropdown2BtnStyle2}>
                            {doctorId != '' ? (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {doctorId == selectedItem?.id
                                  ? selectedItem?.name
                                  : doctorName}
                              </Text>
                            ) : (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {selectedItem?.name || 'Select Doctor'}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Health Insurance:
                    </Text>
                    <TextInput
                      value={insurance}
                      placeholder={'Health Insurance'}
                      onChangeText={text => setInsurance(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Low Income:</Text>
                    <TextInput
                      value={lowIncome}
                      placeholder={'Low Income'}
                      onChangeText={text => setLowIncome(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Reference:</Text>
                    <TextInput
                      value={reference}
                      placeholder={'Reference'}
                      onChangeText={text => setReference(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Status:</Text>
                    <View style={styles.statusView}>
                      <Switch
                        trackColor={{
                          false: status ? COLORS.greenColor : COLORS.errorColor,
                          true: status ? COLORS.greenColor : COLORS.errorColor,
                        }}
                        thumbColor={status ? '#f4f3f4' : '#f4f3f4'}
                        ios_backgroundColor={COLORS.errorColor}
                        onValueChange={() => setStatus(!status)}
                        value={status}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.parameterView}>
                  <Text style={styles.parameterText}>Medicines</Text>
                  <TouchableOpacity
                    onPress={() => {
                      let NewItemAdd = {
                        medicineId: '',
                        medicineName: '',
                        dosage: '',
                        durationId: '',
                        duration: '',
                        timeId: '',
                        time: '',
                        doseId: '',
                        doseInterval: '',
                        comment: '',
                      };
                      setParameterArray(modifierAdd => [
                        ...modifierAdd,
                        NewItemAdd,
                      ]);
                    }}
                    style={styles.nextView2}>
                    <Text style={styles.nextText}>Add</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={parameterArray}
                  renderItem={({item, index}) => {
                    return (
                      <View
                        style={{
                          backgroundColor: '#eeeeee',
                          paddingBottom: hp(1),
                          marginVertical: hp(1),
                        }}>
                        <View style={[styles.nameView]}>
                          <View style={{width: '32%'}}>
                            <Text style={styles.dataHistoryText1}>
                              MEDICINES
                            </Text>
                            <SelectDropdown
                              data={medicineArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].medicineId =
                                  selectedItem.id;
                                setRefresh(!refresh);
                              }}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.medicineId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.medicineId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.medicineName}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name ||
                                          'Select Medicine'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                          <View style={{width: '32%'}}>
                            <Text style={styles.dataHistoryText1}>DOSAGE</Text>
                            <TextInput
                              value={item.dosage}
                              placeholder={'Dosage'}
                              onChangeText={text => {
                                setRefresh(!refresh);
                                parameterArray[index].dosage = text;
                              }}
                              style={[styles.nameTextView, {width: '100%'}]}
                            />
                          </View>
                          <View style={{width: '32%'}}>
                            <Text style={styles.dataHistoryText1}>
                              DURATION
                            </Text>
                            <SelectDropdown
                              data={durationArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].durationId =
                                  selectedItem.id;
                                parameterArray[index].duration =
                                  selectedItem.name;
                                setRefresh(!refresh);
                              }}
                              defaultValueByIndex={0}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.durationId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.durationId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.duration}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name ||
                                          'Select Medicine'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                        </View>

                        <View style={[styles.nameView]}>
                          <View style={{width: '25%'}}>
                            <Text style={styles.dataHistoryText1}>TIME</Text>
                            <SelectDropdown
                              data={timeArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].timeId = selectedItem.id;
                                parameterArray[index].time = selectedItem.name;
                                setRefresh(!refresh);
                              }}
                              defaultValueByIndex={0}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.timeId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.timeId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.time}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name || 'Select Time'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                          <View style={{width: '25%'}}>
                            <Text style={styles.dataHistoryText1}>
                              DOSEINTERVAL
                            </Text>
                            <SelectDropdown
                              data={doseArray}
                              onSelect={(selectedItem, index1) => {
                                // setSelectedColor(selectedItem);
                                console.log('gert Value:::', parameterArray);
                                parameterArray[index].doseId = selectedItem.id;
                                parameterArray[index].doseInterval =
                                  selectedItem.name;
                                setRefresh(!refresh);
                              }}
                              defaultValueByIndex={0}
                              renderButton={(selectedItem, isOpen) => {
                                console.log('Get Response>>>', selectedItem);
                                return (
                                  <View style={styles.dropdown2BtnStyle2}>
                                    {item.doseId != '' ? (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {item.doseId == selectedItem?.id
                                          ? `${selectedItem?.name}`
                                          : item.doseInterval}
                                      </Text>
                                    ) : (
                                      <Text style={styles.dropdownItemTxtStyle}>
                                        {selectedItem?.name || 'Select Time'}
                                      </Text>
                                    )}
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                              renderItem={(item1, index, isSelected) => {
                                return (
                                  <TouchableOpacity style={styles.dropdownView}>
                                    <Text style={styles.dropdownItemTxtStyle}>
                                      {item1?.name}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              }}
                              dropdownIconPosition={'left'}
                              dropdownStyle={styles.dropdown2DropdownStyle}
                            />
                          </View>
                          <View style={{width: '25%'}}>
                            <Text style={styles.dataHistoryText1}>COMMENT</Text>
                            <TextInput
                              value={item.quantity}
                              placeholder={''}
                              onChangeText={text => {
                                setRefresh(!refresh);
                                parameterArray[index].comment = text;
                              }}
                              style={[styles.nameTextView, {width: '100%'}]}
                              keyboardType={'number-pad'}
                            />
                          </View>
                          <View style={[styles.buttonView, {width: '15%'}]}>
                            <TouchableOpacity
                              onPress={() => {
                                const existDataValue = parameterArray;
                                const filterData = existDataValue.filter(
                                  (dataValue, index1) => index1 !== index,
                                );
                                console.log(' =====>', filterData);
                                setParameterArray(filterData);
                              }}
                              style={{marginLeft: wp(2)}}>
                              <Image
                                style={[
                                  styles.editImage,
                                  {tintColor: COLORS.errorColor},
                                ]}
                                source={deleteIcon}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  // contentContainerStyle={{paddingBottom: hp(1)}}
                />
                <View style={styles.parameterView}>
                  <Text style={styles.parameterText}>Physical Information</Text>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>
                      High Blood Pressure:
                    </Text>
                    <TextInput
                      value={bloodPressure}
                      placeholder={'High Blood Pressure'}
                      onChangeText={text => setBloodPressure(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Food Allergies:</Text>
                    <TextInput
                      value={allergies}
                      placeholder={'Food Allergies'}
                      onChangeText={text => setAllergies(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Tendency Bleed:</Text>
                    <TextInput
                      value={tendencyBleed}
                      placeholder={'Tendency Bleed'}
                      onChangeText={text => setTendencyBleed(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Heart Disease:</Text>
                    <TextInput
                      value={heartDisease}
                      placeholder={'Heart Disease'}
                      onChangeText={text => setHeartDisease(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Diabetic:</Text>
                    <TextInput
                      value={diabetic}
                      placeholder={'Diabetic'}
                      onChangeText={text => setDiabetic(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Added At:</Text>
                    <Text
                      style={[
                        styles.nameTextView,
                        {width: '100%', paddingVertical: hp(1)},
                      ]}
                      onPress={() => setAddDateModal(!addDateModal)}>
                      {addedAt != null
                        ? moment(addedAt).format('DD-MM-YYYY')
                        : 'Added At'}
                    </Text>
                    <DatePicker
                      open={addDateModal}
                      modal={true}
                      date={addedAt || new Date()}
                      mode={'date'}
                      onConfirm={date => {
                        console.log('Console Log>>', date);
                        setAddDateModal(false);
                        setAddedAt(date);
                      }}
                      onCancel={() => {
                        setAddDateModal(false);
                      }}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Female Pregnancy:
                    </Text>
                    <TextInput
                      value={pregnancy}
                      placeholder={'Female Pregnancy'}
                      onChangeText={text => setPregnancy(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Breast Feeding:</Text>
                    <TextInput
                      value={breastFeeding}
                      placeholder={'Breast Feeding'}
                      onChangeText={text => setBreastFeeding(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Current Medication:
                    </Text>
                    <TextInput
                      value={medication}
                      placeholder={'Current Medication'}
                      onChangeText={text => setMedication(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Surgery:</Text>
                    <TextInput
                      value={surgery}
                      placeholder={'Surgery'}
                      onChangeText={text => setSurgery(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Accident:</Text>
                    <TextInput
                      value={accident}
                      placeholder={'Accident'}
                      onChangeText={text => setAccident(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '32%'}}>
                    <Text style={styles.dataHistoryText1}>Others:</Text>
                    <TextInput
                      value={others}
                      placeholder={'Others'}
                      onChangeText={text => setOthers(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Pulse Rate:</Text>
                    <TextInput
                      value={pulseRate}
                      placeholder={'Pulse Rate'}
                      onChangeText={text => setPulseRate(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                  <View style={{width: '48%'}}>
                    <Text style={styles.dataHistoryText1}>Temperature:</Text>
                    <TextInput
                      value={temperature}
                      placeholder={'Temperature'}
                      onChangeText={text => setTemperature(text)}
                      style={[styles.nameTextView, {width: '100%'}]}
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>
                      Problem Description:
                    </Text>
                    <TextInput
                      value={description}
                      placeholder={'Problem Description'}
                      onChangeText={text => setDescription(text)}
                      style={[styles.commentTextInput]}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>Test:</Text>
                    <TextInput
                      value={test}
                      placeholder={'Test'}
                      onChangeText={text => setTest(text)}
                      style={[styles.commentTextInput]}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.nameView}>
                  <View style={{width: '100%'}}>
                    <Text style={styles.dataHistoryText1}>Advice:</Text>
                    <TextInput
                      value={advice}
                      placeholder={'Advice'}
                      onChangeText={text => setAdvice(text)}
                      style={[styles.commentTextInput]}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <View style={styles.nameView1}>
                  <Text style={styles.dataHistoryText1}>Next Visit:</Text>
                  <View style={styles.nameView2}>
                    <TextInput
                      value={nextVisit}
                      placeholder={'1'}
                      onChangeText={text => setNextVisit(text)}
                      style={[styles.nameTextView, {width: '30%'}]}
                    />
                    <SelectDropdown
                      data={daysArray}
                      onSelect={(selectedItem, index1) => {
                        // setSelectedColor(selectedItem);
                        console.log('gert Value:::', parameterArray);
                        setNextVisitId(selectedItem.id);
                        setNextVisitName(selectedItem.name);
                        setRefresh(!refresh);
                      }}
                      defaultValueByIndex={0}
                      renderButton={(selectedItem, isOpen) => {
                        console.log('Get Response>>>', selectedItem);
                        return (
                          <View
                            style={[styles.dropdown2BtnStyle2, {width: '65%'}]}>
                            {nextVisitName != '' ? (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {nextVisitName == selectedItem?.name
                                  ? `${selectedItem?.name}`
                                  : nextVisitName}
                              </Text>
                            ) : (
                              <Text style={styles.dropdownItemTxtStyle}>
                                {selectedItem?.name || 'Select'}
                              </Text>
                            )}
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      renderItem={(item1, index, isSelected) => {
                        return (
                          <TouchableOpacity style={styles.dropdownView}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item1?.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      }}
                      dropdownIconPosition={'left'}
                      dropdownStyle={styles.dropdown2DropdownStyle}
                    />
                  </View>
                </View>
              </View>
            )}
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => {
                  userId != '' ? onEditPayRollData() : onAddPayRollData();
                }}
                style={styles.nextView}>
                {loading ? (
                  <ActivityIndicator size={'small'} color={COLORS.white} />
                ) : (
                  <Text style={styles.nextText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewBloodIssueVisible(false)}
                style={styles.prevView}>
                <Text style={styles.prevText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
        <DeletePopup
          modelVisible={deleteUser}
          setModelVisible={setDeleteUser}
          onPress={() => onDeletePayrollData(userId)}
          setUserId={setUserId}
          isLoading={loading}
        />
      </View>
    </View>
  );
};

export default PrescriptionScreen;
