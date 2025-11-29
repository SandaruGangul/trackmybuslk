# TrackMyBusLK - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
TrackMyBusLK is a community-powered MERN stack web application for real-time bus tracking in Sri Lanka. The application allows registered users to share bus location updates and track buses on their desired routes.

## Technology Stack
- **Frontend**: React.js with React Bootstrap for UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **Authentication**: JWT tokens
- **Maps**: Leaflet for map functionality

## Key Features
- User registration and authentication
- Real-time bus location updates
- Route management and viewing
- Community verification system
- User reputation and leaderboard
- Responsive mobile-friendly design

## Code Guidelines
- Use functional components with React Hooks
- Follow RESTful API conventions
- Implement proper error handling and validation
- Use Bootstrap classes for consistent styling
- Keep components modular and reusable
- Use async/await for API calls
- Implement proper authentication middleware

## Database Models
- **User**: username, email, password, phoneNumber, reputation, totalUpdates
- **BusRoute**: routeNumber, routeName, startLocation, endLocation, stops
- **BusUpdate**: routeId, userId, busNumber, currentStop, coordinates, direction, passengerLoad

## API Endpoints
- `/api/auth/*` - Authentication routes
- `/api/buses/*` - Bus and route management
- `/api/users/*` - User profile and leaderboard

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)

When working on this project, focus on maintaining the community-driven aspect and real-time functionality.
