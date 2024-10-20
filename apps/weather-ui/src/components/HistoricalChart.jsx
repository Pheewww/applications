import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricalChart = ({ temperatures, dates, unit }) => {
  const data = {
    labels: dates,
    datasets: [
      {
        label: `Temperature (°${unit})`,
        data: temperatures,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="historical-chart">
      <h2>Historical Temperature Trends</h2>
      <Line data={data} />
    </div>
  );
};

HistoricalChart.propTypes = {
  temperatures: PropTypes.arrayOf(PropTypes.number).isRequired,
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  unit: PropTypes.string.isRequired,
};

export default HistoricalChart;
