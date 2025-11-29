import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { userAPI, busAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setProfile(response.data.user);
        setRecentUpdates(response.data.recentUpdates || []);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Fetch profile error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReputationLevel = (reputation) => {
    if (reputation >= 500) return { level: 'Legend', icon: '👑', color: 'warning' };
    if (reputation >= 200) return { level: 'Champion', icon: '🏆', color: 'success' };
    if (reputation >= 50) return { level: 'Contributor', icon: '⭐', color: 'primary' };
    return { level: 'Newcomer', icon: '🌟', color: 'secondary' };
  };

  if (loading) {
    return (
      <Container className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'Profile not found'}
        </Alert>
      </Container>
    );
  }

  const reputationInfo = getReputationLevel(profile.reputation);

  return (
    <Container className="py-4">
      <Row>
        {/* Profile Info */}
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body className="text-center">
              <div className="display-1 mb-3">👤</div>
              <h3 className="fw-bold mb-2">{profile.username}</h3>
              <p className="text-muted mb-3">{profile.email}</p>
              
              <div className="mb-3">
                <Badge bg={reputationInfo.color} className="fs-6 px-3 py-2">
                  {reputationInfo.icon} {reputationInfo.level}
                </Badge>
              </div>

              <Row className="text-center">
                <Col>
                  <div className="border-end">
                    <div className="display-6 fw-bold text-primary">
                      {profile.reputation}
                    </div>
                    <small className="text-muted">Reputation</small>
                  </div>
                </Col>
                <Col>
                  <div className="display-6 fw-bold text-success">
                    {profile.totalUpdates}
                  </div>
                  <small className="text-muted">Updates</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">📱 Contact Info</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>Phone:</strong>
                <div className="text-muted">{profile.phoneNumber}</div>
              </div>
              <div className="mb-2">
                <strong>Member Since:</strong>
                <div className="text-muted">
                  {formatDate(profile.createdAt)}
                </div>
              </div>
              <div>
                <strong>Status:</strong>
                <Badge bg="success" className="ms-2">
                  🟢 Active
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🚌 Recent Updates</h5>
              <Badge bg="primary">{recentUpdates.length}</Badge>
            </Card.Header>
            <Card.Body>
              {recentUpdates.length === 0 ? (
                <div className="text-center py-4">
                  <div className="display-4 text-muted mb-3">📍</div>
                  <h5>No updates yet</h5>
                  <p className="text-muted mb-3">
                    Start contributing by sharing bus locations on your daily commute!
                  </p>
                  <Button variant="primary" href="/update-bus">
                    Share Your First Update
                  </Button>
                </div>
              ) : (
                <div>
                  {recentUpdates.map((update, index) => (
                    <div key={update._id} className={`p-3 ${index !== recentUpdates.length - 1 ? 'border-bottom' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">
                            Bus {update.busNumber} on Route {update.routeId?.routeNumber}
                          </h6>
                          <small className="text-muted">
                            {update.routeId?.routeName}
                          </small>
                        </div>
                        <small className="text-muted">
                          {formatDate(update.createdAt)}
                        </small>
                      </div>
                      
                      <div className="mb-2">
                        <p className="mb-1">
                          <strong>Location:</strong> {update.currentStop}
                        </p>
                        <p className="mb-1">
                          <strong>Direction:</strong> 
                          <span className={`ms-1 ${update.direction === 'forward' ? 'text-success' : 'text-warning'}`}>
                            {update.direction === 'forward' ? '→' : '←'} {update.direction}
                          </span>
                        </p>
                        <p className="mb-1">
                          <strong>Passenger Load:</strong>
                          <Badge 
                            bg={
                              update.passengerLoad === 'low' ? 'success' :
                              update.passengerLoad === 'medium' ? 'warning' :
                              update.passengerLoad === 'high' ? 'danger' : 'dark'
                            }
                            className="ms-2"
                          >
                            {update.passengerLoad || 'medium'}
                          </Badge>
                        </p>
                      </div>

                      {update.notes && (
                        <div className="bg-light p-2 rounded mb-2">
                          <small>{update.notes}</small>
                        </div>
                      )}

                      {update.verifications && update.verifications.length > 0 && (
                        <div>
                          <small className="text-success">
                            ✓ {update.verifications.length} verification(s)
                          </small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Achievement Progress */}
          <Card className="mt-3">
            <Card.Header>
              <h6 className="mb-0">🎯 Progress to Next Level</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Current: {reputationInfo.level}</small>
                  <small>
                    {profile.reputation >= 500 ? 'Max Level!' : 
                     profile.reputation >= 200 ? `${500 - profile.reputation} points to Legend` :
                     profile.reputation >= 50 ? `${200 - profile.reputation} points to Champion` :
                     `${50 - profile.reputation} points to Contributor`}
                  </small>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{
                      width: `${profile.reputation >= 500 ? 100 : 
                              profile.reputation >= 200 ? ((profile.reputation - 200) / 300) * 100 :
                              profile.reputation >= 50 ? ((profile.reputation - 50) / 150) * 100 :
                              (profile.reputation / 50) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <Row className="text-center">
                <Col>
                  <small className="text-muted">
                    Keep sharing accurate bus updates to earn more reputation points!
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
