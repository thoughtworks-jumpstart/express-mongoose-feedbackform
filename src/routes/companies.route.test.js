const request = require("supertest");
const app = require("../app");
const Company = require("../../src/models/company.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("companies", () => {
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
    const companiesData = [
      {
        id: "e5cc2c0a-93b5-4014-8910-6ed9f3056456",
        companyName: "Brakus, Aufderhar and Gutkowski",
        companySuffix: "and Sons",
        numberOfEmployees: 60497,
        description:
          "Voluptas reiciendis quasi expedita ex qui sit. Qui enim facilis adipisci qui.",
        reviews: [
          {
            id: "7da4d967-715b-4dc1-a74b-82a7992704f3",
            userId: "f6e016e6-e254-4375-bf82-797e6c00e3eb",
            userName: "Brennan Fisher",
            rating: 0,
            title: "eligendi adipisci",
            review:
              "Consequatur esse beatae voluptate voluptatibus expedita aperiam perspiciatis cumque voluptatem. Cum quasi dolor ut dignissimos illum magni eos. Et aspernatur illum commodi.",
          },
        ],
      },
    ];
    await Company.create(companiesData);
  });

  afterEach(async () => {
    await Company.deleteMany();
  });

  describe("/companies", () => {
    const expectedCompanies = [
      {
        id: "e5cc2c0a-93b5-4014-8910-6ed9f3056456",
        companyName: "Brakus, Aufderhar and Gutkowski",
        companySuffix: "and Sons",
        numberOfEmployees: 60497,
        description:
          "Voluptas reiciendis quasi expedita ex qui sit. Qui enim facilis adipisci qui.",
      },
    ];
    it("GET should return all companies' information without reviews", async () => {
      const { body: actualCompanies } = await request(app)
        .get("/companies")
        .expect(200);
      actualCompanies.sort((a, b) => a.id > b.id);
      expect(actualCompanies).toEqual(expectedCompanies);
    });
  });
});
