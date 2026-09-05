/**
 * Utility functions and session management for Admin Authentication.
 */

const TOKEN_KEY = 'browtiful_admin_token';
const USER_KEY = 'browtiful_admin_user';

export const setAdminSession = (token, adminUser) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
  if (adminUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
  }
};

export const getAdminToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAdminUser = () => {
  const user = localStorage.getItem(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAdminAuthenticated = () => {
  const token = getAdminToken();
  if (!token) return false;

  // Basic check for JWT expiration
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    // If decoding fails, check token existence
    return !token;
  }
};

export const getAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
