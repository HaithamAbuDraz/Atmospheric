# 🌤️ Atmospheric — Weather Intelligence Platform

**Atmospheric** is a premium, real‑time weather dashboard with a glass‑morphism UI, dynamic particle animations, and live air quality data. It provides hyperlocal weather intelligence powered by the OpenWeatherMap API.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)
![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?logo=css3)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-FF6B00)

🔗 **Live Demo:** [atmosphericweather.vercel.app](https://atmosphericweather.vercel.app)

---

## ✨ Features

- 🔐 **Secure API Key Management** – Store your OpenWeatherMap key locally (never shared).
- 🌍 **Geolocation & Search** – Get weather for your current location or any city worldwide.
- 📊 **Rich Weather Data** – Current conditions, 5‑day forecast, hourly breakdown, feels‑like temperature.
- 💨 **Air Quality Index** – Real‑time AQI with pollutant components (PM2.5, PM10, CO, NO₂, O₃).
- 🌅 **Sunrise / Sunset Arc** – Animated visualisation of the day’s sunlight progress.
- 📈 **Interactive Temperature Chart** – 16‑hour or 5‑day trend using Chart.js.
- 🎨 **Dynamic Visuals** – Gradient backgrounds, glass‑card effects, and weather‑dependent particle animations (rain, snow, clouds, clear sky).
- 📱 **Fully Responsive** – Optimised for mobile, tablet, and ultra‑wide screens.
- 🔄 **Auto‑Refresh** – Data updates every 10 minutes with intelligent backoff on failures.
- 🕒 **Recent Searches** – LocalStorage saves your last 6 cities.

---

## 🛠️ Tech Stack

### Built With

- **HTML5** – Semantic markup
- **CSS3** – Custom properties, backdrop‑filter, Grid/Flexbox
- **JavaScript (ES6+)** – Modular architecture (no frameworks)
- **Chart.js** – Temperature trend visualisation
- **OpenWeatherMap API** – Weather, forecast, air pollution, geocoding
---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/atmospheric-weather.git
cd atmospheric-weather
```

### 2. Get a Free API Key

- Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- Navigate to **API Keys** and copy your key (free tier includes 1,000 calls/day).

### 3. Run Locally

No build step required. Serve the project with any static server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (live-server)
npx live-server

# Or simply open index.html in your browser (some features may be blocked due to CORS)
```

### 4. Enter Your API Key

When the app loads, a modal will ask for your OpenWeatherMap API key.  
The key is stored **only in your browser’s localStorage** – never transmitted elsewhere.

---

## 🗂️ Project Structure

```
atmospheric-weather/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js
│       ├── weather-api.js
│       ├── key-manager.js
│       ├── ui-renderers.js
│       ├── particles.js
│       └── utils.js
└── README.md
```

---

## ⚙️ Configuration

You can modify default settings inside `main.js`:

```javascript
const APP_CONFIG = {
  DEFAULT_CITY: 'Gaza',          // fallback city
  UNITS: 'metric',               // 'metric' or 'imperial'
  MAX_RECENT_SEARCHES: 6,
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
  PARTICLE_COUNT: 60,
  MAX_REFRESH_RETRIES: 3,
};
```

---

## 🧪 Testing & Validation

- **API Key Validation** – Uses `https://api.openweathermap.org/data/2.5/weather?q=Gaza` to avoid false negatives.
- **Resize Handling** – Particles regenerate automatically on window resize.
- **Unit Toggle** – Seamless conversion between Celsius and Fahrenheit across all components.
- **Offline / Network Errors** – Graceful toasts and retry backoff.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for the weather data API
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Google Fonts](https://fonts.google.com/) (Inter, SF Pro) – used via system fonts

---

## 👨‍💻 Author

**Haitham Abu Draz**  
[GitHub](https://github.com/HaithamAbuDraz) • [LinkedIn](https://linkedin.com/in/haitham-abu-draz)

---

## ⭐ Show Your Support

If you find this project useful, give it a star ⭐ on GitHub – it means a lot!
