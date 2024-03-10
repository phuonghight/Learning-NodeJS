const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const { constants, messageConstant } = require("../constant");

const authorize = (role = constants.role.user) =>
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.replace(
      `${constants.tokenType} `,
      constants.emptyString
    );
    if (!token || !req.headers.authorization.startsWith(constants.tokenType)) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, messageConstant.required("Token"))
      );
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await userService.getById(decoded.sub);
    if (!user)
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, messageConstant.token.invalid)
      );
    if (user.role !== constants.role.admin && role !== user.role)
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, messageConstant.unauthorized)
      );

    req.auth = user;
    return next();
  });

module.exports = { authorize };
