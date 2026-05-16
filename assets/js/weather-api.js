// weather-api.js - API Calls

export const WEATHER_CONFIG = {
  API_KEY: 'YOUR_API_KEY_HERE',
  API_BASE: 'https://api.openweathermap.org/data/2.5',
  GEO_BASE: 'https://api.openweathermap.org/geo/1.0',
};

// Production warning for exposed API key
if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
  console.warn('⚠️ Production: API key exposed! Use a backend proxy.');
}

export async function fetchWeatherByCoords(lat, lon) {
  const url = `${WEATHER_CONFIG.API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_CONFIG.API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
  return response.json();
}

export async function fetchForecastByCoords(lat, lon) {
  const url = `${WEATHER_CONFIG.API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_CONFIG.API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast fetch failed: ${response.status}`);
  return response.json();
}

export async function fetchAirPollution(lat, lon) {
  const url = `${WEATHER_CONFIG.API_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_CONFIG.API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

export async function geocodeCity(cityName) {
  const url = `${WEATHER_CONFIG.GEO_BASE}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${WEATHER_CONFIG.API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Geocoding failed');
  const data = await response.json();
  if (!data.length) throw new Error('City not found. Please check the spelling.');
  return { lat: data[0].lat, lon: data[0].lon, name: data[0].name, country: data[0].country };
}

export async function fetchAllData(lat, lon) {
  const [weather, forecast, airPollution] = await Promise.all([
    fetchWeatherByCoords(lat, lon),
    fetchForecastByCoords(lat, lon),
    fetchAirPollution(lat, lon),
  ]);
  return { weather, forecast, airPollution };
}
