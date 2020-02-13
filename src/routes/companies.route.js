const express = require("express");
const router = express.Router();

const Company = require("../models/company.model");
const wrapAsync = require("../utils/wrapAsync");

const findAllWithProjection = async (req, res, next) => {
  const companies = await Company.find(
    {},
    "id companyName companySuffix numberOfEmployees description -_id"
  );
  res.send(companies);
};

const findOne = async (req, res, next) => {
  const company = await Company.findOne(
    { id: req.params.id },
    "-_id -__v -reviews._id"
  );
  res.send(company);
};

const createOneReview = async (req, res, next) => {
  const company = await Company.findOne({ id: req.params.id });
  const newReview = req.body;
  let randomId = require("crypto")
    .randomBytes(256 / 8)
    .toString("hex");
  randomId =
    randomId.substring(0, 8) +
    "-" +
    randomId.substring(9, 13) +
    "-" +
    randomId.substring(14, 18) +
    "-" +
    randomId.substring(19, 23) +
    "-" +
    randomId.substring(24, 32);

  newReview.id = randomId;
  newReview.userName = "Humberto Bruen";
  newReview.userId = "754aece9-64bf-42ab-b91c-bb65e2db3a37";
  company.reviews.push(newReview);
  await company.save();
  const companyReviews = await Company.findOne(
    { id: req.params.id },
    "reviews"
  );

  const newReviews = companyReviews.reviews.map(
    ({ id, review, rating, title, userId, userName }) => {
      return { id, rating, review, title, userId, userName };
    }
  );
  res.status(201).send(newReviews);
};

router.get("/", wrapAsync(findAllWithProjection));

router.get("/:id", wrapAsync(findOne));

router.post("/:id/reviews", wrapAsync(createOneReview));

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
