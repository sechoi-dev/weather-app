import './App.css'
import SearchBar from './components/SearchBar'

function App() {
  const handleSearch = (city) => {
    console.log(city)
  }
  return (
    <div className="app">
      <h1>Weather Dashboard</h1>
      <p>My React weather app is starting.</p>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default App;