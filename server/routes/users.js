const express = require('express');
const User = require('../models/User');
const BusUpdate = require('../models/BusUpdate');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recentUpdates = await BusUpdate.find({ userId: req.user._id })
      .populate('routeId', 'routeNumber routeName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      recentUpdates
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get top contributors
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find({ isActive: true })
      .select('username totalUpdates reputation')
      .sort({ reputation: -1, totalUpdates: -1 })
      .limit(10);

    res.json(topUsers);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
