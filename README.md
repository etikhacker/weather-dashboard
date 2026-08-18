# Weather Dashboard

Weather Dashboard is a responsive React application for viewing current weather conditions by city or browser location. It presents temperature, humidity, wind, precipitation, and a six-hour outlook in a bilingual Azerbaijani/English interface.

> The dashboard is designed as a calm, data-led “weather station” interface. It prioritizes readable current conditions, transparent data-source context, and a clear fallback to city search when location access is unavailable.

## Features

| Area | Included functionality |
| --- | --- |
| Weather search | Searches a city through Open-Meteo geocoding, then loads weather data for its coordinates. |
| Current conditions | Shows temperature, apparent temperature, humidity, wind speed, wind direction, precipitation, and WMO weather condition. |
| Hourly outlook | Displays the next six hourly temperature and weather-condition readings. |
| Location weather | Uses the browser’s Geolocation API after the user grants permission, then fetches weather data for the returned coordinates. |
| Languages | Supports Azerbaijani and English. The selected language is persisted in `localStorage`. |
| City aliases | Supports common Göyçay spelling variants, including `Göyçay`, `Goychay`, and `Goycay`. |
| Failure states | Provides clear feedback for empty searches, unknown cities, denied location access, unavailable location data, network failures, and API errors. |

## Technology

| Layer | Tooling |
| --- | --- |
| Frontend | React 19 and TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 with custom CSS design tokens |
| Icons | Lucide React |
| Routing | Wouter |
| Weather data | Open-Meteo Forecast API and Geocoding API |

## Data Source and Accuracy

The dashboard uses the Open-Meteo Forecast API. Its `current` weather variables are based on 15-minute weather-model data, and Open-Meteo automatically selects the highest-resolution suitable model for a requested location.[1] The result should therefore be understood as a **recent model-based current condition**, rather than a guaranteed reading from a nearby physical weather station.

Open-Meteo ingests outputs from multiple national weather services. Model refresh frequency varies by source and is typically measured in hours; the provider publishes model-update availability separately.[1] [2] The interface shows both the model time and the time at which the dashboard was refreshed.

## Location Access and Privacy

The **My location / Konumum** action uses the browser’s built-in Geolocation API. The browser asks the user for permission before coordinates are returned. If permission is denied, unavailable, or unsupported, the dashboard preserves the existing weather result and shows a localized error message instead.[3]

Coordinates are used only in the in-browser request to retrieve weather data. This static project does not require a server-side API key or a custom backend for the current Open-Meteo integration.

## Getting Started

### Prerequisites

Install a current Node.js LTS release and [pnpm](https://pnpm.io/installation).

### Installation

```bash
git clone https://github.com/<your-account>/weather-dashboard.git
cd weather-dashboard
pnpm install
```

### Local Development

```bash
pnpm dev
```

The Vite development server starts on the port printed in the terminal.

### Production Build

```bash
pnpm check
pnpm build
pnpm start
```

## Available Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Starts the Vite development server. |
| `pnpm check` | Runs TypeScript type checking without emitting files. |
| `pnpm build` | Builds the client bundle and production server entry. |
| `pnpm start` | Runs the built production server. |
| `pnpm preview` | Serves the Vite production build locally for previewing. |
| `pnpm format` | Applies the project’s Prettier formatting rules. |

## Project Structure

```text
weather-dashboard/
├── client/
│   ├── src/
│   │   ├── pages/Home.tsx       # Search, language, location, and weather UI
│   │   ├── index.css            # Design tokens and weather-station visual system
│   │   └── App.tsx              # App providers and routing
│   └── index.html
├── server/index.ts              # Production static-file server
├── package.json
└── README.md
```

## Configuration

No environment variables are required for the current weather integration. Open-Meteo’s non-commercial Forecast API can be used without an API key under its published terms.[1]

If you later switch to a commercial, key-based weather provider, add its secret through your deployment platform’s environment-variable settings rather than committing it to the repository.

## Verification

The current project version has been checked with the following commands:

```bash
pnpm check
pnpm build
```

The city search, Göyçay matching, Azerbaijani/English switching, error messages, responsive layout, and location-permission UI have been reviewed. Actual browser location output depends on a user granting location access in the browser.

## License

This project is released under the [MIT License](LICENSE).

## References

[1] [Open-Meteo Weather Forecast API documentation](https://open-meteo.com/en/docs)

[2] [Open-Meteo model updates and data availability](https://open-meteo.com/en/docs/model-updates)

[3] [MDN Web Docs: Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
