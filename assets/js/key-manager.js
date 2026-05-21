// key-manager.js - API Key Management

import { setApiKey } from './weather-api.js'

const STORAGE_KEY = 'atmospheric_api_key';

export function getStoredApiKey() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveApiKey(key) {
  try {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    return true;
  } catch {
    return false;
  }
}

export function removeStoredApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    return true;
  } catch (error) {
    console.warn('Failed to remove API key from localStorage:', error);
    return false;
  }
}