const httpStatus = require("http-status");

const { transactionService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { messageConstant, requsetFieldConstant } = require("../constant");
const ApiError = require("../utils/ApiError");

const getAllOfCurUser = catchAsync(async (req, res, next) => {
  const { keyword, page, limmit, sortBy } = req[requsetFieldConstant.query];
  const transactions = await transactionService.getAllByUserId(req.auth.id, {
    keyword,
    page,
    limmit,
    sortBy,
  });
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: transactions,
    error: null,
  });
});

const getByIdOfCurUser = catchAsync(async (req, res, next) => {
  const transaction = await transactionService.getById(req.params.id);
  if (!transaction)
    return next(
      new ApiError(
        httpStatus.NOT_FOUND,
        messageConstant.notFound(`Transaction with id: ${req.params.id}`)
      )
    );
  if (transaction.userId !== req.auth.id)
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized)
    );
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: transaction,
    error: null,
  });
});

const updateByIdOfCurUser = catchAsync(async (req, res, next) => {
  const t = await transactionService.getById(req.params.id);
  if (!t)
    return next(
      new ApiError(
        httpStatus.NOT_FOUND,
        messageConstant.notFound(`Transaction with id: ${req.params.id}`)
      )
    );
  if (t.userId !== req.auth.id)
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized)
    );
  const transaction = await transactionService.updateById(
    req.params.id,
    req.body
  );
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: transaction,
    error: null,
  });
});

const create = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.imgUrl = "/" + req.file.path.replace(/\\/g, "/");
  }
  const transaction = await transactionService.create(req.auth.id, req.body);
  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: messageConstant.status.success,
    data: transaction,
    error: null,
  });
});

const deleteByIdOfCurUser = catchAsync(async (req, res, next) => {
  const t = await transactionService.getById(req.params.id);
  if (!t)
    return next(
      new ApiError(
        httpStatus.NOT_FOUND,
        messageConstant.notFound(`Transaction with id: ${req.params.id}`)
      )
    );
  if (t.userId !== req.auth.id)
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized)
    );
  await transactionService.deleteById(t.id);
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: messageConstant.status.success,
    data: null,
    error: null,
  });
});

module.exports = {
  getAllOfCurUser,
  getByIdOfCurUser,
  create,
  updateByIdOfCurUser,
  deleteByIdOfCurUser,
};
