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

router.get("/", wrapAsync(findAllWithProjection));

router.get("/:id", wrapAsync(findOne));

module.exports = router;
