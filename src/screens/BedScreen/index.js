import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
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
import ManualList from '../../components/BillingComponent/ManualList';
import BedTypeList from '../../components/BedComponent/BedTypeList';
import BedList from '../../components/BedComponent/BedList';
import BedAssignList from '../../components/BedComponent/BedAssignList';
import {
  onGetBedApi,
  onGetBedAssignApi,
  onGetBedTypeApi,
} from '../../services/Api';

const allData = [
  {
    id: 1,
    name: 'Super Deluxe1',
  },
  {
    id: 2,
    name: 'Intensive',
  },
  {
    id: 3,
    name: 'Test Bed M3T',
  },
  {
    id: 4,
    name: 'Single',
  },
  {
    id: 5,
    name: 'YoloHealth',
  },
];

const BedData = [
  {
    id: 1,
    bed: 10,
    bed_id: 'N2JY0SK7',
    bed_type: 'Intensive',
    available: 'Yes',
    charge: '$1,000.00',
  },
  {
    id: 2,
    bed: 4,
    bed_id: 'N2JY0SK5',
    bed_type: 'ICU BED',
    available: 'Yes',
    charge: '$1,000.00',
  },
  {
    id: 3,
    bed: 5,
    bed_id: 'N2JY0SK5',
    bed_type: 'GENERAL WARD',
    available: 'Yes',
    charge: '$1,000.00',
  },
  {
    id: 4,
    bed: 8,
    bed_id: 'N2JY0SK5',
    bed_type: 'Delux',
    available: 'Yes',
    charge: '$1,000.00',
  },
  {
    id: 5,
    bed: 11,
    bed_id: 'N2JY0SK5',
    bed_type: 'GENERAL WARD',
    available: 'Yes',
    charge: '$1,000.00',
  },
];

const BedAssignData = [
  {
    id: 1,
    invoice: 'N2JY0SK7',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    invoice_date: '26th May, 2024',
    bed: 'General ward',
    discharge: 'N/A',
    status: true,
  },
  {
    id: 2,
    invoice: 'N2JY0SK5',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    invoice_date: '21th May, 2024',
    bed: 'VIP',
    discharge: 'N/A',
    status: true,
  },
  {
    id: 3,
    invoice: 'N2JY0SK0',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    invoice_date: '20th Dec, 2023',
    bed: 'Delux',
    discharge: 'N/A',
    status: true,
  },
  {
    id: 4,
    invoice: 'N2JY0SL3',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    invoice_date: '28th May, 2024',
    bed: 'General ward',
    discharge: 'N/A',
    status: true,
  },
  {
    id: 5,
    invoice: 'N2JY0SK8',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    invoice_date: '24th May, 2024',
    bed: 'General ward',
    discharge: 'N/A',
    status: true,
  },
];

const ManualData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    approved: 'Approved',
    amount: '$1,500.00',
    status: 'Paid',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    approved: 'Approved',
    amount: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    approved: 'N/A',
    amount: '$500.00',
    status: 'Unpaid',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    approved: 'Approved',
    amount: '$1,000.00',
    status: 'Unpaid',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    approved: 'N/A',
    amount: '$1,000.00',
    status: 'Paid',
  },
];

export const BedScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [index, setIndex] = React.useState(0);

  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchPharmacists, setSearchPharmacists] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Bed Types');
  const [BedTypeData, setBedTypeData] = useState([]);
  const [bedData, setBedData] = useState([]);
  const [bedAssignData, setBedAssignData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    bedDataGet();
    bedTypeDataGet();
    bedAssignDataGet();
  }, []);

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

  const bedTypeDataGet = async () => {
    try {
      const response = await onGetBedTypeApi('created_at', 'ASC');
      console.log('get Response:', response.data.data);
      if (response.status) {
        setBedTypeData(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const bedDataGet = async () => {
    try {
      const response = await onGetBedApi();
      console.log('get Response:', response.data.data);
      if (response.status) {
        setBedData(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  const bedAssignDataGet = async () => {
    try {
      const response = await onGetBedAssignApi('created_at', 'ASC');
      console.log('get Response:', response.data.data);
      if (response.status) {
        setBedAssignData(response.data.data);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Error:', err.response.data);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.lightColor}]}>
      <View style={styles.headerView}>
        <Header
          title={t('bed_management')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Bed Types' ? (
          <BedTypeList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={BedTypeData}
            onGetBedTypeData={() => bedTypeDataGet()}
          />
        ) : selectedView == 'Beds' ? (
          <BedList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={bedData}
          />
        ) : selectedView == 'Bed Assigns' ? (
          <BedAssignList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={bedAssignData}
          />
        ) : (
          selectedView == 'Bed Status' && (
            <ManualList
              searchBreak={searchPharmacists}
              setSearchBreak={setSearchPharmacists}
              allData={ManualData}
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
            {['Logo', 'Bed Types', 'Beds', 'Bed Assigns', 'Bed Status'].map(
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
                          setSelectedView(option), toggleMenu(false);
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

export default BedScreen;
