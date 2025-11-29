import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RoutesPage from './pages/RoutesPage';
import RouteDetailPage from './pages/RouteDetailPage';
import ProfilePage from './pages/ProfilePage';
import UpdateBusPage from './pages/UpdateBusPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Preload common data for improved performance
    const preloadData = async () => {
      try {
        // Preload routes data
        import('./services/api').then(({ busAPI }) => {
          busAPI.getRoutes().then(response => {
            // Store in sessionStorage for quick access
            sessionStorage.setItem('preloadedRoutes', JSON.stringify(response.data));
            console.log('Routes preloaded for performance');
          }).catch(error => console.error('Error preloading routes:', error));
        });
      } catch (error) {
        console.error('Error in preloading:', error);
      } finally {
        // Show content after short delay (600ms)
        setTimeout(() => setLoading(false), 600);
      }
    };
    
    preloadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetailPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update-bus" 
            element={
              <ProtectedRoute>
                <UpdateBusPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
