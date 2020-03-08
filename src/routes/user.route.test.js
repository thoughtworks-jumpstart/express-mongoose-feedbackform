const request = require("supertest");
const app = require("../app");
const User = require("../../src/models/user.model");

const { teardownMongoose } = require("../../test/mongoose");

const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

describe("user", () => {
  let signedInAgent;

  afterAll(async () => await teardownMongoose());

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
    jest.resetAllMocks();
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
      expect(user.userName).toBe(
        expectedUser.firstName + " " + expectedUser.lastName
      );
      expect(user.password).not.toBe(expectedUser.password);
    });
  });

  describe("/user/login", () => {
    it("should log user in when password is correct", async () => {
      const correctUser = {
        password: "123456789",
        userName: "Sonia Schaefer",
      };
      signedInAgent = request.agent(app);
      const { text: message } = await signedInAgent
        .post("/user/login")
        .send(correctUser)
        .expect(200);
      expect(message).toEqual("You are now logged in!");
    });

    it("should not log trainer in when password is incorrect", async () => {
      const wrongTrainer = {
        password: "wrongpassword",
        userName: "Sonia Schaefer",
      };
      const { body: message } = await request(app)
        .post("/user/login")
        .send(wrongTrainer)
        .expect(400);
      expect(message).toEqual({ error: "Login failed" });
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

      const { body: actualUser } = await signedInAgent.get(`/user`).expect(200);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(actualUser).toEqual(expectedUser);
    });
  });
});
