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

export function renderHero(weather, units) {
  const condition = getWeatherCondition(weather.weather[0].id);
  const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
  state.weatherCondition = condition;
  updateAccentColor(condition);

  DOM.heroIcon.textContent = getWeatherEmoji(weather.weather[0].id, isDay);
  DOM.heroCity.textContent = `${weather.name}, ${weather.sys.country || ''}`;
  DOM.heroDate.textContent = formatDate(weather.dt, weather.timezone);
  DOM.heroTemp.innerHTML = `${formatTemp(weather.main.temp, units)}<sup>°</sup>`;
  DOM.heroCondition.textContent = weather.weather[0].description;
  DOM.heroFeelsLike.textContent = `Feels like ${formatTemp(weather.main.feels_like, units)}°${units === 'metric' ? 'C' : 'F'}`;
}
