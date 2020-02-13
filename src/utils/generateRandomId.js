module.exports = () => {
  let randomId = require("crypto")
    .randomBytes(256 / 8)
    .toString("hex");
  randomId =
    randomId.substring(0, 8) +
    "-" +
    randomId.substring(9, 13) +
    "-" +
    randomId.substring(14, 18) +
    "-" +
    randomId.substring(19, 23) +
    "-" +
    randomId.substring(24, 32);
  return randomId;
};
