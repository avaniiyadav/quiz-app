import PropTypes from "prop-types";

const Question = ({ data, onAnswer }) => {
  return (
    <div className="question-card">
      <h2>{data.description}</h2>
      <div className="options">
        {data.options.map((option) => (
          <button key={option.id} onClick={() => onAnswer(option.is_correct)}>
            {option.description}
          </button>
        ))}
      </div>
    </div>
  );
};

Question.propTypes = {
  data: PropTypes.shape({
    description: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        is_correct: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
};

export default Question;
