import React, {useState, useRef} from 'react';
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
import DiagnosisList from '../../components/DiagnosisComponent/DiagnosisList';
import DiagnosisCategoriesList from '../../components/DiagnosisComponent/DiagnosisCategoriesList';
import DiagnosisTestsList from '../../components/DiagnosisComponent/DiagnosisTestsList';
import CallLogsList from '../../components/FrontOfficeComponent/CallLogsList';
import VisitorList from '../../components/FrontOfficeComponent/VisitorList';

const allData = [
  {
    id: 1,
    name: 'John Doe',
    number: 'N/A',
    date: '01 Nov, 2022',
    follow_type: '02 Nov, 2022',
    call_type: 'Incoming',
  },
  {
    id: 2,
    name: 'John Doe',
    number: 'N/A',
    date: '01 Nov, 2022',
    follow_type: '02 Nov, 2022',
    call_type: 'Incoming',
  },
  {
    id: 3,
    name: 'John Doe',
    number: 'N/A',
    date: '01 Nov, 2022',
    follow_type: '02 Nov, 2022',
    call_type: 'Incoming',
  },
  {
    id: 4,
    name: 'John Doe',
    number: 'N/A',
    date: '01 Nov, 2022',
    follow_type: '02 Nov, 2022',
    call_type: 'Incoming',
  },
  {
    id: 5,
    name: 'John Doe',
    number: 'N/A',
    date: '01 Nov, 2022',
    follow_type: '02 Nov, 2022',
    call_type: 'Incoming',
  },
];

const VisitorData = [
  {
    id: 1,
    purpose: 'Visit',
    name: 'John Doe',
    number: 'N/A',
    person: '3',
    date: '01 Nov, 2022',
    in_time: '12:30:00 PM',
    out_time: '01:30:00 PM',
  },
  {
    id: 2,
    purpose: 'Seminar',
    name: 'Jane Smith',
    number: 'N/A',
    person: '1',
    date: '11 Dec, 2022',
    in_time: '01:30:00 PM',
    out_time: '02:00:00 PM',
  },
  {
    id: 3,
    purpose: 'Seminar',
    name: 'Joe Johnson',
    number: '+ 91987654321',
    person: '2',
    date: '08 Sept, 2023',
    in_time: '04:30:00 PM',
    out_time: '06:30:00 PM',
  },
  {
    id: 4,
    purpose: 'Visit',
    name: 'John Doe',
    number: 'N/A',
    person: '3',
    date: '01 Nov, 2022',
    in_time: '12:30:00 PM',
    out_time: '01:30:00 PM',
  },
  {
    id: 5,
    purpose: 'Visit',
    name: 'John Doe',
    number: 'N/A',
    person: '3',
    date: '01 Nov, 2022',
    in_time: '12:30:00 PM',
    out_time: '01:30:00 PM',
  },
];

const BloodIssueData = [
  {
    id: 1,
    admission: 'EMP0000001',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    date: '01 Feb, 2024',
    discharge: 'Surgery',
  },
  {
    id: 2,
    admission: 'EMP0000002',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '9 Sept, 2020',
    discharge: 'X-ray',
  },
  {
    id: 3,
    admission: 'EMP0000003',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '12 Dec, 2022',
    discharge: 'Full Body checkup',
  },
  {
    id: 4,
    admission: 'EMP0000004',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    date: '12 Dec, 2022',
    discharge: 'MRI',
  },
  {
    id: 5,
    admission: 'EMP0000005',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    date: '12 Dec, 2022',
    discharge: 'Dental Implant',
  },
];

export const FrontOfficeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Call Logs');

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

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('front_office')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Call Logs' ? (
          <CallLogsList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={allData}
          />
        ) : selectedView == 'Visitors' ? (
          <VisitorList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={VisitorData}
          />
        ) : selectedView == 'Postal Receives' ? (
          <VisitorList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={VisitorData}
          />
        ) : (
          selectedView == 'Postal Dispatches' && (
            <VisitorList
              searchBreak={searchPayroll}
              setSearchBreak={setSearchPayroll}
              allData={VisitorData}
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
              'Call Logs',
              'Visitors',
              'Postal Receives',
              'Postal Dispatches',
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

export default FrontOfficeScreen;
