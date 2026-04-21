function Forecast({ forecast, unit }) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'

  const dailyForecasts = Object.values(
    forecast.list.reduce((acc, item) => {
      const day = item.dt_txt.split(' ')[0]
      if (!acc[day]) {
        acc[day] = { ...item, tempMin: item.main.temp_min, tempMax: item.main.temp_max }
      } else {
        acc[day].tempMin = Math.min(acc[day].tempMin, item.main.temp_min)
        acc[day].tempMax = Math.max(acc[day].tempMax, item.main.temp_max)
      }
      return acc
    }, {})
  ).slice(0, 5)

  const getDayName = (dtTxt) => {
    const date = new Date(dtTxt)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="forecast">
      <p className="forecast-label">5-Day Forecast</p>
      <div className="forecast-cards">
        {dailyForecasts.map(item => (
          <div key={item.dt} className="forecast-card">
            <p className="forecast-day">{getDayName(item.dt_txt)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt={item.weather[0].description}
            />
            <p className="forecast-temp">
              {Math.round(item.tempMax)}{tempUnit} / {Math.round(item.tempMin)}{tempUnit}
            </p>
            <p className="forecast-desc">{item.weather[0].description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast
