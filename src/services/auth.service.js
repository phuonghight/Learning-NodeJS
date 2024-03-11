const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const prisma = require("../prisma-client");
const ApiError = require("../utils/ApiError");
const { messageConstant, constants } = require("../constant");
const otpService = require("./otp.service");
const { sendMail } = require("./mail.service");
const { passwordGenerator } = require("../utils/random");

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Email"));
  }
  if (!(await bcrypt.compareSync(password, user.password)))
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      messageConstant.password.incorrect
    );
  delete user.password;
  return user;
};

const register = async ({ fullName, email, password, avatar }) => {
  password = bcrypt.hashSync(password, constants.bcryptSalt);
  const user = await prisma.user.create({
    data: { fullName, email, password, avatar },
  });
  delete user.password;
  return user;
};

const sendOtp = async (email) => {
  const oldOtp = await otpService.getByEmail(email);
  let otp;
  if (oldOtp) otp = await otpService.updateOtpByEmail(email);
  else otp = await otpService.create(email);
  await sendMail(
    email,
    "Your OTP",
    `<p>This is your OTP: <b>${otp.otp}</b></p>
    <p>Your OTP is valid for 1 minute from the time you receive this email.</p>`
  );
};

const resetPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Email"));

  const newPassword = passwordGenerator(constants.passwordLength);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: bcrypt.hashSync(newPassword, constants.bcryptSalt),
    },
  });

  await sendMail(
    email,
    "New password",
    `<p>Your new password is: <b>${newPassword}</b></p>`
  );
};

module.exports = { login, register, sendOtp, resetPassword };
