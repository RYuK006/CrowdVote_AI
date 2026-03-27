const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixIndexes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const User = require('./src/models/User');
    
    console.log('Checking existing indexes on User collection...');
    const indexes = await User.collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    const firebaseIndex = indexes.find(idx => idx.name === 'firebaseUid_1');
    
    if (firebaseIndex) {
      console.log('Found non-sparse or problematic firebaseUid_1 index. Dropping it...');
      await User.collection.dropIndex('firebaseUid_1');
      console.log('Index dropped successfully.');
    } else {
      console.log('No firebaseUid_1 index found to drop.');
    }

    console.log('Triggering Mongoose to recreate indexes (it will use the {sparse: true} from the model)...');
    await User.createIndexes();
    
    const newIndexes = await User.collection.indexes();
    console.log('New indexes:', JSON.stringify(newIndexes, null, 2));

    console.log('Re-syncing done.');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing indexes:', err);
    process.exit(1);
  }
}

fixIndexes();
