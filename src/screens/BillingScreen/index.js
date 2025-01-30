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
import {COLORS} from '../../utils';
import headerLogo from '../../images/headerLogo.png';
import {BlurView} from '@react-native-community/blur';
import PharmacistsList from '../../components/UsersComponent/PharmacistsList';
import AccountList from '../../components/BillingComponent/AccountList';
import PayrollList from '../../components/BillingComponent/PayrollList';
import InvoicesList from '../../components/BillingComponent/InvoicesList';
import PaymentList from '../../components/BillingComponent/PaymentList';
import ReportList from '../../components/BillingComponent/ReportList';
import AdvanceList from '../../components/BillingComponent/AdvanceList';
import ManualList from '../../components/BillingComponent/ManualList';
import {
  onGetAccountListApi,
  onGetCommonApi,
  onGetPayrollListApi,
} from '../../services/Api';
import BillList from '../../components/BillingComponent/BillList';
import useOrientation from '../../components/OrientationComponent';
import {useSelector} from 'react-redux';

const allData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    type: 'Credit',
    status: true,
  },
  {
    id: 2,
    name: 'Monica Geller',
    type: 'Debit',
    status: true,
  },
  {
    id: 3,
    name: 'Ross Geller',
    type: 'Debit',
    status: false,
  },
  {
    id: 4,
    name: 'Monica Geller',
    type: 'Credit',
    status: true,
  },
  {
    id: 5,
    name: 'Ross Geller',
    type: 'Debit',
    status: true,
  },
];

const accountantData = [
  {
    id: 1,
    srNo: 2,
    payroll: 'N2JY0SK7',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    month: 'Aug',
    year: 2023,
    salary: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 2,
    srNo: 4,
    payroll: 'N2JY0SK5',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 3,
    srNo: 5,
    payroll: 'N2JY0SK0',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 4,
    srNo: 8,
    payroll: 'N2JY0SL3',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Unpaid',
  },
  {
    id: 5,
    srNo: 9,
    payroll: 'N2JY0SK8',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    month: 'May',
    year: 2024,
    salary: '$1,000.00',
    status: 'Paid',
  },
];

const InvoiceData = [
  {
    id: 1,
    invoice: 'N2JY0SK7',
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    invoice_date: '26th May, 2024',
    amount: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 2,
    invoice: 'N2JY0SK5',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    invoice_date: '21th May, 2024',
    amount: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 3,
    invoice: 'N2JY0SK0',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    invoice_date: '20th Dec, 2023',
    amount: '$1,000.00',
    status: 'Paid',
  },
  {
    id: 4,
    invoice: 'N2JY0SL3',
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    invoice_date: '28th May, 2024',
    amount: '$1,000.00',
    status: 'Unpaid',
  },
  {
    id: 5,
    invoice: 'N2JY0SK8',
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    invoice_date: '24th May, 2024',
    amount: '$1,000.00',
    status: 'Paid',
  },
];

const PaymentData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    payment_date: '26th May, 2024',
    pay: 'Jack',
    amount: '$1,500.00',
  },
  {
    id: 2,
    name: 'Monica Geller',
    payment_date: '21th May, 2024',
    pay: 'Tick',
    amount: '$1,000.00',
  },
  {
    id: 3,
    name: 'Ross Geller',
    payment_date: '20th Dec, 2023',
    pay: 'John',
    amount: '$500.00',
  },
  {
    id: 4,
    name: 'Monica Geller',
    payment_date: '28th May, 2024',
    pay: 'Bella',
    amount: '$1,000.00',
  },
  {
    id: 5,
    name: 'Ross Geller',
    payment_date: '24th May, 2024',
    pay: 'Bella',
    amount: '$1,000.00',
  },
];

const PharmacistsData = [
  {
    id: 1,
    name: 'Joey Tribiyani',
    mail: 'joey@gmail.com',
    status: true,
    blood: 'N/A',
  },
  {
    id: 2,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    blood: 'O+',
  },
  {
    id: 3,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    blood: 'N/A',
  },
  {
    id: 4,
    name: 'Monica Geller',
    mail: 'monica@gmail.com',
    status: true,
    blood: 'AB-',
  },
  {
    id: 5,
    name: 'Ross Geller',
    mail: 'ross@gmail.com',
    status: false,
    blood: 'A+',
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

let arrayData = [
  'Logo',
  'Accounts',
  'Employee Payrolls',
  'Invoices',
  'Payments',
  'Payment Reports',
  'Advance Payments',
  'Bills',
  'Manual Billing Payments',
];

export const BillingScreen = ({navigation}) => {
  const rolePermission = useSelector(state => state.rolePermission);
  const {t} = useTranslation();
  const {theme} = useTheme();
  const orientation = useOrientation(); // Get current orientation
  const isPortrait = orientation === 'portrait';
  const styles = isPortrait ? portraitStyles : landscapeStyles;
  const [index, setIndex] = React.useState(0);

  const [searchAccount, setSearchAccount] = useState('');
  const [searchPayroll, setSearchPayroll] = useState('');
  const [searchPayment, setSearchPayment] = useState('');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searchReport, setSearchReport] = useState('');
  const [searchAdvance, setSearchAdvance] = useState('');
  const [searchBill, setSearchBill] = useState('');
  const [searchManualBill, setSearchManualBill] = useState('');
  const [optionModalView, setOptionModalView] = useState(false);
  const [selectedView, setSelectedView] = useState('Accounts');
  const [accountList, setAccountList] = useState([]);
  const [payrollList, setPayrollList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [advancePaymentList, setAdvancePaymentList] = useState([]);
  const [billList, setBillList] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const [manualListData, setManualListData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [pageCount, setPageCount] = useState('1');
  const [totalPage, setTotalPage] = useState('1');
  const [payrollPage, setPayrollPage] = useState('1');
  const [invoicePage, setInvoicePage] = useState('1');
  const [paymentPage, setPaymentPage] = useState('1');
  const [reportPage, setReportPage] = useState('1');
  const [advancePage, setAdvancePage] = useState('1');
  const [billPage, setBillPage] = useState('1');
  const [manualPage, setManualPage] = useState('1');
  const [statusId, setStatusId] = useState(1);
  const [payrollStatusId, setPayrollStatusId] = useState(1);
  const [paymentStatusId, setPaymentStatusId] = useState(1);
  const [typeId, setTypeId] = useState(1);
  const [accountAction, setAccountAction] = useState([]);
  const [payrollAction, setPayrollAction] = useState([]);
  const [invoiceAction, setInvoiceAction] = useState([]);
  const [paymentAction, setPaymentAction] = useState([]);
  const [reportAction, setReportAction] = useState([]);
  const [advanceAction, setAdvanceAction] = useState([]);
  const [billAction, setBillAction] = useState([]);
  const [manualAction, setManualAction] = useState([]);

  useEffect(() => {
    const visibility = {
      accountVisible: false,
      payrollVisible: false,
      invoiceVisible: false,
      paymentVisible: false,
      reportVisible: false,
      advanceVisible: false,
      billVisible: false,
      manualVisible: false,
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
      if (item.main_module === 'Billings') {
        processPrivileges(
          item.privileges,
          'accounts',
          setAccountAction,
          'accountVisible',
        );
        processPrivileges(
          item.privileges,
          'employee_payrolls',
          setPayrollAction,
          'payrollVisible',
        );
        processPrivileges(
          item.privileges,
          'invoices',
          setInvoiceAction,
          'invoiceVisible',
        );
        processPrivileges(
          item.privileges,
          'payments',
          setPaymentAction,
          'paymentVisible',
        );
        processPrivileges(
          item.privileges,
          'payment_reports',
          setReportAction,
          'reportVisible',
        );
        processPrivileges(
          item.privileges,
          'advance_payments',
          setAdvanceAction,
          'advanceVisible',
        );
        processPrivileges(
          item.privileges,
          'bills',
          setBillAction,
          'billVisible',
        );
        processPrivileges(
          item.privileges,
          'manual_billing_payments',
          setManualAction,
          'manualVisible',
        );
        // Handle arrayData based on visibility
        const {
          accountVisible,
          payrollVisible,
          invoiceVisible,
          paymentVisible,
          reportVisible,
          advanceVisible,
          billVisible,
          manualVisible,
        } = visibility;
        console.log('Get Value::::>>>', visibility);
        arrayData = [
          'Logo',
          accountVisible && 'accounts',
          payrollVisible && 'employee_payrolls',
          invoiceVisible && 'invoices',
          paymentVisible && 'payments',
          reportVisible && 'payment_reports',
          advanceVisible && 'advance_payments',
          billVisible && 'bills',
          manualVisible && 'manual_billing_payments',
        ].filter(Boolean);
      }
    });
  }, [rolePermission]);

  const animations = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(300)),
  ).current;
  const opacities = useRef(
    [0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => new Animated.Value(0)),
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
    onGetAccountData();
  }, [searchAccount, pageCount]);

  const onGetAccountData = async () => {
    try {
      let urlData = `account-get?search=${searchAccount}&page=${pageCount}${
        statusId == 2 ? '&active=1' : statusId == 3 ? '&deactive=0' : ''
      }`;
      const response = await onGetCommonApi(urlData);
      console.log('GetAccountData>>', response.data.data);
      if (response.status == 200) {
        setAccountList(response.data.data);
        setTotalPage(response.data.recordsTotal);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetPayrollData();
  }, [searchPayroll, pageCount, payrollStatusId]);

  const onGetPayrollData = async () => {
    try {
      let urlData = `emplloyee-payroll-get?search=${searchPayroll}&page=${pageCount}${
        payrollStatusId == 2
          ? '&paid=1'
          : payrollStatusId == 3
          ? '&unpaid=0'
          : ''
      }`;
      const response = await onGetCommonApi(urlData);
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setPayrollList(response.data.data.items);
        setPayrollPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetPaymentData();
  }, [searchPayment, pageCount]);

  const onGetPaymentData = async () => {
    try {
      const response = await onGetCommonApi(
        `bill-payment-get?search=${searchPayment}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setPaymentList(response.data.data.items);
        setPaymentPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetAdvancePaymentData();
  }, [searchAdvance, pageCount]);

  const onGetAdvancePaymentData = async () => {
    try {
      const response = await onGetCommonApi(
        `advance-payment-get?search=${searchAdvance}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setAdvancePaymentList(response.data.data.items);
        setAdvancePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetBillData();
  }, [searchBill, pageCount]);

  const onGetBillData = async () => {
    try {
      const response = await onGetCommonApi(
        `bills-get?search=${searchBill}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setBillList(response.data.data.items);
        setBillPage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetInvoiceData();
  }, [searchInvoice, pageCount]);

  const onGetInvoiceData = async () => {
    try {
      const response = await onGetCommonApi(
        `invoice-get?search=${searchInvoice}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setInvoiceList(response.data.data.items);
        setInvoicePage(response.data.data.pagination.last_page);
        setRefresh(!refresh);
      }
    } catch (err) {
      console.log('Get AccountError>', err.response.data);
    }
  };

  useEffect(() => {
    onGetManualBillData();
  }, [searchManualBill, pageCount]);

  const onGetManualBillData = async () => {
    try {
      const response = await onGetCommonApi(
        `manual-bills-get?search=${searchManualBill}&page=${pageCount}`,
      );
      console.log('GetAccountData>>', response.data.data);
      if (response.data.flag == 1) {
        setManualListData(response.data.data.items);
        setManualPage(response.data.data.pagination.last_page);
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
          title={t('billing')}
          navigation={navigation}
          onPress={() => navigation.openDrawer()}
          moreButtonClick={() => toggleMenu(true)}
        />
      </View>
      <View style={styles.mainView}>
        {selectedView == 'Accounts' ? (
          <AccountList
            searchBreak={searchAccount}
            setSearchBreak={setSearchAccount}
            allData={accountList}
            onGetData={onGetAccountData}
            totalPage={totalPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            setStatusId={setStatusId}
            statusId={statusId}
            setTypeId={setTypeId}
            typeId={typeId}
            accountAction={accountAction}
          />
        ) : selectedView == 'Employee Payrolls' ? (
          <PayrollList
            searchBreak={searchPayroll}
            setSearchBreak={setSearchPayroll}
            allData={payrollList}
            onGetData={onGetPayrollData}
            totalPage={payrollPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            setStatusId1={setPayrollStatusId}
            statusId1={payrollStatusId}
            payrollAction={payrollAction}
          />
        ) : selectedView == 'Invoices' ? (
          <InvoicesList
            searchBreak={searchInvoice}
            setSearchBreak={setSearchInvoice}
            allData={invoiceList}
            onGetData={onGetInvoiceData}
            totalPage={invoicePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            account={accountList}
            invoiceAction={invoiceAction}
          />
        ) : selectedView == 'Payments' ? (
          <PaymentList
            searchBreak={searchPayment}
            setSearchBreak={setSearchPayment}
            allData={paymentList}
            onGetData={onGetPaymentData}
            totalPage={paymentPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            paymentAction={paymentAction}
          />
        ) : selectedView == 'Payment Reports' ? (
          <ReportList
            searchBreak={searchReport}
            setSearchBreak={setSearchReport}
            allData={paymentList}
            onGetData={onGetPaymentData}
            totalPage={paymentPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            setStatusId={setPaymentStatusId}
            statusId={paymentStatusId}
            reportAction={reportAction}
          />
        ) : selectedView == 'Advance Payments' ? (
          <AdvanceList
            searchBreak={searchAdvance}
            setSearchBreak={setSearchAdvance}
            allData={advancePaymentList}
            onGetData={onGetAdvancePaymentData}
            totalPage={advancePage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            advanceAction={advanceAction}
          />
        ) : selectedView == 'Bills' ? (
          <BillList
            searchBreak={searchBill}
            setSearchBreak={setSearchBill}
            allData={billList}
            onGetData={onGetBillData}
            totalPage={billPage}
            pageCount={pageCount}
            setPageCount={setPageCount}
            billAction={billAction}
          />
        ) : (
          selectedView == 'Manual Billing Payments' && (
            <ManualList
              searchBreak={searchManualBill}
              setSearchBreak={setSearchManualBill}
              allData={manualListData}
              totalPage={manualPage}
              pageCount={pageCount}
              setPageCount={setPageCount}
              manualAction={manualAction}
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

export default BillingScreen;
