import { useState, useEffect } from 'react';
import WeatherCard from './WeatherCard';
import SearchBar from './SearchBar';
import LoadingSpinner from './LoadingSpinner';

const API_KEY = ''; // Users will need to add their OpenWeatherMap API key

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');

  const getWeatherCondition = (weatherCode, hour) => {
    const isNight = hour < 6 || hour > 20;
    
    if (isNight) return 'night';
    if (weatherCode >= 200 && weatherCode < 300) return 'rainy'; // Thunderstorm
    if (weatherCode >= 300 && weatherCode < 600) return 'rainy'; // Drizzle & Rain
    if (weatherCode >= 600 && weatherCode < 700) return 'snow'; // Snow
    if (weatherCode >= 700 && weatherCode < 800) return 'cloudy'; // Atmosphere
    if (weatherCode === 800) return 'sunny'; // Clear
    if (weatherCode > 800) return 'cloudy'; // Clouds
    
    return 'sunny';
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    if (!API_KEY) {
      setError('Please add your OpenWeatherMap API key to use this app');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      const currentHour = new Date().getHours();
      const condition = getWeatherCondition(data.weather[0].id, currentHour);
      
      setWeather({
        ...data,
        condition
      });
      setLocation(`${data.name}, ${data.sys.country}`);
      setError('');
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (cityName) => {
    if (!API_KEY) {
      setError('Please add your OpenWeatherMap API key to use this app');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      const currentHour = new Date().getHours();
      const condition = getWeatherCondition(data.weather[0].id, currentHour);
      
      setWeather({
        ...data,
        condition
      });
      setLocation(`${data.name}, ${data.sys.country}`);
      setError('');
    } catch (err) {
      setError('City not found. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError('');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          setError('Unable to get your location. Please search for a city.');
          setLoading(false);
          console.error(error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const weatherCondition = weather?.condition || 'sunny';

  return (
    <div className={`min-h-screen weather-bg ${weatherCondition} flex flex-col items-center justify-center p-4`}>
      <div className="w-full max-w-md space-y-6 animate-fade-in-up">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Weather App
          </h1>
          <p className="text-white/80 text-lg">
            Beautiful weather, beautiful day
          </p>
        </div>

        <SearchBar onSearch={fetchWeatherByCity} />

        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="glass-card rounded-2xl p-6 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            {!API_KEY && (
              <div className="text-white/80 text-sm space-y-2">
                <p>To use this weather app:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Get a free API key from <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">OpenWeatherMap</a></li>
                  <li>Add your API key to the WeatherApp component</li>
                  <li>Start enjoying beautiful weather updates!</li>
                </ol>
              </div>
            )}
            <button
              onClick={getCurrentLocation}
              className="mt-4 px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {weather && !loading && (
          <WeatherCard weather={weather} location={location} />
        )}
      </div>
    </div>
  );
};

export default WeatherApp;