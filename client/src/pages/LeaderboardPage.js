import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { userAPI } from '../services/api';

const LeaderboardPage = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await userAPI.getLeaderboard();
        setTopUsers(response.data);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error('Fetch leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (position) => {
    switch (position) {
      case 1: return { variant: 'warning', icon: '🥇', label: 'Gold' };
      case 2: return { variant: 'secondary', icon: '🥈', label: 'Silver' };
      case 3: return { variant: 'dark', icon: '🥉', label: 'Bronze' };
      default: return { variant: 'primary', icon: '🏅', label: `#${position}` };
    }
  };

  if (loading) {
    return (
      <Container className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading leaderboard...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold mb-3">🏆 Community Leaderboard</h1>
          <p className="text-muted">
            Top contributors who help keep our bus tracking accurate and up-to-date
          </p>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {topUsers.length === 0 ? (
        <Row>
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <div className="display-4 text-muted mb-3">🏆</div>
                <h3>No rankings available</h3>
                <p className="text-muted">
                  Be the first to contribute and claim the top spot!
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <>
          {/* Top 3 Podium */}
          <Row className="mb-5">
            <Col>
              <Card className="bg-gradient bg-light">
                <Card.Body>
                  <h4 className="text-center mb-4">🏆 Top Contributors</h4>
                  <Row className="text-center">
                    {topUsers.slice(0, 3).map((user, index) => {
                      const rank = getRankBadge(index + 1);
                      return (
                        <Col md={4} key={user._id} className="mb-3">
                          <div className="position-relative">
                            <div className="display-3 mb-2">{rank.icon}</div>
                            <h5 className="fw-bold">{user.username}</h5>
                            <div className="mb-2">
                              <Badge bg={rank.variant} className="fs-6">
                                {user.reputation} points
                              </Badge>
                            </div>
                            <small className="text-muted">
                              {user.totalUpdates} updates contributed
                            </small>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Full Leaderboard Table */}
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Complete Rankings</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0">Rank</th>
                        <th className="border-0">User</th>
                        <th className="border-0">Reputation</th>
                        <th className="border-0">Total Updates</th>
                        <th className="border-0">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUsers.map((user, index) => {
                        const rank = getRankBadge(index + 1);
                        const position = index + 1;
                        
                        return (
                          <tr key={user._id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">{rank.icon}</span>
                                <Badge bg={rank.variant}>
                                  #{position}
                                </Badge>
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">{user.username}</div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="reputation-badge me-2">
                                  {user.reputation}
                                </span>
                                <small className="text-muted">points</small>
                              </div>
                            </td>
                            <td>
                              <span className="fw-semibold">{user.totalUpdates}</span>
                              <small className="text-muted ms-1">updates</small>
                            </td>
                            <td>
                              <Badge bg="success" className="small">
                                🟢 Active
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recognition Levels */}
          <Row className="mt-5">
            <Col>
              <Card className="bg-light">
                <Card.Body>
                  <h5 className="fw-bold mb-3">🎯 Recognition Levels</h5>
                  <Row>
                    <Col md={3} className="mb-3">
                      <div className="text-center">
                        <div className="mb-2">🌟</div>
                        <strong>Newcomer</strong>
                        <br />
                        <small className="text-muted">0-49 points</small>
                      </div>
                    </Col>
                    <Col md={3} className="mb-3">
                      <div className="text-center">
                        <div className="mb-2">⭐</div>
                        <strong>Contributor</strong>
                        <br />
                        <small className="text-muted">50-199 points</small>
                      </div>
                    </Col>
                    <Col md={3} className="mb-3">
                      <div className="text-center">
                        <div className="mb-2">🏆</div>
                        <strong>Champion</strong>
                        <br />
                        <small className="text-muted">200-499 points</small>
                      </div>
                    </Col>
                    <Col md={3} className="mb-3">
                      <div className="text-center">
                        <div className="mb-2">👑</div>
                        <strong>Legend</strong>
                        <br />
                        <small className="text-muted">500+ points</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default LeaderboardPage;
