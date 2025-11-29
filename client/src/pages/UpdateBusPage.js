import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Table, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { busAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import config from '../config';

const UpdateBusPage = () => {
  const [routes, setRoutes] = useState([]);
  const [userUpdates, setUserUpdates] = useState([]);
  const [formData, setFormData] = useState({
    routeId: '',
    busNumber: '',
    currentStop: '',
    direction: 'forward',
    passengerLoad: 'medium',
    notes: '',
    coordinates: { lat: '', lng: '' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState('');
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await busAPI.getRoutes();
        setRoutes(response.data);
      } catch (err) {
        setError('Failed to load routes');
        console.error('Fetch routes error:', err);
      } finally {
        setLoadingRoutes(false);
      }
    };
    
    const fetchUserUpdates = async () => {
      try {
        const response = await busAPI.getUserUpdates(5); // Get the user's 5 most recent updates
        setUserUpdates(response.data || []);
      } catch (err) {
        console.error('Fetch user updates error:', err);
        // Don't show an error message for this specific error to avoid confusion
        // as it's not critical for the main form functionality
        setUserUpdates([]);
      } finally {
        setLoadingUpdates(false);
      }
    };

    fetchRoutes();
    
    // Only fetch user updates if user is logged in
    if (user && user._id) {
      fetchUserUpdates();
    } else {
      setLoadingUpdates(false);
    }
    
    // Initialize socket connection for real-time updates
    const newSocket = io('http://localhost:5001', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'] // Try WebSocket first, then fall back to polling
    });
    
    // Add connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket.io connected successfully');
    });
    
    newSocket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
    });
    
    setSocket(newSocket);

    // Listen for bus location updates
    newSocket.on('busLocationUpdate', (data) => {
      console.log('Received real-time update event:', data);
      if (data.userId._id === user?._id) {
        // If this update belongs to the current user, add it to their updates list
        setUserUpdates(prevUpdates => {
          // Check if this update already exists in the list
          const exists = prevUpdates.some(update => update._id === data._id);
          if (exists) return prevUpdates;
          
          // Add the new update at the beginning and limit to 5
          return [data, ...prevUpdates.slice(0, 4)];
        });
      }
    });

    // Listen for bus update deletions
    newSocket.on('busUpdateDeleted', (data) => {
      console.log('Received delete update event:', data);
      setUserUpdates(current => current.filter(update => update._id !== data.updateId));
    });
    
    return () => {
      if (newSocket) newSocket.close();
    };
    
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude.toFixed(6),
              lng: position.coords.longitude.toFixed(6)
            }
          }));
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('coordinates.')) {
      const coord = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [coord]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }    // Clear stops and coordinates when route changes
    if (name === 'routeId') {
      setFormData(prev => ({
        ...prev,
        routeId: value,
        currentStop: '',
        coordinates: { lat: '', lng: '' }
      }));
    }

    // Update direction without clearing next stop
    if (name === 'direction') {
      setFormData(prev => ({
        ...prev,
        direction: value
      }));
    }

    // Auto-populate coordinates when stop is selected
    if (name === 'currentStop' && value) {
      const selectedRoute = routes.find(route => route._id === formData.routeId);
      if (selectedRoute && selectedRoute.stops) {
        const selectedStop = selectedRoute.stops.find(stop => stop.name === value);
        if (selectedStop) {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: selectedStop.coordinates.lat.toString(),
              lng: selectedStop.coordinates.lng.toString()
            }
          }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

      try {
      // Verify that coordinates were auto-populated from the stop selection
      if (!formData.coordinates.lat || !formData.coordinates.lng) {
        setError('Please select a valid stop to get coordinates');
        setLoading(false);
        return;
      }

      const lat = parseFloat(formData.coordinates.lat);
      const lng = parseFloat(formData.coordinates.lng);
      
      if (isNaN(lat) || isNaN(lng)) {
        setError('Invalid coordinates detected');
        setLoading(false);
        return;
      }

      const updateData = {
        ...formData,
        coordinates: { lat, lng }
      };      
      
      const response = await busAPI.createUpdate(updateData);
      
      // Emit socket event for real-time updates to other users
      if (socket) {
        const emitData = {
          ...response.data,
          routeId: formData.routeId
        };
        socket.emit('updateBusLocation', emitData);
        console.log('Emitted update event:', emitData);
      }
      
      toast.success('Bus location updated successfully! Thank you for contributing.');
      
      // Reset form
      setFormData({
        routeId: '',
        busNumber: '',
        currentStop: '',
        direction: 'forward',
        passengerLoad: 'medium',
        notes: '',
        coordinates: { lat: '', lng: '' }
      });
      
      // Refresh user updates
      try {
        const updatesResponse = await busAPI.getUserUpdates(5);
        setUserUpdates(updatesResponse.data);
      } catch (err) {
        console.error('Error refreshing updates:', err);
      }

      // Try to get location again for next update
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({
              ...prev,
              coordinates: {
                lat: position.coords.latitude.toFixed(6),
                lng: position.coords.longitude.toFixed(6)
              }
            }));
          }
        );
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bus location');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }  };

  const selectedRoute = routes.find(route => route._id === formData.routeId);

  // No longer need getNextStops function since we've removed the next stop field

  const currentStopData = selectedRoute?.stops?.find(stop => stop.name === formData.currentStop);

  const handleDeleteUpdate = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(updateId);
    
    try {
      // Find the update we're deleting to get its route ID
      const updateToDelete = userUpdates.find(update => update._id === updateId);
      
      // Immediately update the UI by removing the deleted update
      setUserUpdates(current => current.filter(update => update._id !== updateId));
      
      // Then make the API call to delete from the server
      await busAPI.deleteUpdate(updateId);
      toast.success('Update deleted successfully');
      
      // Emit socket event for real-time update to other users
      if (socket && updateToDelete) {
        // Handle both object and string routeId formats
        let routeId;
        if (updateToDelete.routeId && typeof updateToDelete.routeId === 'object') {
          routeId = updateToDelete.routeId._id;
        } else {
          routeId = updateToDelete.routeId;
        }
        
        if (!routeId) {
          console.error('Failed to extract routeId from updateToDelete:', updateToDelete);
        }
        
        socket.emit('busUpdateDeleted', { 
          updateId, 
          routeId,
          timestamp: new Date().toISOString()
        });
        console.log('Emitted delete event:', { updateId, routeId });
      }
      
      // Refresh user updates from the server to ensure consistency
      try {
        const updatesResponse = await busAPI.getUserUpdates(5);
        setUserUpdates(updatesResponse.data || []);
      } catch (error) {
        console.error("Error refreshing updates:", error);
        // Already removed from UI, so no need to do it again
      }
    } catch (err) {
      // If the deletion fails, we need to add the update back to the UI
      toast.error('Failed to delete update: ' + (err.response?.data?.message || 'Server error or demo mode limitation'));
      console.error('Delete update error:', err);
      
      // Refresh to restore the original state
      try {
        const updatesResponse = await busAPI.getUserUpdates(5);
        setUserUpdates(updatesResponse.data || []);
      } catch (refreshErr) {
        console.error("Failed to refresh updates after deletion error:", refreshErr);
      }
    } finally {
      setDeleteLoading('');
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">🚌 Update Bus Location</h4>
              <small>Help fellow commuters by sharing real-time bus information</small>
            </Card.Header>
            <Card.Body>
              {/* User Info */}
              <div className="bg-light p-3 rounded mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Contributor:</strong> {user?.username}
                  </div>
                  <Badge bg="primary" className="reputation-badge">
                    {user?.reputation || 0} points
                  </Badge>
                </div>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Route *</Form.Label>
                      <Form.Select
                        name="routeId"
                        value={formData.routeId}
                        onChange={handleChange}
                        required
                        disabled={loadingRoutes}
                      >
                        <option value="">
                          {loadingRoutes ? 'Loading routes...' : 'Choose a route'}
                        </option>
                        {routes.map(route => (
                          <option key={route._id} value={route._id}>
                            Route {route.routeNumber} - {route.routeName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bus Number *</Form.Label>
                      <Form.Control
                        type="text"
                        name="busNumber"
                        value={formData.busNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g., NB-1234, 176"
                      />
                    </Form.Group>
                  </Col>
                </Row>                {selectedRoute && (
                  <Alert variant="info" className="mb-3">
                    <strong>Route:</strong> {selectedRoute.startLocation} ↔ {selectedRoute.endLocation}
                    <br />
                    <small className="text-muted">
                      {selectedRoute.stops?.length} stops • Direction: {formData.direction === 'forward' ? '→ Forward' : '← Backward'}
                    </small>
                  </Alert>
                )}

                {currentStopData && (
                  <Alert variant="success" className="mb-3">
                    <strong>📍 Current Stop:</strong> {currentStopData.name}
                    <br />
                    <small>
                      Coordinates: {currentStopData.coordinates.lat}, {currentStopData.coordinates.lng}
                      {formData.coordinates.lat && formData.coordinates.lng && (
                        <span className="text-success"> ✓ Auto-filled</span>
                      )}
                    </small>
                  </Alert>
                )}<Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Current Stop *</Form.Label>
                      {selectedRoute && selectedRoute.stops ? (
                        <Form.Select
                          name="currentStop"
                          value={formData.currentStop}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select current stop</option>
                          {selectedRoute.stops.map(stop => (
                            <option key={stop.order} value={stop.name}>
                              {stop.name}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <Form.Control
                          type="text"
                          name="currentStop"
                          value={formData.currentStop}
                          onChange={handleChange}
                          required
                          placeholder="e.g., Colombo Fort, Galle Face"
                          disabled={!formData.routeId}
                        />
                      )}
                      {!formData.routeId && (
                        <Form.Text className="text-muted">
                          Please select a route first
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>                  {/* Next Stop field removed */}
                </Row>

                <Row>                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Direction *</Form.Label>
                      <Form.Select
                        name="direction"
                        value={formData.direction}
                        onChange={handleChange}
                        required
                      >
                        <option value="forward">→ Forward</option>
                        <option value="backward">← Backward</option>
                      </Form.Select>
                      {selectedRoute && (
                        <Form.Text className="text-muted">
                          Forward: {selectedRoute.startLocation} → {selectedRoute.endLocation} | 
                          Backward: {selectedRoute.endLocation} → {selectedRoute.startLocation}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Passenger Load *</Form.Label>
                      <Form.Select
                        name="passengerLoad"
                        value={formData.passengerLoad}
                        onChange={handleChange}
                        required
                      >
                        <option value="low">🟢 Low - Plenty of seats</option>
                        <option value="medium">🟡 Medium - Some seats available</option>
                        <option value="high">🟠 High - Standing room only</option>
                        <option value="full">🔴 Full - Very crowded</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Latitude and Longitude fields removed - coordinates are auto-populated when selecting a stop */}

                <Form.Group className="mb-3">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any additional information about delays, traffic, or special conditions..."
                    maxLength={200}
                  />
                  <Form.Text className="text-muted">
                    {formData.notes.length}/200 characters
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading || loadingRoutes}
                  >
                    {loading ? 'Updating Location...' : '📍 Share Bus Location'}
                  </Button>
                </div>
              </Form>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="fw-bold mb-2">💡 Tips for Accurate Updates</h6>
                <ul className="mb-0 small">
                  <li>Make sure you're actually on the bus you're reporting</li>
                  <li>Double-check the bus number and route</li>
                  <li>Update your location when the bus reaches a major stop</li>
                  <li>Be honest about passenger load to help others plan</li>
                  <li>Earn reputation points for accurate and helpful updates!</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
          
          {/* Your Recent Updates Section */}
          <Card className="mt-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Your Recent Updates</h5>
              <small className="text-muted">You can delete incorrect updates here</small>
              
            </Card.Header>
            <Card.Body>
              {loadingUpdates ? (
                <div className="text-center p-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading your updates...</p>
                </div>
              ) : userUpdates.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Bus #</th>
                      <th>Stop</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userUpdates.map(update => {
                      // Debug log to check the update object structure
                      console.log('Update object:', update);
                      
                      const routeInfo = update.routeId && typeof update.routeId === 'object' 
                        ? `${update.routeId.routeNumber} - ${update.routeId.routeName}`
                        : 'Unknown Route';
                        
                      const timeAgo = new Date(update.createdAt);
                      const now = new Date();
                      const diffMinutes = Math.round((now - timeAgo) / (1000 * 60));
                      let timeDisplay;
                      
                      if (diffMinutes < 1) {
                        timeDisplay = 'Just now';
                      } else if (diffMinutes === 1) {
                        timeDisplay = '1 minute ago';
                      } else if (diffMinutes < 60) {
                        timeDisplay = `${diffMinutes} minutes ago`;
                      } else {
                        const hours = Math.floor(diffMinutes / 60);
                        timeDisplay = `${hours} hour${hours > 1 ? 's' : ''} ago`;
                      }
                      
                      // Make sure we have a valid ID
                      const updateId = update._id || update.id;
                      console.log('Using update ID for delete:', updateId);
                      
                      return (
                        <tr key={updateId}>
                          <td>{routeInfo}</td>
                          <td>{update.busNumber}</td>
                          <td>{update.currentStop}</td>
                          <td>{timeDisplay}</td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteUpdate(updateId)}
                              disabled={deleteLoading === updateId}
                            >
                              {deleteLoading === updateId ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  You haven't submitted any updates recently. Help the community by sharing bus locations!
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateBusPage;
