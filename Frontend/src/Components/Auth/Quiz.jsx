import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../Style/Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [unanswered, setUnanswered] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [timeTaken, setTimeTaken] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { _id } = useParams();
  const [length, setLength] = useState(0);
  const [Subject, setSubject] = useState('');
  const [Difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/game/${_id}`);
        const filteredGames = response.data.filter((game) => game._id === `${_id}`);
        setLength(filteredGames[0].noOfQuestions);
        setSubject(filteredGames[0].subject);
        setDifficulty(filteredGames[0].difficulty);
        setQuestions(filteredGames[0].mcqs);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, [_id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 1) {
          handleNext();
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    const timeSpent = 60 - timeRemaining;
    setTimeTaken([...timeTaken, timeSpent]);

    if (selectedOption === null) {
      setUnanswered(unanswered + 1);
    } else if (
      questions[currentQuestion]?.options[selectedOption] === questions[currentQuestion]?.correctAnswer
    ) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    setSelectedOption(null);
    setTimeRemaining(60);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    const timeSpent = 60 - timeRemaining;
    setTimeTaken([...timeTaken, timeSpent]);

    if (selectedOption === null) {
      setUnanswered(unanswered + 1);
    } else if (
      questions[currentQuestion]?.options[selectedOption] === questions[currentQuestion]?.correctAnswer
    ) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }

    setShowResults(true);
  };

  const totalTimeTaken = timeTaken.reduce((acc, time) => acc + time, 0);

  const updateDashboard = async () => {
    const email = localStorage.getItem('userEmail');
    const averageTimeTaken = totalTimeTaken / questions.length;

    const data = {
      email: email,
      TotalQuestions: questions.length,
      TotalCorrect: correctAnswers,
      TotalWrong: incorrectAnswers,
      TotalUnanswered: unanswered,
      TotalTimeAverage: averageTimeTaken,
      games: [
        {
          gameId: _id,
          Correct: correctAnswers,
        },
      ],
    };

    try {
      await axios.post('http://localhost:5000/dashboard', data);
      console.log('Dashboard updated successfully');
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  };

  const updateDashboardAndAccuracy = async () => {
    const email = localStorage.getItem('userEmail');
    const accuracys = (correctAnswers * 100) / length;

    const AccuracySubject = {
      email: email,
      category: Subject,
      accuracy: accuracys,
    };

    const AccuracyDifficulty = {
      email: email,
      category: Difficulty,
      accuracy: accuracys,
    };

    try {
      await axios.post('http://localhost:5000/accuracy', AccuracySubject);
      console.log('Subject Accuracy updated successfully');

      await axios.post('http://localhost:5000/accuracy', AccuracyDifficulty);
      console.log('Difficulty Accuracy updated successfully');
    } catch (error) {
      console.error('Error updating dashboard or accuracy:', error);
    }
  };

  const handleClose = () => {
    setShowResults(false);
    updateDashboard();
    updateDashboardAndAccuracy();
    navigate('/lobby');
  };

  return (
    <Container className="quiz-container my-5">
      {!showResults ? (
        <>
          <Row className="mb-3 justify-content-between align-items-center">
            <Col>
              <ProgressBar now={((currentQuestion + 1) / questions.length) * 100} label={`${currentQuestion + 1}/${questions.length}`} />
            </Col>
            <Col className="text-right">
              <h5 className="text-danger">Time remaining: {timeRemaining}s</h5>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Card className="shadow-lg">
                <Card.Body>
                  <h4>Question {currentQuestion + 1} of {questions.length}</h4>
                  <p className="lead">{questions[currentQuestion]?.question}</p>
                  <div className="options-container">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedOption === index ? 'primary' : 'outline-secondary'}
                        onClick={() => handleOptionSelect(index)}
                        className="option-btn"
                        block
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <Button
                variant={currentQuestion < questions.length - 1 ? 'secondary' : 'success'}
                onClick={currentQuestion < questions.length - 1 ? handleNext : handleFinish}
                className="mr-2"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
              </Button>
              <Button variant="danger" onClick={handleFinish}>
                Finish
              </Button>
            </Col>
          </Row>
          <Row className="mt-3 text-center">
            <Col>
              <p>Correct: {correctAnswers}</p>
              <p>Incorrect: {incorrectAnswers}</p>
              <p>Unanswered: {unanswered}</p>
            </Col>
          </Row>
        </>
      ) : (
        <Modal show={showResults} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Quiz Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Total Questions: {questions.length}</h5>
            <h5>Correct Answers: {correctAnswers}</h5>
            <h5>Incorrect Answers: {incorrectAnswers}</h5>
            <h5>Unanswered: {unanswered}</h5>
            <h5>Total Time Taken: {totalTimeTaken} seconds</h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Quiz;
