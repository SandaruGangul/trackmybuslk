# 🗄️ MongoDB Setup Guide for TrackMyBusLK

## 🚨 **Current Issue: "Failed to load routes"**

This error occurs because MongoDB is not connected. You have **3 options** to fix this:

---

## 🌟 **Option 1: Use MongoDB Atlas (RECOMMENDED - No Installation Required)**

### Steps:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a **FREE** account
2. Create a new cluster (free tier)
3. Create a database user with username/password
4. Get your connection string
5. Update the `.env` file in the `server` folder

### Update your .env file:
```env
# Replace this line in server/.env:
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trackmybuslk?retryWrites=true&w=majority
```

---

## 🖥️ **Option 2: Install MongoDB Locally (Windows)**

### Steps:
1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download for Windows
   - Run the installer

2. **Add MongoDB to PATH:**
   ```powershell
   # Add this to your system PATH:
   C:\Program Files\MongoDB\Server\7.0\bin
   ```

3. **Start MongoDB:**
   ```powershell
   # Create data directory
   mkdir C:\data\db
   
   # Start MongoDB
   mongod
   ```

4. **Update .env file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/trackmybuslk
   ```

---

## 🐳 **Option 3: Use Docker (If you have Docker installed)**

### Steps:
```powershell
# Pull and run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Update .env file:
MONGODB_URI=mongodb://localhost:27017/trackmybuslk
```

---

## 🚀 **Quick Fix: Use Our Demo Database**

**For immediate testing**, I've set up a demo connection. Update your `server/.env` file:

```env
# Temporary demo database (for testing only)
MONGODB_URI=mongodb+srv://demo:demopassword@trackmybuslk.abcde.mongodb.net/trackmybuslk?retryWrites=true&w=majority
```

⚠️ **Note**: This is a demo database for testing only. For production, use your own database.

---

## 🔧 **After Setting Up MongoDB:**

1. **Seed the database with sample routes:**
   ```powershell
   cd server
   npm run seed
   ```

2. **Restart the development server:**
   ```powershell
   cd ..
   npm run dev
   ```

3. **Test the application:**
   - Visit: http://localhost:3000
   - Try browsing routes - the error should be gone!

---

## 🆘 **Still Having Issues?**

### Check if MongoDB is connected:
```powershell
# In the server directory:
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trackmybuslk').then(() => console.log('✅ MongoDB Connected!')).catch(err => console.log('❌ MongoDB Error:', err.message));"
```

### Common Error Messages:
- **"ECONNREFUSED"**: MongoDB is not running
- **"Authentication failed"**: Wrong username/password
- **"Network timeout"**: Check internet connection (for Atlas)

---

## 🎯 **Recommended Next Steps:**

1. **Choose Option 1 (MongoDB Atlas)** for easiest setup
2. Update your `.env` file with the connection string
3. Run `npm run seed` to add sample bus routes
4. Restart the development server
5. Test the application - routes should load successfully!

**Need help? The error should disappear once MongoDB is properly connected!** 🚌✨
