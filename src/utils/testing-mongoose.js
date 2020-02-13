const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const setupMongoServer = async () => {
  let mongoServer;
  try {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error(err);
  }
  return mongoServer;
};

const tearDownMongoServer = async mongoServer => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
module.exports = { setupMongoServer, tearDownMongoServer };
