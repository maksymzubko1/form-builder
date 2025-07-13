export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET: '/reset-password',
  RESET_TOKEN: (token: string) => `/reset-password/${token}`,
  VERIFY: '/verify',
  VERIFY_TOKEN: (token: string) => `/verify/${token}`,
  ADMIN: '/admin',
  ADMIN_FORMS: '/admin/forms',
  ADMIN_RESULTS: '/admin/results',
  ADMIN_PROFILE: '/admin/profile',
  FORM: (id: string) => `/form/${id}`,
};

export const API_ROUTES = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  FORM: (id: string) => `/api/forms/${id}`,
  CHANGE_PASSWORD: '/api/auth/change-password',
  RESET: '/api/auth/reset-password',
  RESET_TOKEN: (token: string) => `/api/auth/reset-password/${token}`,
  VERIFY: '/api/auth/verify',
  LOGOUT: `/api/auth/signout`,
};