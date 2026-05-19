// main.js - App Initialization

import { fetchAllData, geocodeCity, WEATHER_CONFIG as APIConfig } from './weather-api.js';
import {
  setDOMReferences, setState, renderHero, renderCurrentDetails,
  renderHourlyForecast, renderForecastGrid, renderHighlights,
  renderSunriseSunset, renderAirQuality, renderChart
} from './ui-renderers.js';
import { initParticles, resizeCanvas, updateParticles, cleanupParticles, startParticles } from './particles.js';

// Configuration
const APP_CONFIG = {
  DEFAULT_CITY: 'Gaza',
  UNITS: 'metric',
  MAX_RECENT_SEARCHES: 6,
  REFRESH_INTERVAL: 10 * 60 * 1000,
  PARTICLE_COUNT: 60,
};

// State
let state = {
  units: APP_CONFIG.UNITS,
  currentWeather: null,
  forecast: null,
  airPollution: null,
  recentSearches: [],
  weatherCondition: 'Clear',
};
