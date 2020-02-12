const request = require("supertest");
const app = require("../app");
//const User = require("../../src/models/pokemon.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

describe("user", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const usersData = [
      {
        id: "fcee3436-2d39-4c38-9a8c-2b7808495015",
        username: "sonia",
        password: "12345678",
        firstName: "Sonia",
        lastName: "Schaefer",
        email: "Jaeden.Upton@hotmail.com",
      },
    ];
    await Pokemon.create(usersData);
  });

  afterEach(async () => {
    await usersData.deleteMany();
  });
});
