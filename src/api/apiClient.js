import axios from 'axios';

function isNonEmptyString(value) {
  if (value === undefined) return false;
  if (value === null) return false;
  if (typeof value !== 'string') return false;
  if (value.trim() === '') return false;
  return true;
}

function isTokenValidJwt(token) {
  if (token === undefined) return false;
  if (token === null) return false;
  if (typeof token !== 'string') return false;
  const parts = token.split('.');
  if (!Array.isArray(parts)) return false;
  if (parts.length !== 3) return false;
  try {
    let b = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = b.length % 4;
    if (pad === 2) {
      b += '==';
    } else if (pad === 3) {
      b += '=';
    } else if (pad !== 0) {
      return false;
    }
    const decoded = atob(b);
    const obj = JSON.parse(decoded);
    if (obj === undefined) return false;
    if (obj === null) return false;
    if (obj.exp === undefined) return false;
    if (obj.exp === null) return false;
    const exp = Number(obj.exp);
    if (!Number.isFinite(exp)) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    return exp > nowSec;
  } catch {
    return false;
  }
}

let baseURL = '';
if (typeof process !== 'undefined') {
  if (process.env !== undefined) {
    if (process.env.REACT_APP_API_BASE_URL !== undefined) {
      if (process.env.REACT_APP_API_BASE_URL !== null) {
        if (typeof process.env.REACT_APP_API_BASE_URL === 'string') {
          if (process.env.REACT_APP_API_BASE_URL.trim() !== '') {
            baseURL = process.env.REACT_APP_API_BASE_URL.trim();
          }
        }
      }
    }
  }
}
if (baseURL === '') {
  baseURL = 'http://localhost:5000/api';
}

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      let token = null;
      try {
        const stored = localStorage.getItem('token');
        if (isNonEmptyString(stored)) {
          token = stored.trim();
        }
      } catch {
        token = null;
      }
      if (token !== null) {
        const valid = isTokenValidJwt(token);
        if (valid === true) {
          if (config.headers !== undefined && config.headers !== null) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errMsg = 'An unknown error occurred';
    if (error !== undefined && error !== null) {
      if (error.response !== undefined && error.response !== null) {
        if (error.response.data !== undefined && error.response.data !== null) {
          if (error.response.data.message !== undefined && error.response.data.message !== null) {
            try {
              errMsg = String(error.response.data.message);
            } catch {}
          }
        }
      } else if (error.message !== undefined && error.message !== null) {
        try {
          errMsg = String(error.message);
        } catch {}
      }
    }
    const wrapped = { ...error, message: errMsg };
    return Promise.reject(wrapped);
  }
);

export default apiClient;
