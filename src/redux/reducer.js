export const FETCH_USER_DATA = 'FETCH_USER_DATA';
export const FETCH_DOCTOR_DATA = 'FETCH_DOCTOR_DATA';
export const FETCH_DEPARTMENT_DATA = 'FETCH_DEPARTMENT_DATA';
export const FETCH_BLOOD_DATA = 'FETCH_BLOOD_DATA';
export const FETCH_ROLE_DATA = 'FETCH_ROLE_DATA';
export const FETCH_DASHBOARD_DATA = 'FETCH_DASHBOARD_DATA';
export const FETCH_BED_TYPE_DATA = 'FETCH_BED_TYPE_DATA';
export const FETCH_BED_DATA = 'FETCH_BED_DATA';
export const FETCH_BLOOD_DONOR = 'FETCH_BLOOD_DONOR';
export const FETCH_ALL_USER_DATA = 'FETCH_ALL_USER_DATA';
export const FETCH_ACCOUNT_DATA = 'FETCH_ACCOUNT_DATA';
export const FETCH_CASE_DATA = 'FETCH_CASE_DATA';
export const FETCH_CHARGE_CATEGORY_DATA = 'FETCH_CHARGE_CATEGORY_DATA';
export const FETCH_CHARGE_DATA = 'FETCH_CHARGE_DATA';
export const FETCH_ADMISSION_DATA = 'FETCH_ADMISSION_DATA';
export const FETCH_ROLE_PERMISSION = 'FETCH_ROLE_PERMISSION';

export const fetchUserData = user_data => {
  return {
    type: FETCH_USER_DATA,
    payload: user_data,
  };
};

export const fetchDoctorData = doctorData => {
  return {
    type: FETCH_DOCTOR_DATA,
    payload: doctorData,
  };
};

export const fetchDepartmentData = departmentData => {
  return {
    type: FETCH_DEPARTMENT_DATA,
    payload: departmentData,
  };
};

export const fetchBloodData = bloodData => {
  return {
    type: FETCH_BLOOD_DATA,
    payload: bloodData,
  };
};

export const fetchRoleData = roleData => {
  return {
    type: FETCH_ROLE_DATA,
    payload: roleData,
  };
};

export const fetchRolePermission = rolePermission => {
  return {
    type: FETCH_ROLE_PERMISSION,
    payload: rolePermission,
  };
};

export const fetchDashboardData = dashboardData => {
  return {
    type: FETCH_DASHBOARD_DATA,
    payload: dashboardData,
  };
};

export const fetchBedTypeData = bedTypeData => {
  return {
    type: FETCH_BED_TYPE_DATA,
    payload: bedTypeData,
  };
};

export const fetchBedData = bedData => {
  return {
    type: FETCH_BED_DATA,
    payload: bedData,
  };
};

export const fetchBloodDonorData = bloodDonor => {
  return {
    type: FETCH_BLOOD_DONOR,
    payload: bloodDonor,
  };
};

export const fetchAllUserData = allUserData => {
  return {
    type: FETCH_ALL_USER_DATA,
    payload: allUserData,
  };
};

export const fetchAccountData = accountData => {
  return {
    type: FETCH_ACCOUNT_DATA,
    payload: accountData,
  };
};

export const fetchCaseData = caseData => {
  return {
    type: FETCH_CASE_DATA,
    payload: caseData,
  };
};

export const fetchChargeCategoryData = chargeCategoryData => {
  return {
    type: FETCH_CHARGE_CATEGORY_DATA,
    payload: chargeCategoryData,
  };
};

export const fetchChargeData = chargeData => {
  return {
    type: FETCH_CHARGE_DATA,
    payload: chargeData,
  };
};

export const fetchAdmissionData = admissionData => {
  return {
    type: FETCH_ADMISSION_DATA,
    payload: admissionData,
  };
};

// Initial State
const initialState = {
  user_data: [],
  doctorData: [],
  departmentData: [],
  bloodData: [],
  roleData: [],
  dashboardData: [],
  bedTypeData: [],
  bedData: [],
  bloodDonor: [],
  allUserData: [],
  accountData: [],
  caseData: [],
  chargeCategoryData: [],
  chargeData: [],
  admissionData: [],
  rolePermission: null,
};

// Reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_DATA:
      return {
        ...state,
        user_data: action.payload,
      };
    case FETCH_DOCTOR_DATA:
      return {
        ...state,
        doctorData: action.payload,
      };
    case FETCH_DEPARTMENT_DATA:
      return {
        ...state,
        departmentData: action.payload,
      };
    case FETCH_BLOOD_DATA:
      return {
        ...state,
        bloodData: action.payload,
      };
    case FETCH_ROLE_DATA:
      return {
        ...state,
        roleData: action.payload,
      };
    case FETCH_ROLE_PERMISSION:
      return {
        ...state,
        rolePermission: action.payload,
      };
    case FETCH_DASHBOARD_DATA:
      return {
        ...state,
        dashboardData: action.payload,
      };
    case FETCH_BED_TYPE_DATA:
      return {
        ...state,
        bedTypeData: action.payload,
      };
    case FETCH_BED_DATA:
      return {
        ...state,
        bedData: action.payload,
      };
    case FETCH_BLOOD_DONOR:
      return {
        ...state,
        bloodDonor: action.payload,
      };
    case FETCH_ALL_USER_DATA:
      return {
        ...state,
        allUserData: action.payload,
      };
    case FETCH_ACCOUNT_DATA:
      return {
        ...state,
        accountData: action.payload,
      };
    case FETCH_CASE_DATA:
      return {
        ...state,
        caseData: action.payload,
      };
    case FETCH_CHARGE_CATEGORY_DATA:
      return {
        ...state,
        chargeCategoryData: action.payload,
      };
    case FETCH_CHARGE_DATA:
      return {
        ...state,
        chargeData: action.payload,
      };
    case FETCH_ADMISSION_DATA:
      return {
        ...state,
        admissionData: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
