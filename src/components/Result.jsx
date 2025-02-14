import PropTypes from 'prop-types'; // Import PropTypes at the top

const Result = ({ score, total }) => {
  return (
    <div className="result-card">
      <h2>Quiz Completed!</h2>
      <p>Your Score: {score} / {total}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
};

// Add PropTypes validation here
Result.propTypes = {
  score: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default Result;
