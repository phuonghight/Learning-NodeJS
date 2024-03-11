module.exports.messageConstant = require("./message.constant");
module.exports.routesConstant = require("./routes.constant");
module.exports.stringConstant = require("./string.constant");
module.exports.requsetFieldConstant = require("./requsetField.constant");
module.exports.constants = {
  passwordLength: 8,
  otpLength: 6,
  pageDefault: 1,
  limitDefault: 10,
  sortByDefault: "createdAt",
  bcryptSalt: 11,
  uploadDirectory: "uploads",
  role: {
    user: "USER",
    admin: "ADMIN",
  },
  tokenType: "Bearer",
  emptyString: "",
  imageFileAllowed: [".png", ".jpg", ".jpeg", ".heic"],
};
