// key-manager.js - API Key Management

import { validateApiKey, setApiKey } from './weather-api.js'

const STORAGE_KEY = 'atmospheric_api_key';

// DOM Elements
const modal = document.getElementById('apiKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveBtn = document.getElementById('saveApiKeyBtn');
const errorMsgDiv = document.getElementById('apiKeyErrorMsg');

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

export function setupKeyModalHandlers(onSuccess) {
  if (!saveBtn) return;

  // Modal click outside to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideApiKeyModal();
    });
  }

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.style.display === 'flex') {
      hideApiKeyModal();
    }
  });

  // Save button handler
  saveBtn.addEventListener('click', async () => {
    const rawKey = apiKeyInput.value.trim();
    if (!rawKey) {
      if (errorMsgDiv) {
        errorMsgDiv.innerHTML = '<div class="key-error">🔐 Please enter an API key.</div>';
      }
      return;
    }

    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-small"></span> Validating...';
    saveBtn.disabled = true;

    const result = await validateAndSaveApiKey(rawKey);

    if (result.success) {
      hideApiKeyModal();
      if (onSuccess) onSuccess();
    } else {
      if (errorMsgDiv) {
        errorMsgDiv.innerHTML = `<div class="key-error">❌ ${result.error}</div>`;
      }
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
    }
  });

  // Enter key handler
  if (apiKeyInput) {
    apiKeyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') saveBtn.click();
    });
  }
}