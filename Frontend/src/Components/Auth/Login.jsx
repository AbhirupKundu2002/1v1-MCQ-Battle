import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../Context/AuthContext';
import '../Style/Signup.css';  // Ensure this is updated to reflect new styles
import loginPhoto from '../Images/login_page.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email);
      setMessage('Login successful!');
      navigate('/');
    } catch (error) {
      setMessage('Error during login. Please try again.');
    }
  };

  return (
    <Container fluid className="login-container d-flex align-items-center justify-content-center vh-100">
      <Card className="login-card p-4 shadow-lg">
        <Row className="g-0">
          <Col md={6} className="d-none d-md-block">
            <img src={loginPhoto} alt="Login" className="img-fluid h-100 w-100 rounded-start" style={{ objectFit: 'cover' }} />
          </Col>
          <Col md={6} className="p-4">
            <h2 className="text-center mb-4">Welcome Back</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-pill"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 rounded-pill py-2">
                Log In
              </Button>
              {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
            </Form>

            <div className="text-center mt-3">
              <Link to="/" className="btn btn-link text-decoration-none">← Back to Home</Link>
            </div>

            <hr />

            <div className="text-center">
              <p className="text-muted">Don't have an account?</p>
              <Link to="/signup" className="btn btn-outline-secondary rounded-pill px-4">Sign Up</Link>
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default Login;
