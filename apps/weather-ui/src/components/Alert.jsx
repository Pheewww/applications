import PropTypes from 'prop-types';
import './Alert.css';

const Alert = ({ message }) => {
  return (
    <div className="alert">
      {message && <div className="alert-message">{message}</div>}
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Alert;
