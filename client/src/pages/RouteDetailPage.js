import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { busAPI } from '../services/api';
import config from '../config';
import io from 'socket.io-client';

const RouteDetailPage = () => {
  const { id } = useParams(); // ← Getting 'id' from URL
  const [route, setRoute] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);

  // Fetch route data on mount
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        setLoading(true);
        const routeData = await busAPI.getRoute(id);
        setRoute(routeData);
        
        const updatesData = await busAPI.getUpdates(id);
        setUpdates(updatesData);
        
        setError('');
      } catch (err) {
        console.error('Error fetching route:', err);
        setError('Failed to load route details');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  // Socket.io connection
  useEffect(() => {
    // Use config for Socket URL
    const newSocket = io(config.SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    setSocket(newSocket);

    // Join the specific route room (use 'id' not 'routeId')
    newSocket.emit('joinRoute', id);
    console.log(`Joined route room: ${id}`);

    // Listen for real-time bus location updates
    newSocket.on('busLocationUpdate', (data) => {
      console.log('Received update:', data);
      if (data.routeId === id) { // Use 'id' here
        setUpdates(prevUpdates => {
          const updatedList = [...prevUpdates, data].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          return updatedList.slice(0, 10);
        });
      }
    });

    // Listen for deletion events
    newSocket.on('busUpdateDeleted', (data) => {
      console.log('Update deleted:', data);
      setUpdates(prevUpdates => 
        prevUpdates.filter(update => update._id !== data.updateId)
      );
    });

    // Connection event handlers
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    // Cleanup on unmount
    return () => {
      console.log('Disconnecting socket');
      newSocket.disconnect();
    };
  }, [id]); // Use 'id' in dependency array

  // ...existing code...
};

export default RouteDetailPage;