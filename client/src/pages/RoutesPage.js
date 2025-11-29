import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { busAPI } from '../services/api';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Try to use preloaded data first for instant loading
        const preloadedRoutes = sessionStorage.getItem('preloadedRoutes');
        if (preloadedRoutes) {
          console.log('Using preloaded routes data for instant loading');
          const data = JSON.parse(preloadedRoutes);
          setRoutes(data);
          setFilteredRoutes(data);
          setLoading(false);
          // Refresh in background
          busAPI.getRoutes().then(response => {
            setRoutes(response.data);
            setFilteredRoutes(response.data);
          });
          return;
        }

        // Fallback to API call if no preloaded data
        const response = await busAPI.getRoutes();
        setRoutes(response.data);
        setFilteredRoutes(response.data);
      } catch (err) {
        setError('Failed to load routes');
        console.error('Fetch routes error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    const filtered = routes.filter(route =>
      route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.endLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [searchTerm, routes]);

  if (loading) {
    return (
      <Container className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading routes...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-3">Bus Routes</h1>
          <p className="text-muted">
            Browse available bus routes and get real-time tracking information
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search routes by number, name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {filteredRoutes.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <div className="display-4 text-muted mb-3">🚌</div>
                <h3>No routes found</h3>
                <p className="text-muted">
                  {searchTerm ? 'Try a different search term' : 'No bus routes are currently available'}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row>
          {filteredRoutes.map((route) => (
            <Col md={6} lg={4} key={route._id} className="mb-4">
              <LinkContainer to={`/routes/${route._id}`}>
                <Card className="route-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="fw-bold text-primary mb-1">
                          Route {route.routeNumber}
                        </h5>
                        <h6 className="text-muted">{route.routeName}</h6>
                      </div>
                      <div className="text-end">
                        <small className="text-success">🟢 Active</small>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-success me-2">📍</span>
                        <small><strong>From:</strong> {route.startLocation}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-danger me-2">🎯</span>
                        <small><strong>To:</strong> {route.endLocation}</small>
                      </div>
                    </div>

                    {route.stops && route.stops.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted">
                          {route.stops.length} stops along the route
                        </small>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-primary fw-semibold">
                        View Live Updates →
                      </small>
                      <small className="text-muted">
                        🚌 Track buses
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </LinkContainer>
            </Col>
          ))}
        </Row>
      )}

      <Row className="mt-5">
        <Col>
          <Card className="bg-light">
            <Card.Body className="text-center">
              <h5 className="fw-bold">Don't see your route?</h5>
              <p className="mb-0 text-muted">
                New routes are added regularly based on community demand. 
                Contact us to suggest a new route for your area.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RoutesPage;
