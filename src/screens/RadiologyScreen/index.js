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
import {BlurView} from '@react-native-community/blur';
import PatientsList from '../../components/PatientsComponent/PatientsList';
import GeneratePatient from '../../components/PatientsComponent/GeneratePatient';
import RadiologyTests from '../../components/RadiologyComponent/RadiologyTests';
import RadiologyCategories from '../../components/RadiologyComponent/RadiologyCategories';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    phone: '9876543210',
    group: 'O+',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: 'N/A',
    group: 'AB-',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    group: 'O+',
    status: false,
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    phone: '9876543210',
    group: 'A+',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    phone: '9876543210',
    group: 'O+',
    status: true,
  },
];

const PharmacistsData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    unique_id: 'N2JY0SK9',
    template_name: 'Testing',
  },
];

export const RadiologyScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchUser, setSearchUser] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Radiology Categories');
  const [radiologyCategory, setRadiologyCategory] = useState([]);
  const [radiologyTest, setRadiologyTest] = useState([]);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [radiologyTestPage, setRadiologyTestPage] = useState('1');

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
    onGetCategoriesData();
  }, [searchUser, pageCount]);

  const onGetCategoriesData = async () => {
    try {
      const response = await onGetCommonApi(
        `radiology-category-get?search=${searchUser}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setRadiologyCategory(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetTestData();
  }, [searchPharmacists, pageCount]);

  const onGetTestData = async () => {
    try {
      const response = await onGetCommonApi(
        `radiology-test-get?search=${searchPharmacists}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setRadiologyTest(response.data.data.items);
        setRadiologyTestPage(response.data.data.pagination.last_page);
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
          title={t('radiology')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Radiology Categories' ? (
          <RadiologyCategories
            searchBreak={searchUser}
            setSearchBreak={setSearchUser}
            allData={radiologyCategory}
            onGetData={onGetCategoriesData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : (
          selectedView == 'Radiology Tests' && (
            <RadiologyTests
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={radiologyTest}
              onGetData={onGetTestData}
              category={radiologyCategory}
              totalPage={radiologyTestPage}
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
                {['Logo', 'Radiology Categories', 'Radiology Tests'].map(
                  (option, index) => (
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
                              setSelectedView(option), toggleMenu(false);
                            }}>
                            <Text style={styles.menuItem}>{option}</Text>
                          </TouchableOpacity>
                        </Animated.View>
                      )}
                    </>
                  ),
                )}

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

export default RadiologyScreen;
