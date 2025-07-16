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
  ADMIN_FORMS_CREATE: '/admin/forms/new',
  ADMIN_RESULTS: '/admin/results',
  ADMIN_PROFILE: '/admin/profile',
  FORM: (id: string) => `/form/${id}`,

  ADMIN_FORM_SUBMISSIONS: (formId: string) => `/admin/forms/${formId}/submissions`,
  ADMIN_FORM_SUBMISSION_DETAILS: (formId: string, submissionId: string) =>
    `/admin/forms/${formId}/submissions/${submissionId}`,

  ADMIN_FORM_INSIGHTS: (formId: string) => `/admin/forms/${formId}/insights`,
  ADMIN_FORM_PREVIEW: (formId: string) => `/admin/forms/${formId}/preview`,
};

export const API_ROUTES = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  CHANGE_PASSWORD: '/api/auth/change-password',
  RESET: '/api/auth/reset-password',
  RESET_TOKEN: (token: string) => `/api/auth/reset-password/${token}`,
  VERIFY: '/api/auth/verify',
  LOGOUT: `/api/auth/signout`,

  FORMS: '/api/forms',
  FORM: (id: string) => `/api/forms/${id}`,

  PUBLIC_FORMS: '/api/public-forms',
  FORM_VIEW: (id: string) => `/api/public-forms/${id}/view`,
  PUBLIC_FORMS_DRAFT: (id: string) => `/api/public-forms/${id}/draft`,
  S3_PRESIGNED: '/api/s3-presign',

  FORM_INSIGHTS: (formId: string) => `/api/forms/${formId}/insights`,

  FORM_SUBMISSIONS: (formId: string) => `/api/forms/${formId}/submissions`,
  FORM_SUBMISSION: (formId: string, submissionId: string) =>
    `/api/forms/${formId}/submissions/${submissionId}`,
  FORM_SUBMISSIONS_EXPORT: (formId: string) => `/api/forms/${formId}/submissions/export`,
};
