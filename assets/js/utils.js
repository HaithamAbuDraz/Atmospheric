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