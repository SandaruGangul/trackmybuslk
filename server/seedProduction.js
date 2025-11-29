const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const BusRoute = require('./models/BusRoute');
const BusUpdate = require('./models/BusUpdate');

const sriLankaBusRoutes = [
  {
    routeNumber: "138",
    routeName: "Colombo - Maharagama",
    startLocation: "Colombo Fort",
    endLocation: "Maharagama",
    stops: [
      { name: "Colombo Fort", coordinates: { lat: 6.9344, lng: 79.8428 }, order: 1 },
      { name: "Slave Island", coordinates: { lat: 6.9271, lng: 79.8564 }, order: 2 },
      { name: "Kollupitiya", coordinates: { lat: 6.9147, lng: 79.8497 }, order: 3 },
      { name: "Bambalapitiya", coordinates: { lat: 6.8942, lng: 79.8509 }, order: 4 },
      { name: "Wellawatte", coordinates: { lat: 6.8774, lng: 79.8578 }, order: 5 },
      { name: "Dehiwala", coordinates: { lat: 6.8515, lng: 79.8632 }, order: 6 },
      { name: "Mount Lavinia", coordinates: { lat: 6.8406, lng: 79.8631 }, order: 7 },
      { name: "Ratmalana", coordinates: { lat: 6.8214, lng: 79.8846 }, order: 8 },
      { name: "Moratuwa", coordinates: { lat: 6.7731, lng: 79.8816 }, order: 9 },
      { name: "Piliyandala", coordinates: { lat: 6.8011, lng: 79.9220 }, order: 10 },
      { name: "Maharagama", coordinates: { lat: 6.8485, lng: 79.9265 }, order: 11 }
    ]
  },
  {
    routeNumber: "177",
    routeName: "Colombo - Negombo",
    startLocation: "Colombo Fort",
    endLocation: "Negombo",
    stops: [
      { name: "Colombo Fort", coordinates: { lat: 6.9344, lng: 79.8428 }, order: 1 },
      { name: "Pettah", coordinates: { lat: 6.9387, lng: 79.8542 }, order: 2 },
      { name: "Maradana", coordinates: { lat: 6.9297, lng: 79.8606 }, order: 3 },
      { name: "Grandpass", coordinates: { lat: 6.9502, lng: 79.8640 }, order: 4 },
      { name: "Peliyagoda", coordinates: { lat: 6.9708, lng: 79.8836 }, order: 5 },
      { name: "Kelaniya", coordinates: { lat: 6.9553, lng: 79.9219 }, order: 6 },
      { name: "Kiribathgoda", coordinates: { lat: 6.9806, lng: 79.9292 }, order: 7 },
      { name: "Ja-Ela", coordinates: { lat: 7.0747, lng: 79.8919 }, order: 8 },
      { name: "Seeduwa", coordinates: { lat: 7.1045, lng: 79.8845 }, order: 9 },
      { name: "Katunayake", coordinates: { lat: 7.1670, lng: 79.8840 }, order: 10 },
      { name: "Negombo", coordinates: { lat: 7.2094, lng: 79.8358 }, order: 11 }
    ]
  },
  {
    routeNumber: "100",
    routeName: "Colombo - Gampaha",
    startLocation: "Colombo Fort",
    endLocation: "Gampaha",
    stops: [
      { name: "Colombo Fort", coordinates: { lat: 6.9344, lng: 79.8428 }, order: 1 },
      { name: "Pettah", coordinates: { lat: 6.9387, lng: 79.8542 }, order: 2 },
      { name: "Maradana", coordinates: { lat: 6.9297, lng: 79.8606 }, order: 3 },
      { name: "Baseline Road", coordinates: { lat: 6.9401, lng: 79.8711 }, order: 4 },
      { name: "Peliyagoda", coordinates: { lat: 6.9708, lng: 79.8836 }, order: 5 },
      { name: "Kelaniya", coordinates: { lat: 6.9553, lng: 79.9219 }, order: 6 },
      { name: "Kadawatha", coordinates: { lat: 7.0007, lng: 79.9531 }, order: 7 },
      { name: "Ragama", coordinates: { lat: 7.0264, lng: 79.9197 }, order: 8 },
      { name: "Gampaha", coordinates: { lat: 7.0911, lng: 79.9950 }, order: 9 }
    ]
  },
  {
    routeNumber: "245",
    routeName: "Colombo - Homagama",
    startLocation: "Colombo Fort",
    endLocation: "Homagama",
    stops: [
      { name: "Colombo Fort", coordinates: { lat: 6.9344, lng: 79.8428 }, order: 1 },
      { name: "Union Place", coordinates: { lat: 6.9147, lng: 79.8613 }, order: 2 },
      { name: "Borella", coordinates: { lat: 6.9167, lng: 79.8783 }, order: 3 },
      { name: "Rajagiriya", coordinates: { lat: 6.9077, lng: 79.8897 }, order: 4 },
      { name: "Battaramulla", coordinates: { lat: 6.8978, lng: 79.9189 }, order: 5 },
      { name: "Koswatte", coordinates: { lat: 6.8833, lng: 79.9325 }, order: 6 },
      { name: "Nugegoda", coordinates: { lat: 6.8649, lng: 79.8997 }, order: 7 },
      { name: "Kotte", coordinates: { lat: 6.8905, lng: 79.9018 }, order: 8 },
      { name: "Pannipitiya", coordinates: { lat: 6.8416, lng: 79.9589 }, order: 9 },
      { name: "Homagama", coordinates: { lat: 6.8444, lng: 80.0025 }, order: 10 }
    ]
  },
  {
    routeNumber: "155",
    routeName: "Colombo - Kaduwela",
    startLocation: "Colombo Fort",
    endLocation: "Kaduwela",
    stops: [
      { name: "Colombo Fort", coordinates: { lat: 6.9344, lng: 79.8428 }, order: 1 },
      { name: "Union Place", coordinates: { lat: 6.9147, lng: 79.8613 }, order: 2 },
      { name: "Borella", coordinates: { lat: 6.9167, lng: 79.8783 }, order: 3 },
      { name: "Rajagiriya", coordinates: { lat: 6.9077, lng: 79.8897 }, order: 4 },
      { name: "Battaramulla", coordinates: { lat: 6.8978, lng: 79.9189 }, order: 5 },
      { name: "Koswatte", coordinates: { lat: 6.8833, lng: 79.9325 }, order: 6 },
      { name: "Malabe", coordinates: { lat: 6.9097, lng: 79.9531 }, order: 7 },
      { name: "Athurugiriya", coordinates: { lat: 6.8781, lng: 79.9906 }, order: 8 },
      { name: "Kaduwela", coordinates: { lat: 6.9331, lng: 79.9839 }, order: 9 }
    ]
  },
  {
    routeNumber: "122",
    routeName: "Colombo - Piliyandala",
    startLocation: "Colombo Fort",
    endLocation: "Piliyandala",
    stops: [
      { name: "Colombo Fort", coordinates: { lat: 6.9344, lng: 79.8428 }, order: 1 },
      { name: "Kollupitiya", coordinates: { lat: 6.9147, lng: 79.8497 }, order: 2 },
      { name: "Wellawatte", coordinates: { lat: 6.8774, lng: 79.8578 }, order: 3 },
      { name: "Dehiwala", coordinates: { lat: 6.8515, lng: 79.8632 }, order: 4 },
      { name: "Mount Lavinia", coordinates: { lat: 6.8406, lng: 79.8631 }, order: 5 },
      { name: "Ratmalana", coordinates: { lat: 6.8214, lng: 79.8846 }, order: 6 },
      { name: "Moratuwa", coordinates: { lat: 6.7731, lng: 79.8816 }, order: 7 },
      { name: "Piliyandala", coordinates: { lat: 6.8011, lng: 79.9220 }, order: 8 }
    ]
  }
];

const demoUsers = [
  {
    username: "demo",
    email: "demo@trackmybuslk.com",
    password: "password123",
    phoneNumber: "+94771234567",
    reputation: 250,
    totalUpdates: 150
  },
  {
    username: "colombo_commuter",
    email: "colombo@trackmybuslk.com",
    password: "password123",
    phoneNumber: "+94777654321",
    reputation: 180,
    totalUpdates: 90
  },
  {
    username: "bus_tracker_pro",
    email: "tracker@trackmybuslk.com",
    password: "password123",
    phoneNumber: "+94769876543",
    reputation: 320,
    totalUpdates: 200
  }
];

async function seedProductionDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await BusRoute.deleteMany({});
    await BusUpdate.deleteMany({});
    console.log('✅ Database cleared');

    // Create users
    console.log('👥 Creating demo users...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save(); // This will hash the password via pre-save hook
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${user.username}`);
    }

    // Create bus routes
    console.log('🚌 Creating bus routes...');
    const createdRoutes = [];
    for (const routeData of sriLankaBusRoutes) {
      const route = await BusRoute.create(routeData);
      createdRoutes.push(route);
      console.log(`   ✓ Created route: ${route.routeNumber} - ${route.routeName}`);
    }

    // Create sample bus updates (recent)
    console.log('📍 Creating sample bus updates...');
    const now = new Date();
    const sampleUpdates = [];

    // Create 3 updates for each route
    for (let i = 0; i < createdRoutes.length; i++) {
      const route = createdRoutes[i];
      const user = createdUsers[i % createdUsers.length];
      
      // Create 3 updates at different stops
      for (let j = 0; j < 3; j++) {
        const stop = route.stops[Math.floor(Math.random() * route.stops.length)];
        const minutesAgo = Math.floor(Math.random() * 30) + (j * 10);
        
        sampleUpdates.push({
          routeId: route._id,
          userId: user._id,
          busNumber: `${route.routeNumber}/${Math.floor(Math.random() * 50) + 1}`,
          currentStop: stop.name,
          coordinates: stop.coordinates,
          direction: j % 2 === 0 ? 'forward' : 'backward',
          passengerLoad: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          timestamp: new Date(now.getTime() - minutesAgo * 60000)
        });
      }
    }

    await BusUpdate.insertMany(sampleUpdates);
    console.log(`   ✓ Created ${sampleUpdates.length} sample bus updates`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`   Users created: ${createdUsers.length}`);
    console.log(`   Routes created: ${createdRoutes.length}`);
    console.log(`   Updates created: ${sampleUpdates.length}`);
    
    console.log('\n🎉 Production database seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('   Email: demo@trackmybuslk.com');
    console.log('   Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProductionDatabase();
