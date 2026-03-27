const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config({ path: './.env' });

const seedCustomAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const username = 'admin.terminal@election-os.kl';
    const password = 'ytrewq321';
    const email = 'aaronalexmathew84@gmail.com';

    // Remove existing if any to avoid conflict
    await User.findOneAndDelete({ username });
    await User.findOneAndDelete({ email });

    const admin = await User.create({
      username,
      email,
      password, // Will be hashed by pre-save hook
      role: 'admin',
      isAdmin: true,
      firebaseUid: `manual_seed_${username}`
    });

    console.log('Custom Admin created successfully:');
    console.log('Username:', admin.username);
    console.log('Password:', 'ytrewq321');
    process.exit();
  } catch (err) {
    console.error('Error seeding custom admin:', err);
    process.exit(1);
  }
};

seedCustomAdmin();
