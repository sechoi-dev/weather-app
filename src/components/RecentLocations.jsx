function RecentLocations({ locations, onSelect }) {
  return (
    <div className="recent-locations">
      <p className="recent-label">Recent</p>
      <div className="recent-chips">
        {locations.map(loc => (
          <button key={loc} className="chip" onClick={() => onSelect(loc)}>
            {loc}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecentLocations
