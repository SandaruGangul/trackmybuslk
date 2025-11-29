# TrackMyBusLK 🚌

A community-powered MERN stack web application for real-time bus tracking in Sri Lanka. Users can share bus location updates and track buses on their desired routes in real-time.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Real-time Bus Tracking**: Live updates of bus locations using Socket.io
- **Community Verification**: Users can verify bus updates for accuracy
- **Reputation System**: Earn points for contributing accurate information
- **Interactive Maps**: View bus locations on Leaflet maps
- **Route Management**: Browse available bus routes and stops
- **Leaderboard**: See top contributors in the community
- **Responsive Design**: Mobile-friendly interface using React Bootstrap

## 🛠 Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **React Bootstrap** - UI components and responsive design
- **React Router** - Client-side routing
- **Leaflet & React-Leaflet** - Interactive maps
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Toastify** - Elegant notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)

## 🚀 Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd TrackMyBusLK
\`\`\`

### 2. Install dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
\`\`\`

### 3. Environment Configuration

Create a \`.env\` file in the \`server\` directory:

\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackmybuslk
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
\`\`\`

### 4. Database Setup

Make sure MongoDB is running on your system:

\`\`\`bash
# Start MongoDB service (Windows)
net start MongoDB

# Or using MongoDB Compass, connect to: mongodb://localhost:27017
\`\`\`

### 5. Run the Application

#### Option 1: Run both client and server concurrently
\`\`\`bash
# From the root directory
npm run dev
\`\`\`

#### Option 2: Run client and server separately

**Terminal 1 - Server:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Terminal 2 - Client:**
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📊 Database Models

### User Model
\`\`\`javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  phoneNumber: String (unique),
  reputation: Number (default: 0),
  totalUpdates: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### BusRoute Model
\`\`\`javascript
{
  routeNumber: String (unique),
  routeName: String,
  startLocation: String,
  endLocation: String,
  stops: [{
    name: String,
    coordinates: { lat: Number, lng: Number },
    order: Number
  }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### BusUpdate Model
\`\`\`javascript
{
  routeId: ObjectId (ref: BusRoute),
  userId: ObjectId (ref: User),
  busNumber: String,
  currentStop: String,
  nextStop: String,
  direction: String (forward/backward),
  coordinates: { lat: Number, lng: Number },
  passengerLoad: String (low/medium/high/full),
  notes: String,
  verifications: [{ userId: ObjectId, timestamp: Date }],
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🌐 API Endpoints

### Authentication Routes (\`/api/auth\`)
- \`POST /register\` - Register new user
- \`POST /login\` - User login
- \`GET /me\` - Get current user (protected)

### Bus Routes (\`/api/buses\`)
- \`GET /routes\` - Get all bus routes
- \`GET /routes/:id\` - Get specific route
- \`POST /routes\` - Create new route (protected)
- \`GET /updates/:routeId\` - Get recent updates for a route
- \`POST /update\` - Create bus location update (protected)
- \`POST /verify/:updateId\` - Verify an update (protected)

### User Routes (\`/api/users\`)
- \`GET /profile\` - Get user profile (protected)
- \`GET /leaderboard\` - Get top contributors

## 🎯 Usage Guide

### For Regular Users:
1. **Register** an account with your email and phone number
2. **Browse Routes** to find your daily commute routes
3. **View Live Updates** to see current bus locations
4. **Track Buses** in real-time on interactive maps

### For Contributors:
1. **Update Bus Locations** when you're on a bus
2. **Provide Accurate Information** about stops and passenger load
3. **Earn Reputation Points** for helpful updates
4. **Verify Other Updates** to build community trust

## 🏆 Reputation System

- **Newcomer** (0-49 points): New to the community
- **Contributor** (50-199 points): Regular participant
- **Champion** (200-499 points): Trusted community member
- **Legend** (500+ points): Top contributor

### How to Earn Points:
- **+1 point** for each bus location update
- **+1 point** when someone verifies your update
- Bonus points for consistent, accurate contributions

## 🔧 Development

### Project Structure
\`\`\`
TrackMyBusLK/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context (Auth)
│   │   ├── services/      # API services
│   │   └── hooks/         # Custom hooks
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js          # Server entry point
└── package.json          # Root package file
\`\`\`

### Available Scripts

**Root directory:**
- \`npm run dev\` - Run both client and server
- \`npm run server\` - Run server only
- \`npm run client\` - Run client only
- \`npm run build\` - Build client for production

**Server directory:**
- \`npm run dev\` - Run server with nodemon
- \`npm start\` - Run server in production

**Client directory:**
- \`npm start\` - Run development server
- \`npm run build\` - Build for production
- \`npm test\` - Run tests

## 🚦 Getting Started Tips

1. **Start with Registration**: Create an account to access all features
2. **Explore Routes**: Browse available bus routes in your area
3. **Make Your First Update**: Share a bus location when you're commuting
4. **Check the Leaderboard**: See how others are contributing
5. **Verify Updates**: Help build trust by verifying accurate information

## 🤝 Contributing

We welcome contributions to improve TrackMyBusLK! Here's how you can help:

1. **Report Bugs**: Open an issue with bug details
2. **Suggest Features**: Share ideas for new functionality
3. **Submit Pull Requests**: Fix bugs or add features
4. **Improve Documentation**: Help make the docs better
5. **Test the Application**: Report any issues you find

### Development Guidelines:
- Follow existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. **Check the Documentation**: Review this README
2. **Search Issues**: Look for similar problems
3. **Create an Issue**: Report bugs or request features
4. **Contact Support**: Reach out for additional help

## 🙏 Acknowledgments

- **Sri Lankan Bus Community**: For inspiration and real-world insights
- **Open Source Libraries**: All the amazing libraries that made this possible
- **Contributors**: Everyone who helps improve the application

---

**Made with ❤️ for the Sri Lankan commuter community**

*TrackMyBusLK - Making public transportation more reliable, one update at a time.*
