const request = require("supertest");
const app = require("./app");

const { teardownMongoose } = require("../test/mongoose");

describe("/", () => {
  afterAll(async () => teardownMongoose());

  it("GET should return a list of endpoints", async () => {
    const { body } = await request(app)
      .get("/")
      .expect(200);
    expect(body).toEqual({
      "0": "GET /",
      "1": "GET /user",
      "2": "GET /companies",
      "3": "GET /companies/:id",
      "4": "POST /companies/:id/reviews",
      "5": "POST /user/login",
      "6": "POST /user/logout",
    });
  });
  it("GET invalid path should return error", async () => {
    const { body } = await request(app)
      .get("/abc")
      .expect(404);
    expect(body.error).toEqual("page not found");
  });
});
