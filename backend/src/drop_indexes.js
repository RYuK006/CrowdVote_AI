const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' }); // load from backend/.env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crowdvote');
    
    // access the raw db to drop indices
    const db = mongoose.connection.db;
    const usersCollection = mongoose.connection.collections.users;
    
    if (usersCollection) {
      console.log('Found users collection, attempting to drop indexes...');
      try {
        await usersCollection.dropIndex('email_1');
        console.log('✅ Dropped email_1 index');
      } catch(e) { console.log('❌ email_1 index not found or already dropped'); }
      
      try {
        await usersCollection.dropIndex('username_1');
        console.log('✅ Dropped username_1 index');
      } catch(e) { console.log('❌ username_1 index not found or already dropped'); }
    }
    
    console.log('Done migrating indices');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
