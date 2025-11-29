// Fallback data for when MongoDB is not available
const sampleRoutes = [
  {
    _id: "60f1b2b3c4a5b6c7d8e9f001",
    routeNumber: "176",
    routeName: "Colombo - Maharagama",
    startLocation: "Colombo Fort",
    endLocation: "Maharagama",
    stops: [
      { name: "Colombo Fort", order: 1, coordinates: { lat: 6.9344, lng: 79.8428 } },
      { name: "Pettah", order: 2, coordinates: { lat: 6.9367, lng: 79.8517 } },
      { name: "Maradana", order: 3, coordinates: { lat: 6.9292, lng: 79.8606 } },
      { name: "Dematagoda", order: 4, coordinates: { lat: 6.9186, lng: 79.8792 } },
      { name: "Borella", order: 5, coordinates: { lat: 6.9147, lng: 79.8833 } },
      { name: "Nugegoda", order: 6, coordinates: { lat: 6.8649, lng: 79.8997 } },
      { name: "Maharagama", order: 7, coordinates: { lat: 6.8447, lng: 79.9258 } }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "60f1b2b3c4a5b6c7d8e9f002",
    routeNumber: "138",
    routeName: "Colombo - Kottawa",
    startLocation: "Colombo",
    endLocation: "Kottawa",
    stops: [
      { name: "Colombo", order: 1, coordinates: { lat: 6.9271, lng: 79.8612 } },
      { name: "Bambalapitiya", order: 2, coordinates: { lat: 6.8989, lng: 79.8553 } },
      { name: "Wellawatta", order: 3, coordinates: { lat: 6.8794, lng: 79.8553 } },
      { name: "Dehiwala", order: 4, coordinates: { lat: 6.8489, lng: 79.8653 } },
      { name: "Mount Lavinia", order: 5, coordinates: { lat: 6.8306, lng: 79.8636 } },
      { name: "Ratmalana", order: 6, coordinates: { lat: 6.8183, lng: 79.8869 } },
      { name: "Kottawa", order: 7, coordinates: { lat: 6.7833, lng: 79.9667 } }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "60f1b2b3c4a5b6c7d8e9f003",
    routeNumber: "122",
    routeName: "Colombo - Gampaha",
    startLocation: "Colombo Fort",
    endLocation: "Gampaha",
    stops: [
      { name: "Colombo Fort", order: 1, coordinates: { lat: 6.9344, lng: 79.8428 } },
      { name: "Peliyagoda", order: 2, coordinates: { lat: 6.9583, lng: 79.8833 } },
      { name: "Kelaniya", order: 3, coordinates: { lat: 6.9553, lng: 79.9219 } },
      { name: "Kiribathgoda", order: 4, coordinates: { lat: 6.9789, lng: 79.9289 } },
      { name: "Wattala", order: 5, coordinates: { lat: 6.9889, lng: 79.9367 } },
      { name: "Ja-Ela", order: 6, coordinates: { lat: 7.0744, lng: 79.8919 } },
      { name: "Gampaha", order: 7, coordinates: { lat: 7.0917, lng: 79.9997 } }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "60f1b2b3c4a5b6c7d8e9f004",
    routeNumber: "177",
    routeName: "Colombo - Kotte",
    startLocation: "Colombo",
    endLocation: "Sri Jayawardenepura Kotte",
    stops: [
      { name: "Colombo", order: 1, coordinates: { lat: 6.9271, lng: 79.8612 } },
      { name: "Kollupitiya", order: 2, coordinates: { lat: 6.9097, lng: 79.8467 } },
      { name: "Borella", order: 3, coordinates: { lat: 6.9147, lng: 79.8833 } },
      { name: "Rajagiriya", order: 4, coordinates: { lat: 6.9069, lng: 79.8978 } },
      { name: "Battaramulla", order: 5, coordinates: { lat: 6.8961, lng: 79.9167 } },
      { name: "Sri Jayawardenepura Kotte", order: 6, coordinates: { lat: 6.8906, lng: 79.9414 } }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "60f1b2b3c4a5b6c7d8e9f005",
    routeNumber: "100",
    routeName: "Colombo - Kaduwela",
    startLocation: "Pettah",
    endLocation: "Kaduwela",
    stops: [
      { name: "Pettah", order: 1, coordinates: { lat: 6.9367, lng: 79.8517 } },
      { name: "Maradana", order: 2, coordinates: { lat: 6.9292, lng: 79.8606 } },
      { name: "Borella", order: 3, coordinates: { lat: 6.9147, lng: 79.8833 } },
      { name: "Rajagiriya", order: 4, coordinates: { lat: 6.9069, lng: 79.8978 } },
      { name: "Malabe", order: 5, coordinates: { lat: 6.9167, lng: 79.9533 } },
      { name: "Kaduwela", order: 6, coordinates: { lat: 6.9333, lng: 79.9833 } }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleUpdates = [
  {
    _id: "60f1b2b3c4a5b6c7d8e9f101",
    routeId: "60f1b2b3c4a5b6c7d8e9f001",
    userId: {
      _id: "60f1b2b3c4a5b6c7d8e9f201",
      username: "DemoUser",
      reputation: 25
    },
    busNumber: "NA-1234",
    currentStop: "Borella",
    nextStop: "Nugegoda",
    direction: "forward",
    passengerLoad: "medium",
    coordinates: { lat: 6.9147, lng: 79.8833 },
    notes: "Bus running on time",
    verifications: [],
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    _id: "60f1b2b3c4a5b6c7d8e9f102",
    routeId: "60f1b2b3c4a5b6c7d8e9f002",
    userId: {
      _id: "60f1b2b3c4a5b6c7d8e9f202",
      username: "BusTracker",
      reputation: 45
    },
    busNumber: "NB-5678",
    currentStop: "Wellawatta",
    nextStop: "Dehiwala",
    direction: "forward",
    passengerLoad: "high",
    coordinates: { lat: 6.8794, lng: 79.8553 },
    notes: "Heavy traffic, slight delay",
    verifications: [],
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
  }
];

// Sample users for fallback authentication
const sampleUsers = [
  {
    _id: "60f1b2b3c4a5b6c7d8e9f201",
    username: "demo_user",
    email: "demo@trackmybuslk.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password123"
    phoneNumber: "0771234567",
    reputation: 25,
    totalUpdates: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "60f1b2b3c4a5b6c7d8e9f202", 
    username: "bus_tracker",
        email: "tracker@trackmybuslk.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password123"
    phoneNumber: "0777654321",
    reputation: 45,
    totalUpdates: 12,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// In-memory storage for new users when MongoDB is not available
let fallbackUsers = [...sampleUsers];
let fallbackUserCounter = 203;

// Helper functions for managing fallback data
const getNextUserId = () => {
  return `fallback_user_${fallbackUserCounter++}`;
};

const addUser = (user) => {
  fallbackUsers.push(user);
};

module.exports = {
  sampleRoutes,
  sampleUpdates,
  sampleUsers,
  fallbackUsers,
  fallbackUserCounter,
  getNextUserId,
  addUser
};
