// utils.js - Helper Functions

export function formatTime(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
}

export function formatDate(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

export function formatDay(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: 'UTC'
  });
}

export function formatHour(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: 'UTC'
  });
}

export function convertTemp(kelvin, units) {
  if (units === 'metric') return kelvin - 273.15;
  return (kelvin - 273.15) * 9 / 5 + 32;
}

export function formatTemp(kelvin, units) {
  return Math.round(convertTemp(kelvin, units));
}

export function getWindUnit(units) {
  return units === 'metric' ? 'm/s' : 'mph';
}

export function convertWindSpeed(ms, units) {
  if (units === 'metric') return ms;
  return ms * 2.237;
}

export function getVisibilityUnit(units) {
  return units === 'metric' ? 'km' : 'mi';
}

export function convertVisibility(meters, units) {
  if (units === 'metric') return (meters / 1000).toFixed(1);
  return (meters / 1609.34).toFixed(1);
}

export function getWeatherEmoji(weatherId, isDay = true) {
  if (weatherId >= 200 && weatherId < 300) return '⛈️';
  if (weatherId >= 300 && weatherId < 400) return '🌦️';
  if (weatherId >= 500 && weatherId < 511) return '🌧️';
  if (weatherId === 511) return '🌨️';
  if (weatherId >= 520 && weatherId < 600) return '🌦️';
  if (weatherId >= 600 && weatherId < 700) return '❄️';
  if (weatherId >= 700 && weatherId < 800) return '🌫️';
  if (weatherId === 800) return isDay ? '☀️' : '🌙';
  if (weatherId === 801) return isDay ? '🌤️' : '🌙';
  if (weatherId === 802) return '⛅';
  if (weatherId >= 803) return '☁️';
  return '🌈';
}

export function getWeatherCondition(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return 'Thunderstorm';
  if (weatherId >= 300 && weatherId < 500) return 'Drizzle';
  if (weatherId >= 500 && weatherId < 600) return 'Rain';
  if (weatherId >= 600 && weatherId < 700) return 'Snow';
  if (weatherId >= 700 && weatherId < 800) return 'Mist';
  if (weatherId === 800) return 'Clear';
  if (weatherId >= 801) return 'Clouds';
  return 'Clear';
}

export function getAccentColor(condition) {
  const colors = {
    'Clear': '#f5a65b',
    'Clouds': '#8da4c8',
    'Rain': '#5b8cf5',
    'Drizzle': '#6b9ef5',
    'Thunderstorm': '#7b5bf5',
    'Snow': '#b8d4f5',
    'Mist': '#8b9eb0',
  };
  return colors[condition] || '#5b9cf5';
}

export function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
