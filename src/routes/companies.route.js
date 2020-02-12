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

router.get("/", wrapAsync(findAllWithProjection));

module.exports = router;
