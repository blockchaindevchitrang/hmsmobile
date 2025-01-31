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
import {useSelector} from 'react-redux';

let arrayData = [
  'Logo',
  'Item Categories',
  'Items',
  'Item Stocks',
  'Issued Items',
];

export const InventoryScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
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
  const [categoryAction, setCategoryAction] = useState([]);
  const [itemAction, setItemAction] = useState([]);
  const [stockAction, setStockAction] = useState([]);
  const [issueAction, setIssueAction] = useState([]);

  useEffect(() => {
    const visibility = {
      categoryVisible: false,
      itemVisible: false,
      stockVisible: false,
      issueVisible: false,
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
      if (item.main_module === 'Hospital Charges') {
        processPrivileges(
          item.privileges,
          'items_categories',
          setCategoryAction,
          'categoryVisible',
        );
        processPrivileges(
          item.privileges,
          'items',
          setItemAction,
          'itemVisible',
        );
        processPrivileges(
          item.privileges,
          'item_stocks',
          setStockAction,
          'stockVisible',
        );
        processPrivileges(
          item.privileges,
          'issued_items',
          setIssueAction,
          'issueVisible',
        );

        // Handle arrayData based on visibility
        const {categoryVisible, itemVisible, stockVisible, issueVisible} =
          visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          categoryVisible && 'Item Categories',
          itemVisible && 'Items',
          stockVisible && 'Item Stocks',
          issueVisible && 'Issued Items',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

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
            categoryAction={categoryAction}
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
            itemAction={itemAction}
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
            stockAction={stockAction}
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
              issueAction={issueAction}
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
