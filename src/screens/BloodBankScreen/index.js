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
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import BloodBanksList from '../../components/BloodComponent/BloodBanksList';
import BloodDonorList from '../../components/BloodComponent/BloodDonorList';
import BloodDonationList from '../../components/BloodComponent/BloodDonationList';
import BloodIssueList from '../../components/BloodComponent/BloodIssueList';
import {onGetBloodBankApi, onGetBloodDonationApi, onGetBloodDonorApi, onGetBloodIssueApi} from '../../services/Api';

const allData = [
  {
    id: 1,
    blood: 'O+',
    bag: 5,
  },
  {
    id: 2,
    blood: 'A+',
    bag: 2,
  },
  {
    id: 3,
    blood: 'B+',
    bag: 2,
  },
  {
    id: 4,
    blood: 'AB+',
    bag: 10,
  },
  {
    id: 5,
    blood: 'O-',
    bag: 12,
  },
];

const BloodDonorData = [
  {
    id: 1,
    name: 'joey Tribiyani',
    age: '48',
    gender: 'Male',
    blood_group: 'O+',
    date: '22:02:00\n2023-05-25',
  },
  {
    id: 2,
    name: 'Monica Geller',
    age: '43',
    gender: 'Female',
    blood_group: 'B+',
    date: '22:02:00\n2023-05-25',
  },
  {
    id: 3,
    name: 'joey Tribiyani',
    age: '49',
    gender: 'Male',
    blood_group: 'O+',
    date: '22:02:00\n2023-05-25',
  },
  {
    id: 4,
    name: 'joey Tribiyani',
    age: '45',
    gender: 'Female',
    blood_group: 'A-',
    date: '22:02:00\n2023-05-25',
  },
  {
    id: 5,
    name: 'joey Tribiyani',
    age: '41',
    gender: 'Female',
    blood_group: 'B-',
    date: '22:02:00\n2023-05-25',
  },
];

const BloodDonationData = [
  {
    id: 1,
    bag: '1',
    name: 'Joey Tribiyani',
  },
  {
    id: 2,
    bag: '3',
    name: 'Monica Geller',
  },
  {
    id: 3,
    bag: '1',
    name: 'Ross Geller',
  },
  {
    id: 4,
    bag: '2',
    name: 'Monica Geller',
  },
  {
    id: 5,
    bag: '1',
    name: 'Ross Geller',
  },
];

const BloodIssueData = [
  {
    id: 1,
    admission: 'EMP0000001',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    discharge: 'N/A',
    package: 'Patient',
    insurance: 'Cooper Mccall',
    policy: 'N/A',
    status: true,
  },
  {
    id: 2,
    admission: 'EMP0000002',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    discharge: 'N/A',
    package: 'Body Check up',
    insurance: 'Colleen Craig',
    policy: '4839920',
    status: false,
  },
  {
    id: 3,
    admission: 'EMP0000003',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    discharge: '22:02:00 2023-05-28',
    package: 'N/A',
    insurance: 'Demo Insurance',
    policy: 'N/A',
    status: true,
  },
  {
    id: 4,
    admission: 'EMP0000004',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    discharge: 'N/A',
    package: 'Patient',
    insurance: 'Demo Insurance',
    policy: 'N/A',
    status: false,
  },
  {
    id: 5,
    admission: 'EMP0000005',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    discharge: 'N/A',
    package: 'Patient',
    insurance: 'Demo Insurance',
    policy: 'N/A',
    status: false,
  },
];

export const BloodBankScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Blood Banks');
  const [bloodBankData, setBloodBankData] = useState([]);
  const [bloodDonorData, setBloodDonorData] = useState([]);
  const [bloodDonationData, setBloodDonationData] = useState([]);
  const [bloodIssueData, setBloodIssueData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const animations = useRef(
    [0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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

  useEffect(() => {
    onGetBloodBankData();
  }, []);

  const onGetBloodBankData = async () => {
    try {
      const response = await onGetBloodBankApi();
      console.log('Response Role Data', response.data);
      if (response.status === 200) {
        setBloodBankData(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
    try {
      const bloodDonor = await onGetBloodDonorApi();
      console.log('Response bloodDonor Data', bloodDonor.data);
      if (bloodDonor.status === 200) {
        setBloodDonorData(bloodDonor.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onBloodDonationData();
  }, [searchInvoice]);

  const onBloodDonationData = async () => {
    try {
      const bloodDonor = await onGetBloodDonationApi(searchInvoice);
      console.log('Response bloodDonor Data', bloodDonor.data);
      if (bloodDonor.status === 200) {
        setBloodDonationData(bloodDonor.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get User Error:', err);
    }
  };

  useEffect(() => {
    onBloodIssueData();
  }, [searchPharmacists]);

  const onBloodIssueData = async () => {
    try {
      const bloodDonor = await onGetBloodIssueApi(searchPharmacists);
      console.log('Response bloodDonor Data', bloodDonor.data);
      if (bloodDonor.status === 200) {
        setBloodIssueData(bloodDonor.data.data);
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
          title={t('blood_bank')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Blood Banks' ? (
          <BloodBanksList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={bloodBankData}
            onGetData={() => onGetBloodBankData()}
          />
        ) : selectedView == 'Blood Donors' ? (
          <BloodDonorList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={bloodDonorData}
            onGetData={onGetBloodBankData}
          />
        ) : selectedView == 'Blood Donations' ? (
          <BloodDonationList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={bloodDonationData}
            onGetData={onBloodDonationData}
          />
        ) : (
          selectedView == 'Blood Issues' && (
            <BloodIssueList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={bloodIssueData}
              onGetData={onBloodIssueData}
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
              'Blood Banks',
              'Blood Donors',
              'Blood Donations',
              'Blood Issues',
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
                        setSelectedView(option), toggleMenu(false);
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

export default BloodBankScreen;
