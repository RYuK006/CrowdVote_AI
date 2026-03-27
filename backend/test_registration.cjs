const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testUser = {
  username: "Stalin John",
  email: "hfko2hwbs@gmail.com",
  password: "asdfghjkl",
  role: "user"
};

async function testRegistrationInternal() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const User = require('./src/models/User');

    // Clean up if already exists to ensure fresh test
    console.log('Cleaning up existing test user if present...');
    await User.deleteOne({ email: testUser.email });

    console.log('Attempting to create user 1 (No firebaseUid)...');
    const user1 = await User.create(testUser);
    console.log('User 1 created successfully:', user1.email);

    console.log('Attempting to create another user (No firebaseUid) to verify sparse index works...');
    const testUser2 = {
      username: "Test User 2",
      email: "test2@example.com",
      password: "password123",
      role: "user"
    };
    // Ensure test2 doesn't exist
    await User.deleteOne({ email: testUser2.email });
    
    const user2 = await User.create(testUser2);
    console.log('User 2 created successfully:', user2.email);

    console.log('SUCCESS: Both users created without firebaseUid conflict. Index is properly sparse.');
    
    // Final cleanup of test user 2 (keep Stalin John as requested by USER)
    await User.deleteOne({ email: testUser2.email });
    
    process.exit(0);
  } catch (err) {
    console.error('Registration failed:', err);
    process.exit(1);
  }
}

testRegistrationInternal();
