const httpStatus = require("http-status");

const config = require("../config/config");
const prisma = require("../prisma-client");
const ApiError = require("../utils/ApiError");
const { otpGenerator } = require("../utils/random");
const { messageConstant, constants } = require("../constant");

const create = async (email) => {
  const otp = await prisma.otp.create({
    data: {
      email,
      otp: otpGenerator(constants.otpLength),
      deletedAt: new Date(Date.now() + config.otp.exp * 60 * 1000),
    },
  });
  return otp;
};

const getByEmail = async (email) => {
  const otp = await prisma.otp.findUnique({
    where: { email },
  });
  return otp;
};

const updateOtpByEmail = async (email) => {
  const otp = await prisma.otp.update({
    where: { email },
    data: {
      otp: otpGenerator(constants.otpLength),
      deletedAt: new Date(Date.now() + config.otp.exp * 60 * 1000),
    },
  });
  return otp;
};

const verify = async (email, _otp) => {
  const otp = await getByEmail(email);
  if (!otp) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      messageConstant.notFound("Email")
    );
  }
  if (otp.otp !== parseInt(_otp)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messageConstant.otp.invalid);
  }
  if (new Date(otp.deletedAt) < new Date()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, messageConstant.otp.expired);
  }
};

module.exports = { create, getByEmail, updateOtpByEmail, verify };
