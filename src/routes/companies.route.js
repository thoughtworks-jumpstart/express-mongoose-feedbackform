const express = require("express");
const router = express.Router();

const Company = require("../models/company.model");
const User = require("../models/user.model");
const wrapAsync = require("../utils/wrapAsync");
const generateRandomId = require("../utils/generateRandomId");

const { protectRoute } = require("../../middlewares/auth");

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
  const companyObj = company.toObject();
  for (const review of companyObj.reviews) {
    const userId = review.userId;
    const user = await User.findOne({ id: userId });
    review["userName"] = user.userName;
  }
  res.send(companyObj);
};

const createOneReview = async (req, res, next) => {
  const company = await Company.findOne({ id: req.params.id });
  const newReview = req.body;
  newReview.id = generateRandomId();

  newReview.userName = req.user.userName;
  newReview.userId = req.user.id;

  company.reviews.push(newReview);
  await company.save();
  res.status(201).send(newReview);
};

router.get("/", wrapAsync(findAllWithProjection));

router.get("/:id", wrapAsync(findOne));

router.post("/:id/reviews", protectRoute, wrapAsync(createOneReview));

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
