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
      { name: "Colombo Fort", coordinates: [6.9344, 79.8428] },
      { name: "Slave Island", coordinates: [6.9271, 79.8564] },
      { name: "Kollupitiya", coordinates: [6.9147, 79.8497] },
      { name: "Bambalapitiya", coordinates: [6.8942, 79.8509] },
      { name: "Wellawatte", coordinates: [6.8774, 79.8578] },
      { name: "Dehiwala", coordinates: [6.8515, 79.8632] },
      { name: "Mount Lavinia", coordinates: [6.8406, 79.8631] },
      { name: "Ratmalana", coordinates: [6.8214, 79.8846] },
      { name: "Moratuwa", coordinates: [6.7731, 79.8816] },
      { name: "Piliyandala", coordinates: [6.8011, 79.9220] },
      { name: "Maharagama", coordinates: [6.8485, 79.9265] }
    ]
  },
  {
    routeNumber: "177",
    routeName: "Colombo - Negombo",
    startLocation: "Colombo Fort",
    endLocation: "Negombo",
    stops: [
      { name: "Colombo Fort", coordinates: [6.9344, 79.8428] },
      { name: "Pettah", coordinates: [6.9387, 79.8542] },
      { name: "Maradana", coordinates: [6.9297, 79.8606] },
      { name: "Grandpass", coordinates: [6.9502, 79.8640] },
      { name: "Peliyagoda", coordinates: [6.9708, 79.8836] },
      { name: "Kelaniya", coordinates: [6.9553, 79.9219] },
      { name: "Kiribathgoda", coordinates: [6.9806, 79.9292] },
      { name: "Ja-Ela", coordinates: [7.0747, 79.8919] },
      { name: "Seeduwa", coordinates: [7.1045, 79.8845] },
      { name: "Katunayake", coordinates: [7.1670, 79.8840] },
      { name: "Negombo", coordinates: [7.2094, 79.8358] }
    ]
  },
  {
    routeNumber: "100",
    routeName: "Colombo - Gampaha",
    startLocation: "Colombo Fort",
    endLocation: "Gampaha",
    stops: [
      { name: "Colombo Fort", coordinates: [6.9344, 79.8428] },
      { name: "Pettah", coordinates: [6.9387, 79.8542] },
      { name: "Maradana", coordinates: [6.9297, 79.8606] },
      { name: "Baseline Road", coordinates: [6.9401, 79.8711] },
      { name: "Peliyagoda", coordinates: [6.9708, 79.8836] },
      { name: "Kelaniya", coordinates: [6.9553, 79.9219] },
      { name: "Kadawatha", coordinates: [7.0007, 79.9531] },
      { name: "Ragama", coordinates: [7.0264, 79.9197] },
      { name: "Gampaha", coordinates: [7.0911, 79.9950] }
    ]
  },
  {
    routeNumber: "245",
    routeName: "Colombo - Homagama",
    startLocation: "Colombo Fort",
    endLocation: "Homagama",
    stops: [
      { name: "Colombo Fort", coordinates: [6.9344, 79.8428] },
      { name: "Union Place", coordinates: [6.9147, 79.8613] },
      { name: "Borella", coordinates: [6.9167, 79.8783] },
      { name: "Rajagiriya", coordinates: [6.9077, 79.8897] },
      { name: "Battaramulla", coordinates: [6.8978, 79.9189] },
      { name: "Koswatte", coordinates: [6.8833, 79.9325] },
      { name: "Nugegoda", coordinates: [6.8649, 79.8997] },
      { name: "Kotte", coordinates: [6.8905, 79.9018] },
      { name: "Pannipitiya", coordinates: [6.8416, 79.9589] },
      { name: "Homagama", coordinates: [6.8444, 80.0025] }
    ]
  },
  {
    routeNumber: "155",
    routeName: "Colombo - Kaduwela",
    startLocation: "Colombo Fort",
    endLocation: "Kaduwela",
    stops: [
      { name: "Colombo Fort", coordinates: [6.9344, 79.8428] },
      { name: "Union Place", coordinates: [6.9147, 79.8613] },
      { name: "Borella", coordinates: [6.9167, 79.8783] },
      { name: "Rajagiriya", coordinates: [6.9077, 79.8897] },
      { name: "Battaramulla", coordinates: [6.8978, 79.9189] },
      { name: "Koswatte", coordinates: [6.8833, 79.9325] },
      { name: "Malabe", coordinates: [6.9097, 79.9531] },
      { name: "Athurugiriya", coordinates: [6.8781, 79.9906] },
      { name: "Kaduwela", coordinates: [6.9331, 79.9839] }
    ]
  },
  {
    routeNumber: "122",
    routeName: "Colombo - Piliyandala",
    startLocation: "Colombo Fort",
    endLocation: "Piliyandala",
    stops: [
      { name: "Colombo Fort", coordinates: [6.9344, 79.8428] },
      { name: "Kollupitiya", coordinates: [6.9147, 79.8497] },
      { name: "Wellawatte", coordinates: [6.8774, 79.8578] },
      { name: "Dehiwala", coordinates: [6.8515, 79.8632] },
      { name: "Mount Lavinia", coordinates: [6.8406, 79.8631] },
      { name: "Ratmalana", coordinates: [6.8214, 79.8846] },
      { name: "Moratuwa", coordinates: [6.7731, 79.8816] },
      { name: "Piliyandala", coordinates: [6.8011, 79.9220] }
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
          direction: j % 2 === 0 ? 'forward' : 'reverse',
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
