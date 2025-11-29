import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Track Buses in Real-Time
              </h1>
              <p className="lead mb-4">
                Join the community-powered bus tracking system for Sri Lanka. 
                Get real-time updates on bus locations and help fellow commuters.
              </p>
              {!isAuthenticated ? (
                <div>
                  <LinkContainer to="/register">
                    <Button variant="light" size="lg" className="me-3">
                      Join Community
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/routes">
                    <Button variant="outline-light" size="lg">
                      View Routes
                    </Button>
                  </LinkContainer>
                </div>
              ) : (
                <div>
                  <LinkContainer to="/update-bus">
                    <Button variant="light" size="lg" className="me-3">
                      Update Bus Location
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/routes">
                    <Button variant="outline-light" size="lg">
                      View Routes
                    </Button>
                  </LinkContainer>
                </div>
              )}
            </Col>
            <Col lg={6} className="text-center">
              <div className="display-1">🚌</div>
              <p className="mt-3">Community-Powered Bus Tracking</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold">How TrackMyBusLK Works</h2>
            <p className="text-muted">
              Simple, community-driven bus tracking for everyone
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 text-primary mb-3">📍</div>
                <Card.Title>Share Your Location</Card.Title>
                <Card.Text>
                  When you're on a bus, share the current stop and bus details 
                  to help other passengers know where buses are.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 text-success mb-3">🗺️</div>
                <Card.Title>Track in Real-Time</Card.Title>
                <Card.Text>
                  See live updates of bus locations on your desired routes. 
                  Get estimated arrival times and passenger load information.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} className="mb-4">
            <Card className="h-100 text-center">
              <Card.Body>
                <div className="display-4 text-warning mb-3">🏆</div>
                <Card.Title>Build Reputation</Card.Title>
                <Card.Text>
                  Earn reputation points for accurate updates. Help build a 
                  reliable community of bus trackers across Sri Lanka.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Statistics Section */}
      <div className="bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col md={3}>
              <div className="display-4 text-primary fw-bold">50+</div>
              <p className="text-muted">Bus Routes</p>
            </Col>
            <Col md={3}>
              <div className="display-4 text-success fw-bold">1000+</div>
              <p className="text-muted">Active Users</p>
            </Col>
            <Col md={3}>
              <div className="display-4 text-warning fw-bold">5000+</div>
              <p className="text-muted">Daily Updates</p>
            </Col>
            <Col md={3}>
              <div className="display-4 text-info fw-bold">24/7</div>
              <p className="text-muted">Real-time Tracking</p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action */}
      <Container className="py-5">
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <h2 className="fw-bold mb-4">Ready to Join the Community?</h2>
            <p className="lead mb-4">
              Start tracking buses in your area and help fellow commuters save time.
            </p>
            {!isAuthenticated && (
              <LinkContainer to="/register">
                <Button variant="primary" size="lg">
                  Get Started Today
                </Button>
              </LinkContainer>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
