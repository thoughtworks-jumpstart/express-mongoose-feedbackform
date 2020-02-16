const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    minlength: 32,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

userSchema.virtual("userName").get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toObject", { getters: true });
userSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

userSchema.pre("save", async function(next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
