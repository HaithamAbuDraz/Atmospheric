// main.js - App Initialization

import { fetchAllData, geocodeCity, WEATHER_CONFIG as APIConfig } from './weather-api.js';
import {
  setDOMReferences, setState, renderHero, renderCurrentDetails,
  renderHourlyForecast, renderForecastGrid, renderHighlights,
  renderSunriseSunset, renderAirQuality, renderChart
} from './ui-renderers.js';
import { initParticles, resizeCanvas, updateParticles, cleanupParticles, startParticles } from './particles.js';
