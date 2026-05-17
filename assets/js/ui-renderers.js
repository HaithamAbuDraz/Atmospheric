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

export function renderCurrentDetails(weather, units) {
  const details = [
    { label: 'Humidity', value: `${weather.main.humidity}%`, icon: '💧' },
    { label: 'Wind', value: `${convertWindSpeed(weather.wind.speed, units).toFixed(1)} ${getWindUnit(units)}`, icon: '💨' },
    { label: 'Pressure', value: `${weather.main.pressure} hPa`, icon: '🔵' },
    { label: 'Visibility', value: `${convertVisibility(weather.visibility, units)} ${getVisibilityUnit(units)}`, icon: '👁️' },
    { label: 'Cloud Cover', value: `${weather.clouds.all}%`, icon: '☁️' },
    { label: 'Max / Min', value: `${formatTemp(weather.main.temp_max, units)}° / ${formatTemp(weather.main.temp_min, units)}°`, icon: '📊' },
  ];

  DOM.currentDetailGrid.innerHTML = details.map(d => `
    <div class="card" style="text-align:center;">
      <div style="font-size:1.8rem;margin-bottom:8px;">${d.icon}</div>
      <div class="card-value" style="font-size:1.2rem;">${d.value}</div>
      <div class="card-subtitle">${d.label}</div>
    </div>
  `).join('');
}

export function renderHourlyForecast(forecast, timezoneOffset, units) {
  const hourlyData = forecast.list.slice(0, 12);
  DOM.hourlySlider.innerHTML = hourlyData.map(item => {
    const hour = formatHour(item.dt, timezoneOffset);
    const icon = getWeatherEmoji(item.weather[0].id, true);
    const temp = formatTemp(item.main.temp, units);
    return `
      <div class="hourly-card">
        <div class="hourly-time">${hour}</div>
        <div class="hourly-icon">${icon}</div>
        <div class="hourly-temp">${temp}°</div>
      </div>
    `;
  }).join('');
}
