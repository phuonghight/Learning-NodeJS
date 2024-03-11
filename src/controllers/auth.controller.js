const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const jwt = require("../utils/jwt");
const { authService, otpService } = require("../services");
const { messageConstant } = require("../constant");

const login = catchAsync(async (req, res, next) => {
  const user = await authService.login(req.body);
  const { accessToken, type } = jwt.generateToken(user);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: { accessToken, type, user },
    error: null,
  });
});

const sendOtp = catchAsync(async (req, res, next) => {
  await authService.sendOtp(req.body.email);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: messageConstant.mail.success("an OTP"),
    error: null,
  });
});

const register = catchAsync(async (req, res, next) => {
  const data = req.body;
  if (req.file) {
    data.avatar = "/" + req.file.path.replace(/\\/g, "/");
  } else {
    return res.status(httpStatus.CREATED).json({
      code: httpStatus.CREATED,
      message: messageConstant.status.error,
      data: null,
      error: messageConstant.required("Avatar"),
    });
  }
  await otpService.verify(data.email, data.otp);
  const newUser = await authService.register(data);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: { user: newUser },
    error: null,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  await otpService.verify(req.body.email, req.body.otp);
  await authService.resetPassword(req.body.email);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.mail.success("a new password"),
    data: null,
    error: null,
  });
});

module.exports = { login, register, sendOtp, resetPassword };
