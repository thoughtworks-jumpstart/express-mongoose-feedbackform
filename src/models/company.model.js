const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companySuffix: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reviews: [
    {
      id: { type: String, required: true },
      userId: { type: String, required: true },
      userName: { type: String, required: true },
      rating: { type: Number, required: true },
      title: { type: String, required: true },
      review: { type: String, required: true },
    },
  ],
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
