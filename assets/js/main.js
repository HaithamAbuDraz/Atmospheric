// main.js - App Initialization

import { fetchAllData, geocodeCity, WEATHER_CONFIG as APIConfig } from './weather-api.js';
import {
  setDOMReferences, setState, renderHero, renderCurrentDetails,
  renderHourlyForecast, renderForecastGrid, renderHighlights,
  renderSunriseSunset, renderAirQuality, renderChart
} from './ui-renderers.js';
import { initParticles, resizeCanvas, updateParticles, cleanupParticles, startParticles } from './particles.js';

// ===== CONFIGURATION =====
const APP_CONFIG = {
  DEFAULT_CITY: 'Gaza',
  UNITS: 'metric',
  MAX_RECENT_SEARCHES: 6,
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  PARTICLE_COUNT: 60,
};

// ===== STATE =====
let state = {
  units: APP_CONFIG.UNITS,
  currentWeather: null,
  forecast: null,
  airPollution: null,
  recentSearches: [],
  weatherCondition: 'Clear',
};

// ===== DOM ELEMENTS =====
const DOM = {
  loadingScreen: document.getElementById('loadingScreen'),
  appContainer: document.getElementById('appContainer'),
  toastContainer: document.getElementById('toastContainer'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  locationBtn: document.getElementById('locationBtn'),
  unitBtns: document.querySelectorAll('.unit-btn'),
  recentSearches: document.getElementById('recentSearches'),
  heroIcon: document.getElementById('heroIcon'),
  heroCity: document.getElementById('heroCity'),
  heroDate: document.getElementById('heroDate'),
  heroTemp: document.getElementById('heroTemp'),
  heroCondition: document.getElementById('heroCondition'),
  heroFeelsLike: document.getElementById('heroFeelsLike'),
  currentDetailGrid: document.getElementById('currentDetailGrid'),
  hourlySlider: document.getElementById('hourlySlider'),
  forecastGrid: document.getElementById('forecastGrid'),
  highlightsGrid: document.getElementById('highlightsGrid'),
  sunriseTime: document.getElementById('sunriseTime'),
  sunsetTime: document.getElementById('sunsetTime'),
  sunDot: document.getElementById('sunDot'),
  aqiBadge: document.getElementById('aqiBadge'),
  aqiDescription: document.getElementById('aqiDescription'),
  aqiComponents: document.getElementById('aqiComponents'),
  airQualitySection: document.getElementById('airQualitySection'),
  chartContainer: document.getElementById('chartContainer'),
  tempChartCanvas: document.getElementById('tempChart'),
  footerYear: document.getElementById('footerYear'),
  particlesCanvas: document.getElementById('particles-canvas'),
};
