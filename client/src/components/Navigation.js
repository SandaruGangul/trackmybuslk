import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>🚌 TrackMyBusLK</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/routes">
              <Nav.Link>Routes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/leaderboard">
              <Nav.Link>Leaderboard</Nav.Link>
            </LinkContainer>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <LinkContainer to="/update-bus">
                  <Nav.Link>
                    <Button variant="primary" size="sm">
                      Update Bus Location
                    </Button>
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/profile">
                  <Nav.Link>
                    👤 {user?.username}
                    <span className="reputation-badge ms-2">
                      {user?.reputation || 0}
                    </span>
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>
                    <Button variant="primary" size="sm">
                      Join Community
                    </Button>
                  </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
