import { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const API_KEY = import.meta.env.VITE_QUIZ_API_KEY;
const API_URL = `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=10`;

console.log("Loaded API Key:", API_KEY); 



function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(API_URL);
        const formattedQuestions = response.data.map((question) => {
          const incorrectAnswers = Object.values(question.answers)
            .filter((answer) => answer !== null);
          
          const correctAnswerKey = Object.keys(question.correct_answers).find(
            (key) => question.correct_answers[key] === "true"
          );
          
          const correctAnswer = correctAnswerKey ? question.answers[correctAnswerKey.replace("_correct", "")] : null;
          
          const options = correctAnswer ? [...incorrectAnswers, correctAnswer] : incorrectAnswers;
          options.sort(() => Math.random() - 0.5);
          
          return {
            question: question.question,
            options,
            correctAnswer,
          };
        });
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCurrentQuestionIndex((prevIndex) => {
        if (prevIndex + 1 < questions.length) {
          setTimeLeft(30);
          return prevIndex + 1;
        } else {
          setShowScore(true);
          return prevIndex;
        }
      });
    }
  }, [timeLeft, questions.length]);

  const handleAnswerOptionClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex + 1 < questions.length) {
        setTimeLeft(30);
        return prevIndex + 1;
      } else {
        setShowScore(true);
        return prevIndex;
      }
    });
  };

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section animate-pop">
          🎉 You answered <span className="highlight">{score}</span> out of {questions.length} questions correctly!
        </div>
      ) : (
        <>
          {questions.length > 0 ? (
            <div className="quiz-container animate-fadein">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="timer">⏳ Time Left: {timeLeft} sec</div>
              <div className="question-section">
                <div className="question-count">
                  Question <span className="current">{currentQuestionIndex + 1}</span>/{questions.length}
                </div>
                <div className="question-text animate-slideup">
                  {questions[currentQuestionIndex].question}
                </div>
              </div>
              <div className="answer-grid">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button 
                    key={index}
                    className="answer-card animate-fadein"
                    onClick={() => handleAnswerOptionClick(option)}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="loading-screen">
              <div className="loader"></div>
              <div className="loading-text">Preparing your quiz...</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
