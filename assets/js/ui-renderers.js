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

export function renderForecastGrid(forecast, timezoneOffset, units) {
  const dailyMap = {};
  forecast.list.forEach(item => {
    const dayKey = formatDay(item.dt, timezoneOffset);
    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = { temps: [], icons: [], dt: item.dt };
    }
    dailyMap[dayKey].temps.push(item.main.temp);
    dailyMap[dayKey].icons.push(item.weather[0].id);
  });

  const days = Object.entries(dailyMap).slice(0, 5);
  DOM.forecastGrid.innerHTML = days.map(([day, data]) => {
    const high = formatTemp(Math.max(...data.temps), units);
    const low = formatTemp(Math.min(...data.temps), units);
    const icon = getWeatherEmoji(data.icons[Math.floor(data.icons.length / 2)], true);
    return `
      <div class="forecast-card">
        <div class="forecast-day">${day}</div>
        <div class="forecast-icon">${icon}</div>
        <span class="forecast-high">${high}°</span>
        <span class="forecast-low">${low}°</span>
      </div>
    `;
  }).join('');
}

export function renderHighlights(weather, units) {
  const windDeg = weather.wind.deg || 0;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const windDir = directions[Math.round(windDeg / 45) % 8];

  const highlights = [
    { label: 'Wind Direction', value: windDir, sub: `${windDeg}°`, icon: '🧭' },
    { label: 'Humidity', value: `${weather.main.humidity}%`, sub: weather.main.humidity > 60 ? 'Slightly humid' : 'Comfortable', icon: '💧' },
    { label: 'Pressure', value: `${weather.main.pressure} hPa`, sub: weather.main.pressure > 1013 ? 'High pressure' : 'Low pressure', icon: '📐' },
    { label: 'Visibility', value: `${convertVisibility(weather.visibility, units)} ${getVisibilityUnit(units)}`, sub: weather.visibility > 8000 ? 'Good visibility' : 'Reduced visibility', icon: '👀' },
  ];

  DOM.highlightsGrid.innerHTML = highlights.map(h => `
    <div class="highlight-card">
      <div style="font-size:2rem;">${h.icon}</div>
      <div class="highlight-label">${h.label}</div>
      <div class="highlight-value">${h.value}</div>
      <div class="highlight-sub">${h.sub}</div>
    </div>
  `).join('');
}

export function renderSunriseSunset(weather) {
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset = formatTime(weather.sys.sunset, weather.timezone);
  DOM.sunriseTime.textContent = sunrise;
  DOM.sunsetTime.textContent = sunset;

  const now = weather.dt + weather.timezone;
  const sunriseSec = weather.sys.sunrise + weather.timezone;
  const sunsetSec = weather.sys.sunset + weather.timezone;
  const dayLength = sunsetSec - sunriseSec;

  if (dayLength <= 0) {
    DOM.sunDot.style.display = 'none';
    return;
  }
  DOM.sunDot.style.display = 'block';

  if (now >= sunriseSec && now <= sunsetSec) {
    const progress = (now - sunriseSec) / dayLength;
    const leftPercent = 5 + progress * 90;
    DOM.sunDot.style.left = `${leftPercent}%`;
    DOM.sunDot.style.opacity = '1';
  } else if (now < sunriseSec) {
    DOM.sunDot.style.left = '5%';
    DOM.sunDot.style.opacity = '0.4';
  } else {
    DOM.sunDot.style.left = '95%';
    DOM.sunDot.style.opacity = '0.4';
  }
}

export function renderAirQuality(airPollution) {
  if (!airPollution || !airPollution.list || !airPollution.list.length) {
    DOM.airQualitySection.style.display = 'none';
    return;
  }
  DOM.airQualitySection.style.display = 'block';
  const aqi = airPollution.list[0].main.aqi;
  const components = airPollution.list[0].components;
  const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  const aqiClasses = ['', 'aqi-good', 'aqi-moderate', 'aqi-unhealthy', 'aqi-bad', 'aqi-bad'];

  DOM.aqiBadge.textContent = `AQI: ${aqi} — ${aqiLabels[aqi]}`;
  DOM.aqiBadge.className = `aqi-badge ${aqiClasses[aqi] || 'aqi-moderate'}`;
  DOM.aqiDescription.textContent = `Air quality is ${aqiLabels[aqi].toLowerCase()}. ${aqi <= 2 ? 'Conditions are good for outdoor activities.' : 'Sensitive groups should take precautions.'}`;

  const compData = [
    { label: 'PM2.5', value: components.pm2_5?.toFixed(1) || '—', unit: 'µg/m³' },
    { label: 'PM10', value: components.pm10?.toFixed(1) || '—', unit: 'µg/m³' },
    { label: 'CO', value: components.co?.toFixed(0) || '—', unit: 'µg/m³' },
    { label: 'NO₂', value: components.no2?.toFixed(1) || '—', unit: 'µg/m³' },
    { label: 'O₃', value: components.o3?.toFixed(1) || '—', unit: 'µg/m³' },
  ];

  DOM.aqiComponents.innerHTML = compData.map(c => `
    <div style="text-align:center;padding:8px;background:rgba(255,255,255,0.02);border-radius:10px;">
      <div style="font-size:0.7rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;">${c.label}</div>
      <div style="font-weight:600;color:var(--text-primary);font-size:1rem;">${c.value}</div>
      <div style="font-size:0.65rem;color:var(--text-tertiary);">${c.unit}</div>
    </div>
  `).join('');
}
