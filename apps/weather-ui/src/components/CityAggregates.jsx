import PropTypes from 'prop-types';
import './CityAggregates.css';

const CityAggregates = ({ data, unit, convertTemperature }) => {
  const formatTemperature = (celsius) => {
    const converted = convertTemperature(celsius, unit);
    return converted.toFixed(1);
  };

  return (
    <div className="city-aggregates">
      <h3>Daily City Aggregates</h3>
      <div className="aggregates-grid">
        {data.map((city) => (
          <div key={city.name} className="city-item">
            <h4>{city.name}</h4>
            <p>Average: {formatTemperature(city.averageTemperature)}°{unit}</p>
            <p>Max: {formatTemperature(city.maxTemperature)}°{unit}</p>
            <p>Min: {formatTemperature(city.minTemperature)}°{unit}</p>
            <p>Dominant Weather: {city.dominantWeather}</p>
            <p className="reason">Reason: {city.dominantWeatherReason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

CityAggregates.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      averageTemperature: PropTypes.number.isRequired,
      maxTemperature: PropTypes.number.isRequired,
      minTemperature: PropTypes.number.isRequired,
      dominantWeather: PropTypes.string.isRequired,
      dominantWeatherReason: PropTypes.string.isRequired,
    })
  ).isRequired,
  unit: PropTypes.string.isRequired,
  convertTemperature: PropTypes.func.isRequired,
};

export default CityAggregates;
