// key-manager.js - API Key Management

import { validateApiKey, setApiKey } from './weather-api.js'

const STORAGE_KEY = 'atmospheric_api_key';

// DOM Elements
const modal = document.getElementById('apiKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const errorMsgDiv = document.getElementById('apiKeyErrorMsg');

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

export function showApiKeyModal(errorMsg = '') {
  if (modal) {
    modal.style.display = 'flex';
    if (errorMsgDiv) {
      errorMsgDiv.innerHTML = errorMsg ? `<div class="key-error">⚠️ ${errorMsg}</div>` : '';
    }
    if (apiKeyInput) {
      apiKeyInput.value = '';
      apiKeyInput.focus();
    }
  }
}

export function hideApiKeyModal() {
  if (modal) {
    modal.style.display = 'none';
  }
}

export async function validateAndSaveApiKey(apiKey) {
  const trimmedKey = apiKey.trim();

  if (!trimmedKey || trimmedKey.length < 32) {
    return { success: false, error: 'API key seems too short. Please check and try again.' };
  }

  try {
    const isValid = await validateApiKey(trimmedKey);
    if (isValid) {
      saveApiKey(trimmedKey);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid API key. Please get a valid key from OpenWeatherMap.' };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}