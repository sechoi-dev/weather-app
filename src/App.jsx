import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import RecentLocations from './components/RecentLocations'
import Forecast from './components/Forecast'
import HourlyChart from './components/HourlyChart'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const MAX_RECENT = 5

function App() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('metric')
  const [recentLocations, setRecentLocations] = useState(() =>
    JSON.parse(localStorage.getItem('recentLocations') || '[]')
  )

  const fetchWeather = async (city, selectedUnit = unit) => {
    setLoading(true)
    setError(null)
    setWeather(null)
    setForecast(null)

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${selectedUnit}&appid=${API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${selectedUnit}&appid=${API_KEY}`)
      ])
      if (!weatherRes.ok) {
        throw new Error(weatherRes.status === 404 ? 'City not found.' : 'Something went wrong.')
      }
      const [weatherData, forecastData] = await Promise.all([
        weatherRes.json(),
        forecastRes.json()
      ])
      setWeather(weatherData)
      setForecast(forecastData)
      addRecentLocation(city)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addRecentLocation = (city) => {
    setRecentLocations(prev => {
      const filtered = prev.filter(loc => loc.toLowerCase() !== city.toLowerCase())
      const updated = [city, ...filtered].slice(0, MAX_RECENT)
      localStorage.setItem('recentLocations', JSON.stringify(updated))
      return updated
    })
  }

  const handleSearch = (city) => fetchWeather(city)

  const handleUnitToggle = () => {
    const newUnit = unit === 'metric' ? 'imperial' : 'metric'
    setUnit(newUnit)
    if (weather) fetchWeather(weather.name, newUnit)
  }

  const tempUnit = unit === 'metric' ? '°C' : '°F'

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <button className="unit-toggle" onClick={handleUnitToggle}>
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      </header>

      <SearchBar onSearch={handleSearch} />

      {recentLocations.length > 0 && (
        <RecentLocations locations={recentLocations} onSelect={handleSearch} />
      )}

      {loading && <p>Loading...</p>}

      {error && (
        <div className="error-card">
          <p>{error}</p>
        </div>
      )}

      {!loading && weather && (
        <>
          <div className="weather-result">
            <h2>{weather.name}, {weather.sys.country}</h2>
            <img
              className="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p className="description">{weather.weather[0].description}</p>
            <p className="temp">{weather.main.temp}{tempUnit}</p>
            <p>Feels like {weather.main.feels_like}{tempUnit}</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
          </div>
          {forecast && <HourlyChart forecast={forecast} unit={unit} />}
          {forecast && <Forecast forecast={forecast} unit={unit} />}
        </>
      )}
    </div>
  )
}

export default App
