const mongoose = require('mongoose');

const busUpdateSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusRoute',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busNumber: {
    type: String,
    required: true,
    trim: true
  },
  currentStop: {
    type: String,
    required: true
  },
  nextStop: {
    type: String
  },
  direction: {
    type: String,
    enum: ['forward', 'backward'],
    required: true
  },
  estimatedArrival: {
    type: Date
  },
  passengerLoad: {
    type: String,
    enum: ['low', 'medium', 'high', 'full'],
    default: 'medium'
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  notes: {
    type: String,
    maxlength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verifications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
busUpdateSchema.index({ routeId: 1, createdAt: -1 });
busUpdateSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('BusUpdate', busUpdateSchema);
