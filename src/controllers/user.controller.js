const httpStatus = require("http-status");

const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { messageConstant, constants } = require("../constant");
const { destroyByPath } = require("../utils/destroyFile");
const ApiError = require("../utils/ApiError");

const getAll = catchAsync(async (req, res, next) => {
  const { page, limit, sortBy } = req.query;
  const users = await userService.getAll({ page, limit, sortBy });
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: users,
    error: null,
  });
});

const getById = catchAsync(async (req, res, next) => {
  const user = await userService.getById(req.params.id);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: { ...user },
    error: null,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: { ...req.auth },
    error: null,
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.avatar = "/" + req.file.path.replace(/\\/g, "/");
    await destroyByPath(req.auth.avatar);
  }
  const user = await userService.updateById(req.auth.id, req.body);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: { ...user },
    error: null,
  });
});

const deleteById = catchAsync(async (req, res, next) => {
  const user = await userService.deleteById(req.params.id);
  await destroyByPath(user.avatar);
  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: null,
    error: null,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const user = await userService.changePasswordById(
    req.auth.id,
    req.body.oldPassword,
    req.body.newPassword
  );

  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: user,
    error: null,
  });
});

module.exports = {
  getAll,
  getById,
  getMe,
  updateMe,
  deleteById,
  changePassword,
};
