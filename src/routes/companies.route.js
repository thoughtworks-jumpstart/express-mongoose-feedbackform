const express = require("express");
const router = express.Router();

const Company = require("../models/company.model");
const wrapAsync = require("../utils/wrapAsync");

const findAll = async (req, res, next) => {
    const companies = await Company.find();
    res.send(companies);
};
router.get("/", wrapAsync(findAll));
module.exports = router;
