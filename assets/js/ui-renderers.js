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

let DOM = {};
let state = { units: 'metric', weatherCondition: 'Clear' };
let chartInstance = null;

export function setDOMReferences(refs) {
  DOM = refs;
}

export function setState(newState) {
  state = { ...state, ...newState };
}

