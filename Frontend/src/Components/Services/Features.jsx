import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Features.css';

const FeatureSection = () => {
  return (
    <Container className="my-5">
      <h2 className="text-center feature-heading">Transform Your Learning Experience</h2>
      <p className="text-center feature-subheading">Explore diverse and engaging ways to learn with our interactive games and quizzes.</p>
      <Row className="mt-4">
        <Col md={4} data-aos="fade-right">
          <Card className="feature-card text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="icon-container bg-lightgreen">
                  <i className="bi bi-book"></i>
                </div>
              </div>
              <Card.Title className="feature-title">EXPLORE</Card.Title>
              <ul className="card-text">
                <li>Interactive lessons and tutorials</li>
                <li>Engaging quizzes to test your knowledge</li>
                <li>Comprehensive understanding of topics</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} data-aos="fade-up">
          <Card className="feature-card text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="icon-container bg-lightblue">
                  <i className="bi bi-trophy"></i>
                </div>
              </div>
              <Card.Title className="feature-title">CHALLENGE</Card.Title>
              <ul className="card-text">
                <li>Compete with friends and peers</li>
                <li>Participate for free</li>
                <li>Quick, fun, and competitive matches</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} data-aos="fade-left">
          <Card className="feature-card text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center">
                <div className="icon-container bg-lightyellow">
                  <i className="bi bi-award"></i>
                </div>
              </div>
              <Card.Title className="feature-title">ACHIEVE</Card.Title>
              <ul className="card-text">
                <li>Track your progress and growth</li>
                <li>See your rank on the leaderboard</li>
                <li>Challenge the best and excel</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FeatureSection;
