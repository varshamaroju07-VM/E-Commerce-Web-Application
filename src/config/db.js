const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDB() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    memoryServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.14',
        arch: 'x64',
        platform: 'win32'
      }
    });
    mongoUri = memoryServer.getUri();
    console.log('Using in-memory MongoDB for local development');
  }

  await mongoose.connect(mongoUri, {
    dbName: 'ecommerce_store'
  });

  console.log(`MongoDB connected: ${mongoUri}`);
}

module.exports = connectDB;
