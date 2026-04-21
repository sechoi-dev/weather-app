import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

function HourlyChart({ forecast, unit }) {
  const tempUnit = unit === 'metric' ? '°C' : '°F'

  const data = forecast.list.slice(0, 8).map(item => ({
    time: new Date(item.dt_txt).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: Math.round(item.main.temp),
  }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-time">{label}</p>
        <p className="chart-tooltip-temp">{payload[0].value}{tempUnit}</p>
      </div>
    )
  }

  return (
    <div className="hourly-chart">
      <p className="forecast-label">24-Hour Forecast</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="time" tick={{ fill: '#a0b4c8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#a0b4c8', fontSize: 12 }} unit={tempUnit} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="temp"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: '#60a5fa', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HourlyChart
