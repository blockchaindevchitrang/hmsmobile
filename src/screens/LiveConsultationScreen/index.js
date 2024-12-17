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
import {onGetCommonApi} from '../../services/Api';
import ConsultationList from '../../components/ConsultationComponent/ConsultationList';
import LiveMeetingList from '../../components/ConsultationComponent/LiveMeetingList';

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

export const LiveConsultationScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchConsultation, setSearchConsultation] = useState('');
  const [searchLiveMeeting, setSearchLiveMeeting] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Live Consultations');
  const [consultationData, setConsultationData] = useState([]);
  const [liveMeetingData, setLiveMeetingData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [meetingPage, setMeetingPage] = useState('1');
  const [statusId, setStatusId] = useState(3);

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
    onGetConsultationData();
  }, [searchConsultation, pageCount, statusId]);

  const onGetConsultationData = async () => {
    try {
      let urlData = `ipd-patient-department-get?search=${searchConsultation}&page=${pageCount}&is_discharge=${statusId}`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setConsultationData(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetLiveMeetingData();
  }, [searchLiveMeeting, pageCount]);

  const onGetLiveMeetingData = async () => {
    try {
      let urlData = `opd-patient-department-get?search=${searchLiveMeeting}&page=${pageCount}`;
      const response = await onGetCommonApi(urlData);
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setLiveMeetingData(response.data.data.items);
        setMeetingPage(response.data.data.pagination.last_page);
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
          title={t('live_consultations')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Live Consultations' ? (
          <ConsultationList
            searchBreak={searchConsultation}
            setSearchBreak={setSearchConsultation}
            allData={consultationData}
            onGetData={onGetConsultationData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId}
            setStatusId={setStatusId}
          />
        ) : (
          selectedView == 'Live Meetings' && (
            <LiveMeetingList
              searchBreak={searchLiveMeeting}
              setSearchBreak={setSearchLiveMeeting}
              allData={liveMeetingData}
              onGetData={onGetLiveMeetingData}
              totalPage={meetingPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
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
            {['Logo', 'Live Consultations', 'Live Meetings'].map(
              (option, index) => (
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
              ),
            )}

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

export default LiveConsultationScreen;
