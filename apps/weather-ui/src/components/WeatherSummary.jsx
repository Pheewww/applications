import PropTypes from 'prop-types';
import { WiThermometer, WiHumidity, WiStrongWind, WiBarometer } from 'react-icons/wi';
import { TbCloudFog } from 'react-icons/tb';
import './WeatherSummary.css';

const WeatherSummary = ({ data, unit, convertTemperature }) => {
  const formatTemperature = (celsius) => {
    if (celsius === undefined) return 'N/A';
    const converted = convertTemperature(celsius, unit);
    return converted.toFixed(1);
  };

  return (
    <div className="weather-summary">
      <h2>Weather in {data.city}</h2>
      <div className="current-weather">
        <p className="date">{new Date(data.date).toLocaleString()}</p>
        <div className="main-info">
          <div className="temperature">
            <WiThermometer className="icon" />
            <span>{formatTemperature(data.averageTemperature)}°{unit}</span>
          </div>
          <p className="description">{data.description}</p>
        </div>
      </div>
      <div className="weather-details">
        <div className="detail-item">
          <WiThermometer className="icon" />
          <div>
            <p>Feels Like</p>
            <p>{formatTemperature(data.feelsLike)}°{unit}</p>
          </div>
        </div>
        <div className="detail-item">
          <WiHumidity className="icon" />
          <div>
            <p>Humidity</p>
            <p>{data.humidity}%</p>
          </div>
        </div>
        <div className="detail-item">
          <WiStrongWind className="icon" />
          <div>
            <p>Wind Speed</p>
            <p>{data.windSpeed} m/s</p>
          </div>
        </div>
        <div className="detail-item">
          <WiBarometer className="icon" />
          <div>
            <p>Pressure</p>
            <p>{data.pressure} hPa</p>
          </div>
        </div>
        <div className="detail-item">
          <TbCloudFog className="icon" />
          <div>
            <p>Main Weather</p>
            <p>{data.dominantWeather}</p>
          </div>
        </div>
      </div>
      <h3>Forecast</h3>
      <div className="forecast">
        {data.forecast.map((item, index) => (
          <div key={index} className="forecast-item">
            <p>{new Date(item.date).toLocaleDateString()}</p>
            <p className="forecast-temp">{formatTemperature(item.temperature)}°{unit}</p>
           
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

WeatherSummary.propTypes = {
  data: PropTypes.shape({
    city: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    averageTemperature: PropTypes.number.isRequired,
    maxTemperature: PropTypes.number.isRequired,
    minTemperature: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    pressure: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    dominantWeather: PropTypes.string.isRequired,
    feelsLike: PropTypes.number.isRequired,
    forecast: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      temperature: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  unit: PropTypes.string.isRequired,
  convertTemperature: PropTypes.func.isRequired,
};

export default WeatherSummary;
