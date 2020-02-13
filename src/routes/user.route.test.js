const request = require("supertest");
const app = require("../app");
const User = require("../../src/models/user.model");
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
        password: "123456789",
        firstName: "Sonia",
        lastName: "Schaefer",
        email: "Jaeden.Upton@hotmail.com",
      },
      {
        id: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
        password: "123456789",
        firstName: "Humberto",
        lastName: "Bruen",
        email: "Timothy_VonRueden62@hotmail.com",
      },
    ];
    await User.create(usersData);
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  describe("/user/register", () => {
    it("POST should add a new user", async () => {
      const expectedUser = {
        firstName: "Aber",
        lastName: "Hoo",
        password: "123456789",
        email: "Aber_Hoo@gmail.com",
      };
      const { body: user } = await request(app)
        .post("/user/register")
        .send(expectedUser)
        .expect(201);

      expect(user.username).toBe(expectedUser.username);
      expect(user.password).not.toBe(expectedUser.password);
    });
  });

  describe("/user", () => {
    it("GET should respond with the user I am logged in with", async () => {
      const expectedUser = {
        id: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
        firstName: "Humberto",
        lastName: "Bruen",
        email: "Timothy_VonRueden62@hotmail.com",
      };
      jwt.verify.mockReturnValueOnce({ id: expectedUser.id });

      const { body: actualUser } = await request(app)
        .get(`/user`)
        .set("Cookie", "token=valid-token")
        .expect(200);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(actualUser).toEqual(expectedUser);
    });
  });
});
