const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config({ path: './.env' });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@crowdvote.ai' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await User.create({
      username: 'EmeraldAdmin',
      email: 'admin@crowdvote.ai',
      password: 'adminpassword123', // Will be hashed by pre-save hook
      role: 'admin',
      isAdmin: true
    });

    console.log('Admin created successfully:', admin.email);
    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
