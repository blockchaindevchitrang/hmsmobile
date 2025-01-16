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
import CallLogsList from '../../components/FrontOfficeComponent/CallLogsList';
import VisitorList from '../../components/FrontOfficeComponent/VisitorList';
import {onGetCommonApi} from '../../services/Api';
import PostalReceiveList from '../../components/FrontOfficeComponent/PostalReceiveList';
import PostalDispatchList from '../../components/FrontOfficeComponent/PostalDispatchList';
import useOrientation from '../../components/OrientationComponent';

export const FrontOfficeScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [searchCallLog, setSearchCallLog] = useState('');
  const [searchVisitor, setSearchVisitor] = useState('');
  const [searchReceive, setSearchReceive] = useState('');
  const [searchDispatch, setSearchDispatch] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Call Logs');
  const [callLogList, setCallLogList] = useState([]);
  const [visitorList, setVisitorList] = useState([]);
  const [receiveList, setReceiveList] = useState([]);
  const [dispatchList, setDispatchList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [visitorPage, setVisitorPage] = useState('1');
  const [receivePage, setReceivePage] = useState('1');
  const [dispatchPage, setDispatchPage] = useState('1');
  const [statusId, setStatusId] = useState(3);
  const [statusId1, setStatusId1] = useState(0);

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
    onGetCallLogData();
  }, [searchCallLog, pageCount, statusId]);

  const onGetCallLogData = async () => {
    try {
      const response = await onGetCommonApi(
        `call-log-get?search=${searchCallLog}&page=${pageCount}&call_type=${statusId}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setCallLogList(response.data.data.items);
        setTotalPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetVisitorData();
  }, [searchVisitor, pageCount, statusId1]);

  const onGetVisitorData = async () => {
    try {
      const response = await onGetCommonApi(
        `visitor-get?search=${searchVisitor}&page=${pageCount}&purpose=${statusId1}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setVisitorList(response.data.data.items);
        setVisitorPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetReceiveData();
  }, [searchReceive]);

  const onGetReceiveData = async () => {
    try {
      const response = await onGetCommonApi(
        `postal-receive-get?search=${searchReceive}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setReceiveList(response.data.data.items);
        setReceivePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetDispatchData();
  }, [searchDispatch]);

  const onGetDispatchData = async () => {
    try {
      const response = await onGetCommonApi(
        `postal-diapatch-get?search=${searchDispatch}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setDispatchList(response.data.data.items);
        setDispatchPage(response.data.data.pagination.last_page);
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
          title={t('front_office')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Call Logs' ? (
          <CallLogsList
            searchBreak={searchCallLog}
            setSearchBreak={setSearchCallLog}
            allData={callLogList}
            onGetData={onGetCallLogData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId}
            setStatusId={setStatusId}
          />
        ) : selectedView == 'Visitors' ? (
          <VisitorList
            searchBreak={searchVisitor}
            setSearchBreak={setSearchVisitor}
            allData={visitorList}
            onGetData={onGetVisitorData}
            totalPage={visitorPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            statusId={statusId1}
            setStatusId={setStatusId1}
          />
        ) : selectedView == 'Postal Receives' ? (
          <PostalReceiveList
            searchBreak={searchReceive}
            setSearchBreak={setSearchReceive}
            allData={receiveList}
            onGetData={onGetReceiveData}
            totalPage={receivePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
          />
        ) : (
          selectedView == 'Postal Dispatches' && (
            <PostalDispatchList
              searchBreak={searchDispatch}
              setSearchBreak={setSearchDispatch}
              allData={dispatchList}
              onGetData={onGetDispatchData}
              totalPage={dispatchPage}
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

export default FrontOfficeScreen;
