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
import IPDList from '../../components/IPDComponent/IPDList';
import OPDList from '../../components/IPDComponent/OPDList';
import { onGetCommonApi } from '../../services/Api';

const BloodIssueData = [
  {
    id: 1,
    admission: 'OMGFK57O',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    bed: 'Single-10',
    status: 'Paid',
  },
  {
    id: 2,
    admission: 'OMGFK571',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    bed: 'General Ward',
    status: 'Unpaid',
  },
  {
    id: 3,
    admission: 'OMGFK572',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    bed: 'VVIP-32',
    status: 'Paid',
  },
  {
    id: 4,
    admission: 'OMGFK573',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    bed: 'General Ward',
    status: 'Unpaid',
  },
  {
    id: 5,
    admission: 'OMGFK574',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    bed: 'General Ward',
    status: 'Unpaid',
  },
];

const ODPData = [
  {
    id: 1,
    admission: 'OMGFK57O',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '22:02:00 2023-05-25',
    charge: '$1,200.00',
    payment: 'Card',
  },
  {
    id: 2,
    admission: 'OMGFK571',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    charge: '$600.00',
    payment: 'Cash',
  },
  {
    id: 3,
    admission: 'OMGFK572',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    charge: '$1,500.00',
    payment: 'Card',
  },
  {
    id: 4,
    admission: 'OMGFK573',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '22:02:00 2023-05-25',
    charge: '$600.00',
    payment: 'Cash',
  },
  {
    id: 5,
    admission: 'OMGFK574',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '22:02:00 2023-05-25',
    charge: '$600.00',
    payment: 'Cash',
  },
];

export const IPDScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('IPD Patients');
  const [IPDData, setIPDData] = useState([]);
  const [OPDData, setOPDData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const animations = useRef(
    [0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef([0, 0, 0].map(() => new Animated.Value(0))).current;

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
    onGetIPDData();
  }, [searchAccount]);

  const onGetIPDData = async () => {
    try {
      const response = await onGetCommonApi(`ipd-patient-department-get?search=${searchAccount}`);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setIPDData(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetOPDData();
  }, [searchPharmacists]);

  const onGetOPDData = async () => {
    try {
      const response = await onGetCommonApi(`opd-patient-department-get?search=${searchPharmacists}`);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setOPDData(response.data.data.items);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('ipd_opd')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'IPD Patients' ? (
          <IPDList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={IPDData}
            onGetData={onGetIPDData}
          />
        ) : (
          selectedView == 'OPD Patients' && (
            <OPDList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={OPDData}
              onGetData={onGetOPDData}
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
            {['Logo', 'IPD Patients', 'OPD Patients'].map((option, index) => (
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

export default IPDScreen;
