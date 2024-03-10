const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const jwt = require("../utils/jwt");
const { authService } = require("../services");
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

  const newUser = await authService.register(data);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: { user: newUser },
    error: null,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  await authService.resetPassword(req.body.email);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: "We just have send a new password to your email. Check it now!",
    data: null,
    error: null,
  });
});

module.exports = { login, register, resetPassword };
