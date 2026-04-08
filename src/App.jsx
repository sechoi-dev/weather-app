import { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (city) => {
    setLoading(true)
    setError(null)
    setWeather(null)

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      )
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'City not found.' : 'Something went wrong.')
      }
      const data = await res.json()
      setWeather(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {weather && (
        <div className="weather-result">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}

export default App;