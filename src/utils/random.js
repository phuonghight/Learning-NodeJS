const { constants } = require("../constant");

const otpGenerator = (length = constants.otpLength) => {
  let otp = 0;
  for (let i = 0; i < length; i++) {
    const t = ~~(Math.random() * 10);
    otp = otp * 10 + t;
  }
  return otp;
};
const passwordGenerator = (length = constants.passwordLength) => {
  const characters =
    "ABCDEFGHIJK0123456789LMNOPQRSTUVWXYZ0123456789abcdefghijklm0123456789nopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomPos = ~~(Math.random() * characters.length);
    password += characters.charAt(randomPos);
  }
  return password;
};

module.exports = { otpGenerator, passwordGenerator };
