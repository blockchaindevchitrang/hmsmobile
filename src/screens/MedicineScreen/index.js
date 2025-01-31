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
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import MedicineCategoryList from '../../components/MedicineComponent/MedicineCategoryList';
import MedicinesBrandList from '../../components/MedicineComponent/MedicinesBrandList';
import MedicineList from '../../components/MedicineComponent/MedicineList';
import PurchaseMedicineList from '../../components/MedicineComponent/PurchaseMedicineList';
import UsedMedicineList from '../../components/MedicineComponent/UsedMedicineList';
import MedicineBillList from '../../components/MedicineComponent/MedicineBillList';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

let arrayData = [
  'Logo',
  'Medicines Categories',
  'Medicines Brands',
  'Medicines',
  'Purchase Medicine',
  'Used Medicine',
  'Medicine Bills',
];

export const MedicineScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchCategory, setSearchCategory] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [searchMedicine, setSearchMedicine] = useState('');
  const [searchPurchase, setSearchPurchase] = useState('');
  const [searchUsed, setSearchUsed] = useState('');
  const [searchBill, setSearchBill] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Medicines Categories');
  const [medicineCategory, setMedicineCategory] = useState([]);
  const [medicineBrand, setMedicineBrand] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [medicinePurchase, setMedicinePurchase] = useState([]);
  const [medicineUsed, setMedicineUsed] = useState([]);
  const [medicineBill, setMedicineBill] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [brandPage, setBrandPage] = useState('1');
  const [medicinePage, setMedicinePage] = useState('1');
  const [purchasePage, setPurchasePage] = useState('1');
  const [usedPage, setUsedPage] = useState('1');
  const [medicineBillPage, setMedicineBillPage] = useState('1');
  const [statusId, setStatusId] = useState(2);
  const [categoryAction, setCategoryAction] = useState([]);
  const [brandAction, setBrandAction] = useState([]);
  const [medicineAction, setMedicineAction] = useState([]);
  const [purchaseAction, setPurchaseAction] = useState([]);
  const [usedAction, setUsedAction] = useState([]);
  const [billAction, setBillAction] = useState([]);

  useEffect(() => {
    const visibility = {
      categoryVisible: false,
      brandVisible: false,
      medicineVisible: false,
      purchaseVisible: false,
      usedVisible: false,
      billVisible: false,
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
    rolePermission.forEach(item => {
      if (item.main_module === 'Medicines') {
        processPrivileges(
          item.privileges,
          'medicine_categories',
          setCategoryAction,
          'categoryVisible',
        );
        processPrivileges(
          item.privileges,
          'medicine_crands',
          setBrandAction,
          'brandVisible',
        );
        processPrivileges(
          item.privileges,
          'medicines',
          setMedicineAction,
          'medicineVisible',
        );
        processPrivileges(
          item.privileges,
          'purchase_medicine',
          setPurchaseAction,
          'purchaseVisible',
        );
        processPrivileges(
          item.privileges,
          'used_medicine',
          setUsedAction,
          'usedVisible',
        );
        processPrivileges(
          item.privileges,
          'medicine_bills',
          setBillAction,
          'billVisible',
        );
        // Handle arrayData based on visibility
        const {
          categoryVisible,
          brandVisible,
          medicineVisible,
          purchaseVisible,
          usedVisible,
          billVisible,
        } = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          categoryVisible && 'Medicines Categories',
          brandVisible && 'Medicines Brands',
          medicineVisible && 'Medicines',
          purchaseVisible && 'Purchase Medicine',
          usedVisible && 'Used Medicine',
          billVisible && 'Medicine Bills',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

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

  useEffect(() => {
    onGetMedicineCategoryData();
  }, [searchCategory, pageCount, statusId]);

  const onGetMedicineCategoryData = async () => {
    try {
      let urlData = `medicine-category-get?search=${searchCategory}&page=${pageCount}&status=${statusId}`;
      const response = await onGetCommonApi(urlData);
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicineCategory(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetMedicineBrandData();
  }, [searchBrand, pageCount]);

  const onGetMedicineBrandData = async () => {
    try {
      const response = await onGetCommonApi(
        `medicine-brand-get?search=${searchBrand}&page=${pageCount}`,
      );
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicineBrand(response.data.data.items);
        setBrandPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetMedicineData();
  }, [searchMedicine, pageCount]);

  const onGetMedicineData = async () => {
    try {
      const response = await onGetCommonApi(
        `medicine-get?search=${searchMedicine}&page=${pageCount}`,
      );
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicine(response.data.data.items);
        setMedicinePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetPurchaseMedicineData();
  }, [searchPurchase, pageCount]);

  const onGetPurchaseMedicineData = async () => {
    try {
      const response = await onGetCommonApi(
        `purchase-medicine-get?search=${searchPurchase}&page=${pageCount}`,
      );
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicinePurchase(response.data.data.items);
        setPurchasePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetUsedMedicineData();
  }, [searchUsed, pageCount]);

  const onGetUsedMedicineData = async () => {
    try {
      const response = await onGetCommonApi(
        `used-medicine-get?search=${searchUsed}&page=${pageCount}`,
      );
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicineUsed(response.data.data.items);
        setUsedPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetMedicineBillData();
  }, [searchBill, pageCount]);

  const onGetMedicineBillData = async () => {
    try {
      const response = await onGetCommonApi(
        `medicine-bill-get?search=${searchBill}&page=${pageCount}`,
      );
      console.log('Response User Data', response.data);
      if (response.data.flag === 1) {
        setMedicineBill(response.data.data.items);
        setMedicineBillPage(response.data.data.pagination.last_page);
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
          title={t('medicines')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Medicines Categories' ? (
          <MedicineCategoryList
            searchBreak={searchCategory}
            setSearchBreak={setSearchCategory}
            allData={medicineCategory}
            onGetData={onGetMedicineCategoryData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId}
            setStatusId={setStatusId}
            categoryAction={categoryAction}
          />
        ) : selectedView == 'Medicines Brands' ? (
          <MedicinesBrandList
            searchBreak={searchBrand}
            setSearchBreak={setSearchBrand}
            allData={medicineBrand}
            onGetData={onGetMedicineBrandData}
            totalPage={brandPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            brandAction={brandAction}
          />
        ) : selectedView == 'Medicines' ? (
          <MedicineList
            searchBreak={searchMedicine}
            setSearchBreak={setSearchMedicine}
            allData={medicine}
            onGetData={onGetMedicineData}
            medicineCategory={medicineCategory}
            medicineBrand={medicineBrand}
            totalPage={medicinePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            medicineAction={medicineAction}
          />
        ) : selectedView == 'Purchase Medicine' ? (
          <PurchaseMedicineList
            searchBreak={searchPurchase}
            setSearchBreak={setSearchPurchase}
            allData={medicinePurchase}
            onGetData={onGetPurchaseMedicineData}
            totalPage={purchasePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            medicine={medicine}
            purchaseAction={purchaseAction}
          />
        ) : selectedView == 'Used Medicine' ? (
          <UsedMedicineList
            searchBreak={searchUsed}
            setSearchBreak={setSearchUsed}
            allData={medicineUsed}
            onGetData={onGetUsedMedicineData}
            totalPage={usedPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            usedAction={usedAction}
          />
        ) : (
          selectedView == 'Medicine Bills' && (
            <MedicineBillList
              searchBreak={searchBill}
              setSearchBreak={setSearchBill}
              allData={medicineBill}
              onGetData={onGetMedicineBillData}
              totalPage={medicineBillPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              medicine={medicine}
              medicineCategory={medicineCategory}
              billAction={billAction}
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

export default MedicineScreen;
