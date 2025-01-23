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
import DocumentList from '../../components/DocumentComponent/DocumentList';
import DocumentTypeList from '../../components/DocumentComponent/DocumentTypeList';
import {onGetCommonApi} from '../../services/Api';
import useOrientation from '../../components/OrientationComponent';

export const DocumentsScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchAccount, setSearchAccount] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Documents');
  const [documentList, setDocumentList] = useState([]);
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [documentTypePage, setDocumentTypePage] = useState('1');

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
    onGetDocumentData();
  }, [searchAccount, pageCount]);

  const onGetDocumentData = async () => {
    try {
      const response = await onGetCommonApi(
        `document-get?search=${searchAccount}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setDocumentList(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetDocumentTypeData();
  }, [searchPharmacists, pageCount]);

  const onGetDocumentTypeData = async () => {
    try {
      const response = await onGetCommonApi(
        `document-type-get?search=${searchPharmacists}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setDocumentTypeList(response.data.data.items);
        setDocumentTypePage(response.data.data.pagination.last_page);
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
          title={t('documents')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Documents' ? (
          <DocumentList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={documentList}
            onGetData={onGetDocumentData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : (
          selectedView == 'Document Types' && (
            <DocumentTypeList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={documentTypeList}
              onGetData={onGetDocumentTypeData}
              totalPage={documentTypePage}
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
                {['Logo', 'Documents', 'Document Types'].map(
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

export default DocumentsScreen;
