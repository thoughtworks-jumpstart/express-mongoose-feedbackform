require("dotenv").config();
require("./utils/db");

express = require("express");
app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser("secret"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const companiesRouter = require("./routes/companies.route");
app.use("/companies", companiesRouter);

const userRouter = require("./routes/user.route");
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.json({
    "0": "GET /",
    "1": "GET /user",
    "2": "GET /companies",
    "3": "GET /companies/:id",
    "4": "POST /companies/:id/reviews",
    "5": "POST /user/login",
    "6": "POST /user/logout",
  });
});

app.get("/*", (req, res, next) => {
  const error = new Error("page not found");
  error.statusCode = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "internal server error" });
  }
});
module.exports = app;
