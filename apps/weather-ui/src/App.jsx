import { useState, useEffect, useCallback } from "react";
import WeatherSummary from "./components/WeatherSummary";
import HistoricalChart from "./components/HistoricalChart";
import Alert from "./components/Alert";
import CityAggregates from "./components/CityAggregates";
import { getWeatherSummaries, getLatestWeather, getCityAggregates } from "./services/weatherService";
import "./App.css";

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

const App = () => {
  const [summaries, setSummaries] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [unit, setUnit] = useState("C");
  const [threshold, setThreshold] = useState(35);
  const [inputThreshold, setInputThreshold] = useState(35);
  const [alertMessage, setAlertMessage] = useState("");
  const [latestWeather, setLatestWeather] = useState(null);
  
  const [cityAggregates, setCityAggregates] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWeatherSummaries();
      setSummaries(data);
    };
    fetchData();

    // Set up interval to fetch data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const checkThreshold = useCallback((temperature) => {
    if (threshold !== null && temperature > threshold) {
      setAlertMessage(
        `Alert! ${selectedCity} has crossed the threshold of ${threshold}°C.`
      );
      
    }
  }, [selectedCity, threshold]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const latestData = await getLatestWeather(selectedCity);
        console.log("Latest Weather Data:", latestData);
        setLatestWeather(latestData);
        checkThreshold(latestData.averageTemperature);
        

        
        const cityAggregatesData = await getCityAggregates();
        console.log("City Aggregates Data:", cityAggregatesData);
        setCityAggregates(cityAggregatesData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeatherData();
  }, [selectedCity, checkThreshold]);

  const convertTemperature = (celsius, unit) => {
    switch (unit) {
      case 'C':
        return celsius;
      case 'F':
        return (celsius * 9/5) + 32;
      case 'K':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const toggleUnit = () => {
    setUnit(prevUnit => {
      switch (prevUnit) {
        case 'C': return 'F';
        case 'F': return 'K';
        case 'K': return 'C';
        default: return 'C';
      }
    });
  };

  const handleInputThresholdChange = (event) => {
    setInputThreshold(Number(event.target.value));
  };

  const handleSetThreshold = () => {
    setThreshold(inputThreshold);
  };

  const getHistoricalData = () => {
    if (!latestWeather) return { temperatures: [], dates: [] };
    const temperatures = summaries
      .filter((summary) => summary.city === selectedCity)
      .map((summary) => convertTemperature(summary.averageTemperature, unit));
    const dates = summaries
      .filter((summary) => summary.city === selectedCity)
      .map((summary) => new Date(summary.date).toLocaleDateString());
    return { temperatures, dates };
  };

  const { temperatures, dates } = getHistoricalData();

  return (
    <div className="app">
      <header>
        <h1>Weather Monitoring System</h1>
      </header>

      <nav className="city-navbar">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={selectedCity === city ? "active-city" : ""}
          >
            {city}
          </button>
        ))}
      </nav>

      <div className="controls">
        <button className="toggle-unit" onClick={toggleUnit}>Toggle °{unit}</button>

        <div className="threshold-input">
          <label>Set temperature threshold (°C): </label>
          <input
            type="number"
            value={inputThreshold}
            onChange={handleInputThresholdChange}
          />
          <button onClick={handleSetThreshold}>Set Threshold</button>
        </div>
      </div>

      {alertMessage && <Alert message={alertMessage} />}

      {latestWeather && (
        <WeatherSummary
          data={latestWeather}
          unit={unit}
          convertTemperature={convertTemperature}
        />
      )}

      

      {cityAggregates && (
        <CityAggregates
          data={cityAggregates}
          unit={unit}
          convertTemperature={convertTemperature}
        />
      )}

      <HistoricalChart temperatures={temperatures} dates={dates} unit={unit} />
    </div>
  );
};

export default App;
