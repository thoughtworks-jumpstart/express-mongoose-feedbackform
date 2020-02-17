const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const wrapAsync = require("../utils/wrapAsync");
const generateRandomId = require("../utils/generateRandomId");
const { protectRoute, createJWTToken } = require("../../middlewares/auth");

const createOneUser = async (req, res, next) => {
  const user = new User(req.body);
  await User.init();
  user.id = generateRandomId();
  const newUser = await user.save();
  res.status(201).send(user.toObject());
};

const getMyUser = async (req, res, next) => {
  const user = await User.findOne({ id: req.user.id }, "-__v -_id -password");
  res.send(user);
};

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

const createLoginToken = async (req, res, next) => {
  try {
    // TODO: do validation here
    const { userName, password } = req.body;
    const firstName = userName.split(" ")[0];
    const lastName = userName.split(" ")[1];
    const user = await User.findOne({ firstName, lastName });
    if (!user) {
      throw new Error("Login failed");
    }
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.id, user.userName);
    req.token = token;
    next();
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
};

const createSignedCookieWithToken = (req, res, next) => {
  createSignedCookieMiddleware(req.token)(req, res, next);
};

const createSignedCookieMiddleware = content => (req, res, next) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = oneDay * 7;
  const expiryDate = new Date(Date.now() + oneWeek);
  res.cookie("token", content, {
    expires: expiryDate,
    secure: false,
    sameSite: "none",
    signed: true,
  });
  next();
};

const sendLoggedInMessage = (req, res) => {
  res.send("You are now logged in!");
};

router.post("/register", wrapAsync(createOneUser));
router.get("/", protectRoute, wrapAsync(getMyUser));
router.post(
  "/login",
  wrapAsync(createLoginToken),
  createSignedCookieWithToken,
  sendLoggedInMessage
);
router.get(
  "/signedcookies",
  createSignedCookieMiddleware("nothing"),
  sendLoggedInMessage
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  next(err);
});

module.exports = router;
