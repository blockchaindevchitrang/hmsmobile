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
import ChargeCategoriesList from '../../components/HospitalChargesComponent/ChargeCategoriesList';
import ChargesComponent from '../../components/HospitalChargesComponent/ChargesComponent';
import DoctorChargesList from '../../components/HospitalChargesComponent/DoctorChargesList';
import {onGetCommonApi} from '../../services/Api';

export const HospitalChargesScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Charge Categories');
  const [chargeCategory, setChargeCategory] = useState([]);
  const [categoryType, setCategoryType] = useState([]);
  const [chargeList, setChargeList] = useState([]);
  const [chargeOPDList, setChargeOPDList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [chargePage, setChargePage] = useState('1');
  const [OPDChargePage, setOPDChargePage] = useState('1');
  const [statusId, setStatusId] = useState(0);

  const animations = useRef(
    [0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0].map(() => new Animated.Value(0)),
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
    onIncomeHeadGet();
  }, []);

  const onIncomeHeadGet = async () => {
    try {
      const response = await onGetCommonApi('charge-type-get');
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        const matchingKey = [];
        Object.entries(response.data.data).find(([key, value]) => {
          matchingKey.push({id: key, name: value});
        });
        setCategoryType(matchingKey);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetDocumentData();
  }, [searchAccount, pageCount]);

  const onGetDocumentData = async () => {
    try {
      const response = await onGetCommonApi(
        `charge-category-get?search=${searchAccount}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setChargeCategory(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetChargeData();
  }, [searchPayroll, pageCount, statusId]);

  const onGetChargeData = async () => {
    try {
      const response = await onGetCommonApi(
        `charge-get?search=${searchPayroll}&page=${pageCount}&charge_type=${statusId}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setChargeList(response.data.data.items);
        setChargePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetOPDChargeData();
  }, [searchPharmacists, pageCount]);

  const onGetOPDChargeData = async () => {
    try {
      const response = await onGetCommonApi(
        `doctor-opd-charge-get?search=${searchPharmacists}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setChargeOPDList(response.data.data.items);
        setOPDChargePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('hospital_charges')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Charge Categories' ? (
          <ChargeCategoriesList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={chargeCategory}
            categoryType={categoryType}
            onGetData={onGetDocumentData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : selectedView == 'Charges' ? (
          <ChargesComponent
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={chargeList}
            categoryType={categoryType}
            onGetData={onGetChargeData}
            chargeCategory={chargeCategory}
            totalPage={chargePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId}
            setStatusId={setStatusId}
          />
        ) : (
          selectedView == 'Doctor OPD Charges' && (
            <DoctorChargesList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={chargeOPDList}
              onGetData={onGetOPDChargeData}
              totalPage={OPDChargePage}
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
            {['Logo', 'Charge Categories', 'Charges', 'Doctor OPD Charges'].map(
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

export default HospitalChargesScreen;
