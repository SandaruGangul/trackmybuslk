const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  stops: [{
    name: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    order: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BusRoute', busRouteSchema);
