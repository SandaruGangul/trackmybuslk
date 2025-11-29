import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <h4 className="mt-3">Loading TrackMyBusLK...</h4>
        <p className="text-muted">Please wait while we initialize the application</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;