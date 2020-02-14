const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const wrapAsync = require("../utils/wrapAsync");
const generateRandomId = require("../utils/generateRandomId");
const { protectRoute } = require("../../middlewares/auth");
const { getJWTSecret } = require("../../config/jwt");

const createOneUser = async (req, res, next) => {
  const user = new User(req.body);
  await User.init();
  user.id = generateRandomId();
  const newUser = await user.save();
  res.status(201).send(newUser);
};

const getMyUser = async (req, res, next) => {
  const user = await User.findOne({ id: req.user.id }, "-__v -_id -password");
  res.send(user);
};

const createJWTToken = (myId, myUserName) => {
  const today = new Date();
  const exp = new Date(today);

  const secret = getJWTSecret();
  exp.setDate(today.getDate() + 60);

  const payload = {
    id: myId,
    userName: myUserName,
    exp: parseInt(exp.getTime() / 1000),
  };
  const token = jwt.sign(payload, secret);
  return token;
};

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

const loginUser = async (req, res, next) => {
  try {
    // TODO: do validation here
    const { userName, password } = req.body;
    const firstName = userName.split(" ")[0];
    const lastName = userName.split(" ")[1];
    const user = await User.findOne({ firstName, lastName });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.id, user.userName);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      expires: expiryDate,
    });

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
};
router.post("/register", wrapAsync(createOneUser));
router.get("/", protectRoute, wrapAsync(getMyUser));
router.post("/login", wrapAsync(loginUser));

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
