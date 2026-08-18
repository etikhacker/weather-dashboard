/**
 * Design reminder — Atmosferik Məntəqə:
 * Asimmetrik meteoroloji oxu zolağı, dərin göy-mavi səthlər və barometrik
 * portağal vurğuları; məlumat həmişə dekorasiyadan öndədir.
 */
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Droplets,
  Gauge,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Sunrise,
  ThermometerSun,
  Wind,
} from "lucide-react";

type Place = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  timezone?: string;
};

type WeatherResponse = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  timezone: string;
};

type WeatherData = {
  place: Place;
  current: WeatherResponse["current"];
  hourly: Array<{
    time: string;
    temperature: number;
    code: number;
  }>;
  timezone: string;
};

const quickCities = ["Bakı", "Mingəçevir", "Gəncə", "İstanbul"];

const weatherCodes: Record<number, { label: string; icon: string }> = {
  0: { label: "Açıq səma", icon: "☀" },
  1: { label: "Əsasən açıq", icon: "◔" },
  2: { label: "Qismən buludlu", icon: "☁" },
  3: { label: "Buludlu", icon: "☁" },
  45: { label: "Dumanlı", icon: "≋" },
  48: { label: "Qırovlu duman", icon: "≋" },
  51: { label: "Yüngül çiskin", icon: "☂" },
  53: { label: "Çiskin", icon: "☂" },
  55: { label: "Güclü çiskin", icon: "☂" },
  61: { label: "Yüngül yağış", icon: "☂" },
  63: { label: "Yağış", icon: "☂" },
  65: { label: "Güclü yağış", icon: "☂" },
  71: { label: "Yüngül qar", icon: "❄" },
  73: { label: "Qar", icon: "❄" },
  75: { label: "Güclü qar", icon: "❄" },
  80: { label: "Yağışlı keçid", icon: "☂" },
  81: { label: "Yağışlı keçid", icon: "☂" },
  82: { label: "Güclü yağış", icon: "☂" },
  95: { label: "Tufan ehtimalı", icon: "ϟ" },
  96: { label: "Dolu tufanı", icon: "ϟ" },
  99: { label: "Güclü dolu tufanı", icon: "ϟ" },
};

function formatTime(isoTime: string) {
  return isoTime.slice(11, 16);
}

function windDirection(degrees: number) {
  const directions = ["Ş", "ŞŞQ", "ŞQ", "ŞŞ", "CŞ", "CCŞ", "C", "CCQ", "Q", "QQC", "QŞ", "QŞQ", "Ş", "ŞŞQ", "ŞQ", "ŞŞ"];
  return directions[Math.round(degrees / 22.5) % 16];
}

async function fetchWeatherForCity(city: string): Promise<WeatherData> {
  const locationParams = new URLSearchParams({
    name: city,
    count: "1",
    language: "az",
    format: "json",
  });

  const locationResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${locationParams.toString()}`,
  );

  if (!locationResponse.ok) {
    throw new Error("LOCATION_REQUEST_FAILED");
  }

  const locationPayload = (await locationResponse.json()) as { results?: Place[] };
  const place = locationPayload.results?.[0];

  if (!place) {
    throw new Error("CITY_NOT_FOUND");
  }

  const weatherParams = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,weather_code",
    forecast_days: "2",
    timezone: "auto",
  });

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?${weatherParams.toString()}`,
  );

  if (!weatherResponse.ok) {
    throw new Error("WEATHER_REQUEST_FAILED");
  }

  const weatherPayload = (await weatherResponse.json()) as WeatherResponse;
  const currentIndex = Math.max(weatherPayload.hourly.time.indexOf(weatherPayload.current.time), 0);

  return {
    place,
    current: weatherPayload.current,
    timezone: weatherPayload.timezone,
    hourly: weatherPayload.hourly.time
      .slice(currentIndex, currentIndex + 6)
      .map((time, index) => ({
        time,
        temperature: weatherPayload.hourly.temperature_2m[currentIndex + index],
        code: weatherPayload.hourly.weather_code[currentIndex + index],
      })),
  };
}

function readableError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "CITY_NOT_FOUND") {
      return "Bu şəhər tapılmadı. Şəhər adını yenidən yoxlayın.";
    }
    if (error.message === "LOCATION_REQUEST_FAILED" || error.message === "WEATHER_REQUEST_FAILED") {
      return "Hava xidməti hazırda cavab vermir. Bir neçə saniyə sonra yenidən cəhd edin.";
    }
  }
  return "Şəbəkə bağlantısı alınmadı. İnternetinizi yoxlayıb yenidən cəhd edin.";
}

export default function Home() {
  const [query, setQuery] = useState("Bakı");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeather = useCallback(async (city: string) => {
    const normalizedCity = city.trim();
    if (!normalizedCity) {
      setError("Şəhər adını daxil edin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherForCity(normalizedCity);
      setWeather(data);
      setQuery(data.place.name);
      setLastUpdated(new Date());
    } catch (requestError) {
      setError(readableError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather("Bakı");
  }, [loadWeather]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadWeather(query);
  }

  const condition = weather ? weatherCodes[weather.current.weather_code] ?? weatherCodes[0] : weatherCodes[0];
  const placeLabel = weather
    ? [weather.place.name, weather.place.admin1, weather.place.country].filter(Boolean).join(", ")
    : "Məlumat gözlənilir";
  const dailyHigh = weather ? Math.max(...weather.hourly.map((item) => item.temperature)) : 0;
  const dailyLow = weather ? Math.min(...weather.hourly.map((item) => item.temperature)) : 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#E8F0F3] text-[#102B40]">
      <div className="atmosphere-grid pointer-events-none fixed inset-0 opacity-70" aria-hidden="true" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-4 sm:px-7 sm:py-7 lg:px-10 lg:py-10">
        <header className="flex flex-col gap-6 border-b border-[#102B40]/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <a href="#weather-reading" className="flex w-fit items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#F06F37] focus-visible:ring-offset-4">
            <img src="/manus-storage/weather-dashboard-logo_709373d2.png" alt="Weather Dashboard kompas-barometr nişanı" className="h-12 w-12 object-contain" />
            <span>
              <span className="block font-display text-xl leading-none tracking-tight text-[#102B40]">weather</span>
              <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#557083]">dashboard</span>
            </span>
          </a>

          <form onSubmit={handleSubmit} className="search-control flex w-full max-w-xl items-stretch" role="search">
            <label htmlFor="city-search" className="sr-only">Şəhər adı</label>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Search aria-hidden="true" className="ml-4 h-5 w-5 shrink-0 text-[#557083]" />
              <input
                id="city-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Şəhər axtarın..."
                disabled={isLoading}
                autoComplete="off"
                className="h-14 min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[#738A98] disabled:cursor-wait"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="group flex min-w-28 items-center justify-center gap-2 bg-[#F06F37] px-5 text-sm font-extrabold uppercase tracking-[0.12em] text-[#102B40] transition-transform duration-150 hover:bg-[#F58B57] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              Axtar
            </button>
          </form>
        </header>

        <section className="flex flex-wrap items-center gap-x-5 gap-y-2 py-5 text-xs font-bold uppercase tracking-[0.15em] text-[#557083]" aria-label="Sürətli şəhər seçimi">
          <span className="text-[#102B40]">Sürətli seçim:</span>
          {quickCities.map((city) => (
            <button
              type="button"
              key={city}
              onClick={() => void loadWeather(city)}
              disabled={isLoading}
              className="border-b border-transparent pb-0.5 transition-colors hover:border-[#F06F37] hover:text-[#102B40] disabled:cursor-wait disabled:opacity-50"
            >
              {city}
            </button>
          ))}
        </section>

        <div className="flex flex-1 flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1.48fr)_minmax(330px,0.74fr)] lg:gap-7">
          <section id="weather-reading" aria-live="polite" className="reading-panel relative overflow-hidden bg-[#102B40] px-6 py-8 text-[#F7FBFC] shadow-[0_24px_55px_rgba(16,43,64,0.18)] sm:px-9 sm:py-10 lg:min-h-[590px] lg:px-12 lg:py-12">
            <img src="/manus-storage/weather-dashboard-hero-sky_ec0b3051.jpg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-screen" />
            <div className="absolute inset-0 bg-[linear-gradient(116deg,rgba(16,43,64,0.98)_0%,rgba(16,43,64,0.88)_47%,rgba(16,43,64,0.45)_100%)]" />
            <div className="reading-ruler absolute bottom-12 left-0 top-28 w-12 sm:w-16" aria-hidden="true" />
            <div className="barometer-ring absolute -right-24 top-16 h-80 w-80 rounded-full border border-white/15 sm:-right-12" aria-hidden="true" />
            <div className="barometer-ring absolute -right-12 top-28 h-56 w-56 rounded-full border border-white/10" aria-hidden="true" />

            {isLoading && !weather ? (
              <div className="relative flex min-h-96 items-center justify-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-white/70">
                <LoaderCircle className="h-5 w-5 animate-spin" /> Hava məlumatı yüklənir
              </div>
            ) : error && !weather ? (
              <div className="relative flex min-h-96 max-w-md flex-col items-start justify-center gap-4">
                <AlertTriangle className="h-10 w-10 text-[#F06F37]" />
                <p className="font-display text-3xl leading-tight">Oxunuş alınmadı.</p>
                <p className="leading-7 text-white/70">{error}</p>
                <button type="button" onClick={() => void loadWeather("Bakı")} className="mt-2 flex items-center gap-2 border border-white/30 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.15em] transition-colors hover:border-[#F06F37] hover:bg-white/10">
                  <RefreshCw className="h-4 w-4" /> Yenidən sına
                </button>
              </div>
            ) : weather ? (
              <div className="relative flex h-full flex-col">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#AFC3CD]">
                      <MapPin className="h-3.5 w-3.5 text-[#F06F37]" /> Canlı oxunuş
                    </div>
                    <h1 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{placeLabel}</h1>
                  </div>
                  <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur-sm">
                    {condition.label}
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-7 sm:mt-14 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    <span className="font-display text-[8.5rem] leading-[0.72] tracking-[-0.08em] sm:text-[11rem]">{Math.round(weather.current.temperature_2m)}</span>
                    <span className="mb-2 text-4xl font-semibold text-[#F06F37] sm:mb-3">°C</span>
                  </div>
                  <div className="flex items-center gap-4 sm:mb-2">
                    <span className="weather-symbol text-6xl leading-none text-[#F5B06A]">{condition.icon}</span>
                    <div className="border-l border-white/25 pl-4 text-xs font-bold uppercase tracking-[0.15em] text-[#B8CAD2]">
                      <p>Hiss edilən</p>
                      <p className="mt-2 text-2xl tracking-normal text-white">{Math.round(weather.current.apparent_temperature)}°</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 grid max-w-2xl grid-cols-3 border-y border-white/15 sm:mt-auto">
                  <div className="py-5 pr-4">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#AFC3CD]">Yüksək</span>
                    <span className="mt-2 flex items-center gap-2 text-lg font-bold"><ArrowUpRight className="h-4 w-4 text-[#F06F37]" />{Math.round(dailyHigh)}°</span>
                  </div>
                  <div className="border-x border-white/15 px-4 py-5">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#AFC3CD]">Aşağı</span>
                    <span className="mt-2 flex items-center gap-2 text-lg font-bold"><ArrowDownRight className="h-4 w-4 text-[#88C5D8]" />{Math.round(dailyLow)}°</span>
                  </div>
                  <div className="px-4 py-5">
                    <span className="block text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#AFC3CD]">Yağıntı</span>
                    <span className="mt-2 block text-lg font-bold">{weather.current.precipitation.toFixed(1)} mm</span>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="flex flex-col gap-5 lg:gap-7">
            <section className="instrument-card relative overflow-hidden bg-[#F7FBFC] p-6 shadow-[0_16px_35px_rgba(16,43,64,0.10)] sm:p-7">
              <img src="/manus-storage/weather-dashboard-sun-icon_40822198.jpg" alt="" className="absolute right-0 top-0 h-full w-[38%] object-cover opacity-35" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#F7FBFC_48%,rgba(247,251,252,0.2)_100%)]" />
              <div className="relative">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#557083]">Günün vəziyyəti</p>
                <p className="mt-3 font-display text-3xl leading-tight text-[#102B40]">{weather ? condition.label : "—"}</p>
                <p className="mt-4 max-w-[16rem] text-sm leading-6 text-[#557083]">Cari ölçülər Open-Meteo meteoroloji xidməti vasitəsilə avtomatik yenilənir.</p>
              </div>
            </section>

            <section className="instrument-card bg-[#D6E4E8] p-6 shadow-[0_16px_35px_rgba(16,43,64,0.10)] sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-[#102B40]/15 pb-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#557083]">Atmosfer ölçüləri</p>
                  <p className="mt-1 text-sm font-bold text-[#102B40]">Əsas metriklər</p>
                </div>
                <Gauge className="h-5 w-5 text-[#F06F37]" />
              </div>
              <div className="metric-rows mt-2">
                <div className="flex items-center justify-between gap-5 py-4">
                  <span className="flex items-center gap-3 text-sm font-bold text-[#456579]"><Droplets className="h-4 w-4 text-[#3286A1]" />Rütubət</span>
                  <span className="text-xl font-extrabold text-[#102B40]">{weather ? weather.current.relative_humidity_2m : "—"}<small className="ml-1 text-xs text-[#557083]">%</small></span>
                </div>
                <div className="flex items-center justify-between gap-5 py-4">
                  <span className="flex items-center gap-3 text-sm font-bold text-[#456579]"><Wind className="h-4 w-4 text-[#3286A1]" />Külək</span>
                  <span className="text-xl font-extrabold text-[#102B40]">{weather ? Math.round(weather.current.wind_speed_10m) : "—"}<small className="ml-1 text-xs text-[#557083]">km/s</small></span>
                </div>
                <div className="flex items-center justify-between gap-5 py-4">
                  <span className="flex items-center gap-3 text-sm font-bold text-[#456579]"><Compass className="h-4 w-4 text-[#3286A1]" />İstiqamət</span>
                  <span className="text-xl font-extrabold text-[#102B40]">{weather ? windDirection(weather.current.wind_direction_10m) : "—"}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <section className="instrument-card mt-5 overflow-hidden bg-[#F7FBFC] shadow-[0_16px_35px_rgba(16,43,64,0.10)] lg:mt-7" aria-label="Növbəti saatlar">
          <div className="flex flex-col gap-3 border-b border-[#102B40]/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-3">
              <ThermometerSun className="h-5 w-5 text-[#F06F37]" />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#557083]">Saatlıq xətt</p>
                <p className="mt-0.5 text-sm font-bold text-[#102B40]">Növbəti 6 saat</p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-xs font-bold text-[#557083]"><Sunrise className="h-4 w-4" />{weather ? weather.timezone.replace("_", " ") : "Yerli vaxt"}</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-y divide-[#102B40]/10 sm:grid-cols-6 sm:divide-y-0">
            {(weather?.hourly ?? Array.from({ length: 6 }, () => null)).map((item, index) => (
              <div key={item?.time ?? index} className="flex min-h-28 flex-col justify-between px-4 py-4 sm:min-h-32 sm:px-5">
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#557083]">{item ? formatTime(item.time) : "—"}</span>
                <span className="weather-symbol text-2xl text-[#F06F37]">{item ? (weatherCodes[item.code] ?? weatherCodes[0]).icon : "—"}</span>
                <span className="text-lg font-extrabold text-[#102B40]">{item ? `${Math.round(item.temperature)}°` : "—"}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 py-7 text-xs font-semibold text-[#557083] sm:flex-row sm:items-center sm:justify-between">
          <p>{error ? <span className="text-[#A63A24]">{error}</span> : "Şəhər üzrə real vaxt hava müşahidəsi."}</p>
          <p>{lastUpdated ? `Son yenilənmə: ${lastUpdated.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}` : "Bağlantı gözlənilir"}</p>
        </footer>
      </main>
    </div>
  );
}
