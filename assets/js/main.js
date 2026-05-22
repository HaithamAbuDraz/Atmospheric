// main.js - App Initialization with API Key Management

import { fetchAllData, geocodeCity, setApiKey, validateApiKey } from './weather-api.js';
import { getStoredApiKey, showApiKeyModal, hideApiKeyModal, setupKeyModalHandlers, saveApiKey } from './key-manager.js';
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

// ===== HELPER FUNCTIONS =====
function showLoading(show) {
  if (show) {
    DOM.loadingScreen.classList.remove('hidden');
  } else {
    DOM.loadingScreen.classList.add('hidden');
  }
}

function showToast(message, isError = true) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  if (!isError) {
    toast.style.borderColor = 'rgba(80, 255, 80, 0.4)';
    toast.style.color = '#a5fca5';
  }
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, 4000);
}

// ===== RECENT SEARCHES =====
function loadRecentSearches() {
  try {
    const stored = localStorage.getItem('atmospheric_recent');
    state.recentSearches = stored ? JSON.parse(stored) : [];
  } catch {
    state.recentSearches = [];
  }
  renderRecentSearches();
}

function saveRecentSearch(cityName) {
  const normalizedCity = cityName.toLowerCase();
  state.recentSearches = [
    cityName,
    ...state.recentSearches.filter(s => s.toLowerCase() !== normalizedCity)
  ].slice(0, APP_CONFIG.MAX_RECENT_SEARCHES);
  try {
    localStorage.setItem('atmospheric_recent', JSON.stringify(state.recentSearches));
  } catch { }
  renderRecentSearches();
}

function renderRecentSearches() {
  if (!state.recentSearches.length) {
    DOM.recentSearches.innerHTML = '';
    return;
  }
  DOM.recentSearches.innerHTML = state.recentSearches.map(city => `
    <button class="recent-tag" data-city="${city}" aria-label="Search for ${city}">${city}</button>
  `).join('');

  DOM.recentSearches.querySelectorAll('.recent-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const city = tag.dataset.city;
      DOM.searchInput.value = city;
      searchCity(city);
    });
  });
}

// ===== DATA LOADING =====
async function loadWeatherByCoords(lat, lon, cityNameForSave = null) {
  showLoading(true);
  try {
    const { weather, forecast, airPollution } = await fetchAllData(lat, lon);
    state.currentWeather = weather;
    state.forecast = forecast;
    state.airPollution = airPollution;

    // Update weather condition properly
    const condition = weather.weather[0].main;
    state.weatherCondition = condition;

    setState({ units: state.units, weatherCondition: condition });

    renderHero(weather, state.units);
    renderCurrentDetails(weather, state.units);
    renderHourlyForecast(forecast, weather.timezone, state.units);
    renderForecastGrid(forecast, weather.timezone, state.units);
    renderHighlights(weather, state.units);
    renderSunriseSunset(weather);
    renderAirQuality(airPollution);
    renderChart(forecast, weather.timezone, state.units, condition);

    if (cityNameForSave) {
      saveRecentSearch(cityNameForSave);
    } else {
      saveRecentSearch(weather.name);
    }

    updateParticles(weather.weather[0].id);
    DOM.appContainer.style.opacity = '1';
  } catch (error) {
    showToast(`⚠️ ${error.message}`);
    console.error('Weather load error:', error);
    throw error;
  } finally {
    showLoading(false);
  }
}

async function searchCity(cityName) {
  if (!cityName.trim()) return;
  showLoading(true);
  try {
    const geo = await geocodeCity(cityName.trim());
    await loadWeatherByCoords(geo.lat, geo.lon, geo.name);
    DOM.searchInput.value = '';
    DOM.searchInput.blur();
  } catch (error) {
    showToast(`⚠️ ${error.message}`);
    showLoading(false);
  }
}

async function loadCurrentLocation() {
  if (!navigator.geolocation) {
    showToast('⚠️ Geolocation is not supported by your browser.');
    return;
  }
  showLoading(true);
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      await loadWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    },
    (err) => {
      showLoading(false);
      showToast('⚠️ Unable to access location. Please search for a city manually.');
      console.error('Geolocation error:', err);
    },
    { timeout: 10000, enableHighAccuracy: false }
  );
}

// ===== CHART RESIZE HANDLER =====
let chartResizeTimeout;
function debouncedChartResize() {
  clearTimeout(chartResizeTimeout);
  chartResizeTimeout = setTimeout(() => {
    if (state.currentWeather && state.forecast) {
      renderChart(state.forecast, state.currentWeather.timezone, state.units, state.weatherCondition);
    }
  }, 250);
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
  // Search button
  DOM.searchBtn.addEventListener('click', () => {
    const query = DOM.searchInput.value.trim();
    if (query) searchCity(query);
  });

  // Enter key in search input
  DOM.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = DOM.searchInput.value.trim();
      if (query) searchCity(query);
    }
  });

  // Location button
  DOM.locationBtn.addEventListener('click', loadCurrentLocation);

  // Unit toggles (Celsius/Fahrenheit)
  DOM.unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.unitBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      const newUnit = btn.dataset.unit;
      if (state.units !== newUnit) {
        state.units = newUnit;
        if (state.currentWeather && state.forecast) {
          renderHero(state.currentWeather, state.units);
          renderCurrentDetails(state.currentWeather, state.units);
          renderHourlyForecast(state.forecast, state.currentWeather.timezone, state.units);
          renderForecastGrid(state.forecast, state.currentWeather.timezone, state.units);
          renderHighlights(state.currentWeather, state.units);
          renderChart(state.forecast, state.currentWeather.timezone, state.units, state.weatherCondition);
        }
      }
    });
  });

  // Window resize
  window.addEventListener('resize', () => {
    resizeCanvas();
    debouncedChartResize();
  });

  // Cleanup before page unload
  window.addEventListener('beforeunload', () => {
    cleanupParticles();
  });

  // Handle tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cleanupParticles();
    } else {
      startParticles();
    }
  });

  // Hourly slider scroll buttons
  const hourlySlider = DOM.hourlySlider;
  const scrollLeftBtn = document.getElementById('hourlyScrollLeft');
  const scrollRightBtn = document.getElementById('hourlyScrollRight');

  if (scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      hourlySlider.scrollBy({ left: -200, behavior: 'smooth' });
    });
    scrollRightBtn.addEventListener('click', () => {
      hourlySlider.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }
}

// ===== INITIALIZE APP =====
async function init() {
  DOM.footerYear.textContent = new Date().getFullYear();

  setDOMReferences(DOM);
  initParticles(DOM.particlesCanvas, APP_CONFIG.PARTICLE_COUNT);
  loadRecentSearches();
  resizeCanvas();
  startParticles();
  updateParticles(800);

  initEventListeners();

  if (!APIConfig.API_KEY || APIConfig.API_KEY === '') {
    showToast('🔑 OpenWeatherMap API key missing. Get one at openweathermap.org/appid');
    showLoading(false);

    DOM.heroCity.textContent = 'Atmospheric';
    DOM.heroDate.textContent = '⚠️ API Key Required';
    DOM.heroTemp.innerHTML = '—<sup>°</sup>';
    DOM.heroCondition.textContent = 'Please add your API key to weather-api.js';
    DOM.heroFeelsLike.textContent = 'See console for instructions';

    console.error(
      '❌ Atmospheric: OpenWeatherMap API key missing!\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      '📋 SETUP INSTRUCTIONS:\n' +
      '  1. Go to https://openweathermap.org/appid\n' +
      '  2. Sign up for a free account (or log in)\n' +
      '  3. Navigate to "API Keys" section\n' +
      '  4. Copy your personal API key\n' +
      '  5. Open weather-api.js file\n' +
      '  6. Set API_KEY to your key\n' +
      '  7. Save the file and refresh the page\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
    );
    return;
  }

  console.log('✅ API Key found, loading weather data...');

  try {
    await searchCity(APP_CONFIG.DEFAULT_CITY);
  } catch {
    try {
      await loadCurrentLocation();
    } catch {
      showToast('⚠️ Unable to load weather data. Please search for a city.');
      showLoading(false);
    }
  }
}

// Start the app
init();

// ===== PERIODIC REFRESH =====
setInterval(() => {
  if (state.currentWeather) {
    const { lat, lon } = state.currentWeather.coord;
    loadWeatherByCoords(lat, lon);
  }
}, APP_CONFIG.REFRESH_INTERVAL);

// ===== CONSOLE WELCOME =====
console.log(
  '%c🌤️ Atmospheric %cWeather Intelligence Platform %cready.',
  'font-size:1.4em;font-weight:bold;',
  'font-size:1em;',
  'color:#888;'
);
console.log('%cBuilt with precision • Vanilla JS Modules • OpenWeatherMap API',
  'color:#6b6b88;font-style:italic;');
