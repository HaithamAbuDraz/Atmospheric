// ui-renderers.js - DOM Updates

import {
  formatDate, formatTime, formatHour, formatDay,
  formatTemp, convertTemp, convertWindSpeed, convertVisibility,
  getWindUnit, getVisibilityUnit, getWeatherEmoji, getWeatherCondition,
  getAccentColor, hexToRGBA
} from './utils.js';

let DOM = {};
let state = { units: 'metric', weatherCondition: 'Clear' };
let chartInstance = null;

export function setDOMReferences(refs) {
  DOM = refs;
}

export function setState(newState) {
  state = { ...state, ...newState };
}

export function updateAccentColor(condition) {
  const accent = getAccentColor(condition);
  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-glow', hexToRGBA(accent, 0.4));
  document.documentElement.style.setProperty('--accent-soft', hexToRGBA(accent, 0.18));
}

