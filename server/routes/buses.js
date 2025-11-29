const express = require('express');
const { body, validationResult } = require('express-validator');
const BusRoute = require('../models/BusRoute');
const BusUpdate = require('../models/BusUpdate');
const auth = require('../middleware/auth');
const { sampleRoutes, sampleUpdates } = require('../data/fallbackData');

const router = express.Router();

// Helper function to check if MongoDB is available
const isMongoAvailable = async () => {
  try {
    await BusRoute.findOne();
    return true;
  } catch (error) {
    console.log('MongoDB not available, using fallback data');
    return false;
  }
};

// @route   GET /api/buses/routes
// @desc    Get all bus routes
// @access  Public
router.get('/routes', async (req, res) => {
  try {
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      console.log('Using MongoDB for routes data');
      const routes = await BusRoute.find({ isActive: true }).sort({ routeNumber: 1 });
      res.json(routes);
    } else {
      // Use fallback data when MongoDB is not available
      console.log('MongoDB not available, using fallback routes');
      res.json(sampleRoutes);
    }
  } catch (error) {
    console.error('Get routes error:', error);
    // Fallback to sample data on any error
    res.json(sampleRoutes);
  }
});

// @route   GET /api/buses/routes/:id
// @desc    Get a specific bus route
// @access  Public
router.get('/routes/:id', async (req, res) => {
  try {
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      const route = await BusRoute.findById(req.params.id);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.json(route);
    } else {
      // Use fallback data
      const route = sampleRoutes.find(r => r._id === req.params.id);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.json(route);
    }
  } catch (error) {
    console.error('Get route error:', error);
    // Try fallback data
    const route = sampleRoutes.find(r => r._id === req.params.id);
    if (route) {
      res.json(route);
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// @route   POST /api/buses/routes
// @desc    Create a new bus route (Admin only - simplified for demo)
// @access  Private
router.post('/routes', auth, [
  body('routeNumber').notEmpty().withMessage('Route number is required'),
  body('routeName').notEmpty().withMessage('Route name is required'),
  body('startLocation').notEmpty().withMessage('Start location is required'),
  body('endLocation').notEmpty().withMessage('End location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { routeNumber, routeName, startLocation, endLocation, stops } = req.body;

    // Check if route already exists
    const existingRoute = await BusRoute.findOne({ routeNumber });
    if (existingRoute) {
      return res.status(400).json({ message: 'Route with this number already exists' });
    }

    const route = new BusRoute({
      routeNumber,
      routeName,
      startLocation,
      endLocation,
      stops: stops || [],
      createdBy: req.user._id
    });

    await route.save();
    res.status(201).json(route);
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/buses/updates/:routeId
// @desc    Get recent bus updates for a specific route
// @access  Public
router.get('/updates/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const timeWindow = parseInt(req.query.timeWindow) || 30; // Default 30 minutes
    const includeOutdated = req.query.includeOutdated !== 'false'; // Default to true
    
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      // Find updates that are:
      // 1. For this route
      // 2. Active
      // 3. Within the time window
      const minTime = new Date(Date.now() - (timeWindow * 60 * 1000)); // timeWindow minutes ago
      
      // Get recent updates first
      const recentUpdates = await BusUpdate.find({
        routeId,
        isActive: true,
        createdAt: { $gte: minTime }
      })
        .populate('userId', 'username reputation')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      // If no recent updates found, get the single most recent update regardless of time
      if (recentUpdates.length === 0) {
        const mostRecentUpdate = await BusUpdate.findOne({
          routeId,
          isActive: true
        })
          .populate('userId', 'username reputation')
          .sort({ createdAt: -1 });
          
        res.json(mostRecentUpdate ? [mostRecentUpdate] : []);
      } else {
        res.json(recentUpdates);
      }
    } else {
      // Use fallback data
      const allRouteUpdates = sampleUpdates
        .filter(u => u.routeId === routeId && u.isActive)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
      // Check if there are any updates within the time window
      const minTime = new Date(Date.now() - (timeWindow * 60 * 1000));
      const recentUpdates = allRouteUpdates.filter(u => new Date(u.createdAt) >= minTime);
      
      if (recentUpdates.length > 0) {
        res.json(recentUpdates.slice(0, limit));
      } else if (allRouteUpdates.length > 0) {
        // Return the single most recent update if none are within the time window
        res.json([allRouteUpdates[0]]);
      } else {
        res.json([]);
      }
    }
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buses/update
// @desc    Create a new bus location update
// @access  Private
router.post('/update', auth, [
  body('routeId').notEmpty().withMessage('Route ID is required'),
  body('busNumber').notEmpty().withMessage('Bus number is required'),
  body('currentStop').notEmpty().withMessage('Current stop is required'),
  body('direction').isIn(['forward', 'backward']).withMessage('Direction must be forward or backward'),
  body('coordinates.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('coordinates.lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      routeId,
      busNumber,
      currentStop,
      nextStop,
      direction,
      estimatedArrival,
      passengerLoad,
      coordinates,
      notes
    } = req.body;

    const mongoAvailable = await isMongoAvailable();

    if (mongoAvailable) {
      // MongoDB implementation
      const route = await BusRoute.findById(routeId);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }

      await BusUpdate.updateMany(
        { routeId, busNumber, isActive: true },
        { isActive: false }
      );

      const busUpdate = new BusUpdate({
        routeId,
        userId: req.user._id,
        busNumber,
        currentStop,
        nextStop,
        direction,
        estimatedArrival,
        passengerLoad,
        coordinates,
        notes
      });

      await busUpdate.save();
      await busUpdate.populate('userId', 'username reputation');
      await req.user.updateOne({ $inc: { totalUpdates: 1, reputation: 1 } });

      res.status(201).json(busUpdate);
    } else {
      // Fallback implementation for demo mode
      const route = sampleRoutes.find(r => r._id === routeId);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }

      // Create fallback bus update
      const fallbackUpdate = {
        _id: `fallback_update_${Date.now()}`,
        routeId,
        userId: {
          _id: req.user._id,
          username: req.user.username,
          reputation: req.user.reputation || 0
        },
        busNumber,
        currentStop,
        nextStop,
        direction,
        estimatedArrival,
        passengerLoad: passengerLoad || 'medium',
        coordinates,
        notes: notes || '',
        verifications: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add to sample updates (in-memory for demo)
      sampleUpdates.push(fallbackUpdate);

      // Update user reputation in fallback data
      const fallbackData = require('../data/fallbackData');
      const userIndex = fallbackData.fallbackUsers.findIndex(u => u._id === req.user._id);
      if (userIndex !== -1) {
        fallbackData.fallbackUsers[userIndex].totalUpdates = (fallbackData.fallbackUsers[userIndex].totalUpdates || 0) + 1;
        fallbackData.fallbackUsers[userIndex].reputation = (fallbackData.fallbackUsers[userIndex].reputation || 0) + 1;
      }

      res.status(201).json({
        ...fallbackUpdate,
        message: 'Bus update submitted successfully (demo mode)'
      });
    }
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({ message: 'Server error during bus update' });
  }
});

// @route   DELETE /api/buses/update/:updateId
// @desc    Delete a bus update (only by the user who created it)
// @access  Private
router.delete('/update/:updateId', auth, async (req, res) => {
  try {
    const { updateId } = req.params;
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      // MongoDB implementation
      const busUpdate = await BusUpdate.findById(updateId);
      
      if (!busUpdate) {
        return res.status(404).json({ message: 'Update not found' });
      }
      
      // Check if the user is the one who created the update
      if (busUpdate.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You can only delete your own updates' });
      }
      
      // Delete the update
      await BusUpdate.findByIdAndDelete(updateId);
      
      // Decrement the user's update count
      await req.user.updateOne({ $inc: { totalUpdates: -1 } });
      
      res.json({ message: 'Update deleted successfully' });
    } else {
      // Fallback implementation
      const updateIndex = sampleUpdates.findIndex(u => u._id === updateId);
      
      if (updateIndex === -1) {
        return res.status(404).json({ message: 'Update not found' });
      }
      
      const busUpdate = sampleUpdates[updateIndex];
      
      // Check if the user is the one who created the update
      if (busUpdate.userId._id !== req.user._id) {
        return res.status(403).json({ message: 'You can only delete your own updates' });
      }
      
      // Remove the update from sampleUpdates array
      sampleUpdates.splice(updateIndex, 1);
      
      // Update user's update count in fallback data
      const fallbackData = require('../data/fallbackData');
      const userIndex = fallbackData.fallbackUsers.findIndex(u => u._id === req.user._id);
      
      if (userIndex !== -1) {
        fallbackData.fallbackUsers[userIndex].totalUpdates = Math.max(
          (fallbackData.fallbackUsers[userIndex].totalUpdates || 1) - 1, 
          0
        );
      }
      
      res.json({ message: 'Update deleted successfully (demo mode)' });
    }
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({ message: 'Server error during update deletion' });
  }
});

// @route   GET /api/buses/user-updates
// @desc    Get recent bus updates by the current user
// @access  Private
router.get('/user-updates', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      const updates = await BusUpdate.find({
        userId: req.user._id,
        isActive: true
      })
        .populate('routeId', 'routeNumber routeName')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      res.json(updates);
    } else {
      // Use fallback data
      const updates = sampleUpdates
        .filter(u => u.userId._id === req.user._id && u.isActive)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      // For fallback data, we need to manually populate route information
      const updatesWithRoutes = updates.map(update => {
        const route = sampleRoutes.find(r => r._id === update.routeId);
        return {
          ...update,
          routeId: route ? {
            _id: route._id,
            routeNumber: route.routeNumber,
            routeName: route.routeName
          } : update.routeId
        };
      });
      
      res.json(updatesWithRoutes);
    }
  } catch (error) {
    console.error('Get user updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/buses/verify/:updateId
// @desc    Verify a bus update
// @access  Private
router.post('/verify/:updateId', auth, async (req, res) => {
  try {
    const { updateId } = req.params;
    const mongoAvailable = await isMongoAvailable();
    
    if (mongoAvailable) {
      // MongoDB implementation
      const busUpdate = await BusUpdate.findById(updateId);
      if (!busUpdate) {
        return res.status(404).json({ message: 'Update not found' });
      }

      const alreadyVerified = busUpdate.verifications.some(
        v => v.userId.toString() === req.user._id.toString()
      );

      if (alreadyVerified) {
        return res.status(400).json({ message: 'You have already verified this update' });
      }

      busUpdate.verifications.push({ userId: req.user._id });
      await busUpdate.save();

      await BusUpdate.populate(busUpdate, { path: 'userId' });
      if (busUpdate.userId) {
        await busUpdate.userId.updateOne({ $inc: { reputation: 1 } });
      }

      res.json({ message: 'Update verified successfully' });
    } else {
      // Fallback implementation
      const updateIndex = sampleUpdates.findIndex(u => u._id === updateId);
      if (updateIndex === -1) {
        return res.status(404).json({ message: 'Update not found' });
      }

      const busUpdate = sampleUpdates[updateIndex];
      const alreadyVerified = busUpdate.verifications.some(
        v => v.userId === req.user._id
      );

      if (alreadyVerified) {
        return res.status(400).json({ message: 'You have already verified this update' });
      }

      // Add verification to fallback data
      busUpdate.verifications.push({ 
        userId: req.user._id,
        username: req.user.username,
        createdAt: new Date()
      });

      // Update reputation of original poster in fallback data
      const fallbackData = require('../data/fallbackData');
      if (busUpdate.userId && busUpdate.userId._id) {
        const userIndex = fallbackData.fallbackUsers.findIndex(u => u._id === busUpdate.userId._id);
        if (userIndex !== -1) {
          fallbackData.fallbackUsers[userIndex].reputation = (fallbackData.fallbackUsers[userIndex].reputation || 0) + 1;
        }
      }

      res.json({ message: 'Update verified successfully (demo mode)' });
    }
  } catch (error) {
    console.error('Verify update error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

module.exports = router;