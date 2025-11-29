const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fallbackData = require('./fallbackData');

// Helper functions for fallback authentication when MongoDB is not available

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const findUserByEmail = (email) => {
  return fallbackData.fallbackUsers.find(user => user.email === email);
};

const findUserByUsername = (username) => {
  return fallbackData.fallbackUsers.find(user => user.username === username);
};

const findUserByPhone = (phoneNumber) => {
  return fallbackData.fallbackUsers.find(user => user.phoneNumber === phoneNumber);
};

const findUserById = (id) => {
  return fallbackData.fallbackUsers.find(user => user._id === id);
};

const createUser = async (userData) => {
  const { username, email, password, phoneNumber } = userData;
  
  // Check if user already exists
  if (findUserByEmail(email) || findUserByUsername(username) || findUserByPhone(phoneNumber)) {
    throw new Error('User with this email, username, or phone number already exists');
  }

  // Create new user
  const hashedPassword = await hashPassword(password);
  const newUser = {
    _id: fallbackData.getNextUserId(),
    username,
    email,
    password: hashedPassword,
    phoneNumber,
    reputation: 0,
    totalUpdates: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  fallbackData.addUser(newUser);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  findUserByEmail,
  findUserByUsername,
  findUserByPhone,
  findUserById,
  createUser
};
