import { useState, useEffect } from 'react';

const WeatherCard = ({ weather, location }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getWeatherIcon = (weatherCode, condition) => {
    if (condition === 'night') return '🌙';
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️';
    if (weatherCode >= 300 && weatherCode < 500) return '🌦️';
    if (weatherCode >= 500 && weatherCode < 600) return '🌧️';
    if (weatherCode >= 600 && weatherCode < 700) return '❄️';
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️';
    if (weatherCode === 800) return '☀️';
    if (weatherCode > 800) return '☁️';
    return '☀️';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const windSpeed = Math.round(weather.wind.speed * 3.6); // Convert m/s to km/h
  const pressure = weather.main.pressure;
  const visibility = weather.visibility ? Math.round(weather.visibility / 1000) : 'N/A';

  return (
    <div className="glass-card rounded-3xl p-8 text-white space-y-6">
      {/* Header with location and time */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">{location}</h2>
        <div className="text-white/80">
          <p className="text-lg font-medium">{formatTime(currentTime)}</p>
          <p className="text-sm">{formatDate(currentTime)}</p>
        </div>
      </div>

      {/* Main weather display */}
      <div className="text-center space-y-4">
        <div className="weather-icon text-8xl">
          {getWeatherIcon(weather.weather[0].id, weather.condition)}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-6xl font-light">{temperature}°</h3>
          <p className="text-xl capitalize">{weather.weather[0].description}</p>
          <p className="text-white/80">Feels like {feelsLike}°</p>
        </div>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">💧</div>
          <p className="text-sm text-white/80">Humidity</p>
          <p className="text-lg font-semibold">{humidity}%</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">💨</div>
          <p className="text-sm text-white/80">Wind</p>
          <p className="text-lg font-semibold">{windSpeed} km/h</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">🌡️</div>
          <p className="text-sm text-white/80">Pressure</p>
          <p className="text-lg font-semibold">{pressure} hPa</p>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-2">👁️</div>
          <p className="text-sm text-white/80">Visibility</p>
          <p className="text-lg font-semibold">{visibility} km</p>
        </div>
      </div>

      {/* Temperature range */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm text-white/80">Min</p>
            <p className="text-lg font-semibold">{Math.round(weather.main.temp_min)}°</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-white/80">Max</p>
            <p className="text-lg font-semibold">{Math.round(weather.main.temp_max)}°</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;