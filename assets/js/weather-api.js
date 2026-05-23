// weather-api.js - API Calls

let API_KEY = '';

export function setApiKey(key) {
  API_KEY = key;
}

export function getApiKey() {
  return API_KEY;
}

export const WEATHER_CONFIG = {
  get API_KEY() {
    return API_KEY;
  },
  API_BASE: 'https://api.openweathermap.org/data/2.5',
  GEO_BASE: 'https://api.openweathermap.org/geo/1.0',
};

export async function fetchWeatherByCoords(lat, lon) {
  if (!API_KEY) throw new Error('API key not set');
  const url = `${WEATHER_CONFIG.API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);
  return response.json();
}

export async function fetchForecastByCoords(lat, lon) {
  if (!API_KEY) throw new Error('API key not set');
  const url = `${WEATHER_CONFIG.API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Forecast fetch failed: ${response.status}`);
  return response.json();
}

export async function fetchAirPollution(lat, lon) {
  if (!API_KEY) throw new Error('API key not set');
  const url = `${WEATHER_CONFIG.API_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) return null;
  return response.json();
}

export async function geocodeCity(cityName) {
  if (!API_KEY) throw new Error('API key not set');

  const url = `${WEATHER_CONFIG.GEO_BASE}/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error('Geocoding failed');
  const data = await response.json();
  if (!data.length) throw new Error('City not found. Please check the spelling.');

  const normalizedQuery = cityName.trim().toLowerCase();

  let bestMatch = data.find(item => item.name.toLowerCase() === normalizedQuery);

  if (!bestMatch) {
    bestMatch = data.find(item =>
      item.name.toLowerCase().includes(normalizedQuery) ||
      normalizedQuery.includes(item.name.toLowerCase())
    );
  }

  if (!bestMatch) {
    bestMatch = data[0];
    console.warn(`Exact match not found for "${cityName}", using first result: ${bestMatch.name}`);
  }

  return {
    lat: bestMatch.lat,
    lon: bestMatch.lon,
    name: bestMatch.name,
    country: bestMatch.country
  };
}

export async function fetchAllData(lat, lon) {
  const [weather, forecast, airPollution] = await Promise.all([
    fetchWeatherByCoords(lat, lon),
    fetchForecastByCoords(lat, lon),
    fetchAirPollution(lat, lon),
  ]);
  return { weather, forecast, airPollution };
}

export async function validateApiKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
    return false;
  }
  const testUrl = `https://api.openweathermap.org/data/2.5/weather?q=Gaza&appid=${apiKey}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(testUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return data.cod === 200;
    }
    if (res.status === 401) {
      return false; // Invalid API key
    }
    return false;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Network timeout. Check your connection.');
    throw new Error(`Validation failed: ${err.message}`);
  }
}
