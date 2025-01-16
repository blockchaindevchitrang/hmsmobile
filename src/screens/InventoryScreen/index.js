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
import ItemCategoriesList from '../../components/InventoryComponent/ItemCategoriesList';
import ItemsList from '../../components/InventoryComponent/ItemsList';
import IssuedItemsList from '../../components/InventoryComponent/IssuedItemsList';
import ItemStocksList from '../../components/InventoryComponent/ItemStocksList';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';

const allData = [
  {
    id: 1,
    chargeCategory: 'Consultation',
    description: 'N/A',
    chargeTime: 'Operation Theatre',
  },
  {
    id: 2,
    chargeCategory: 'Online Consulation',
    description: 'demo',
    chargeTime: 'Procedures',
  },
  {
    id: 3,
    chargeCategory: 'Fee',
    description: 'N/A',
    chargeTime: 'Investigations',
  },
  {
    id: 4,
    chargeCategory: 'Other',
    description: 'N/A',
    chargeTime: 'Others',
  },
  {
    id: 5,
    chargeCategory: 'op',
    description: 'N/A',
    chargeTime: 'Operation Theatre',
  },
];

const BloodDonorData = [
  {
    id: 1,
    code: '76571',
    chargeCategory: 'Consultation',
    chargeType: 'Operation Theatre',
    standard_charge: '$100.00',
  },
  {
    id: 2,
    code: '76572',
    chargeCategory: 'Online Consultation',
    chargeType: 'Procedures',
    standard_charge: '$1,000.00',
  },
  {
    id: 3,
    code: '76573',
    chargeCategory: 'Fee',
    chargeType: 'Investigations',
    standard_charge: '$343,442.00',
  },
  {
    id: 4,
    code: '76574',
    chargeCategory: 'Other',
    chargeType: 'Others',
    standard_charge: '$5,000.00',
  },
  {
    id: 5,
    code: '76575',
    chargeCategory: 'op',
    chargeType: 'Operation Theatre',
    standard_charge: '$5,000.00',
  },
];

const BloodIssueData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    standard_charge: '$600.00',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    standard_charge: '$600.00',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    standard_charge: '$500.00',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    standard_charge: '$500.00',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    standard_charge: '$400.00',
  },
];

export const InventoryScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchItemStock, setSearchItemStock] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Item Categories');
  const [itemCategory, setItemCategory] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [itemStockList, setItemStockList] = useState([]);
  const [issueItemList, setIssueItemList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [itemPage, setItemPage] = useState('1');
  const [itemStockPage, setItemStockPage] = useState('1');
  const [issueItemPage, setIssueItemPage] = useState('1');
  const [statusId, setStatusId] = useState(3);

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
    onGetItemCategoriesData();
  }, [searchAccount, pageCount]);

  const onGetItemCategoriesData = async () => {
    try {
      const response = await onGetCommonApi(
        `item-category-get?search=${searchAccount}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setItemCategory(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetItemData();
  }, [searchPayroll, pageCount]);

  const onGetItemData = async () => {
    try {
      const response = await onGetCommonApi(
        `item-get?search=${searchPayroll}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setItemList(response.data.data.items);
        setItemPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetItemStockData();
  }, [searchItemStock, pageCount]);

  const onGetItemStockData = async () => {
    try {
      const response = await onGetCommonApi(
        `item-stock-get?search=${searchItemStock}&page=${pageCount}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setItemStockList(response.data.data.items);
        setItemStockPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error>>', err);
    }
  };

  useEffect(() => {
    onGetIssueItemData();
  }, [searchPharmacists, pageCount, statusId]);

  const onGetIssueItemData = async () => {
    try {
      const response = await onGetCommonApi(
        `issue-item-get?search=${searchPharmacists}&page=${pageCount}&status=${statusId}`,
      );
      console.log('get Response:', response.data.data);
      if (response.data.flag === 1) {
        setIssueItemList(response.data.data.items);
        setIssueItemPage(response.data.data.pagination.last_page);
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
          title={t('inventory')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Item Categories' ? (
          <ItemCategoriesList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={itemCategory}
            onGetData={onGetItemCategoriesData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : selectedView == 'Items' ? (
          <ItemsList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={itemList}
            onGetData={onGetItemData}
            itemCategory={itemCategory}
            totalPage={itemPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : selectedView == 'Item Stocks' ? (
          <ItemStocksList
            searchBreak={searchItemStock}
            setSearchBreak={setSearchItemStock}
            allData={itemStockList}
            onGetData={onGetItemStockData}
            itemCategory={itemCategory}
            itemList={itemList}
            totalPage={itemStockPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : (
          selectedView == 'Issued Items' && (
            <IssuedItemsList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={issueItemList}
              onGetData={onGetIssueItemData}
              itemCategory={itemCategory}
              itemList={itemList}
              totalPage={issueItemPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              statusId={statusId}
              setStatusId={setStatusId}
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
                {[
                  'Logo',
                  'Item Categories',
                  'Items',
                  'Item Stocks',
                  'Issued Items',
                ].map((option, index) => (
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

export default InventoryScreen;
