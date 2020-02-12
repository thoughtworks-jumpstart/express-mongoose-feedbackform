express = require("express");
app = express();

app.use(express.urlencoded({ extended: true }));

const companiesRouter = require("./routes/companies.route");
app.use("/companies", companiesRouter);

app.get("/", (req, res) => {
  res.json({
    "0": "GET /",
    "1": "GET /user",
    "2": "GET /companies",
    "3": "GET /companies/:id",
    "4": "POST /companies/:id/reviews",
  });
});
module.exports = app;
