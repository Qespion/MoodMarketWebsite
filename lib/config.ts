export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://iw0g4808sw8ks4oco0k4gwsg.158.69.200.14.sslip.io/api';

// Check if we're in build time
export const IS_BUILD_TIME = process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;
