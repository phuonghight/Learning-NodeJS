const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const prisma = require("../prisma-client");
const ApiError = require("../utils/ApiError");
const { messageConstant, constants } = require("../constant");

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
  const data = { fullName, email, password, avatar };
  data.password = bcrypt.hashSync(password, constants.bcryptSalt);
  const user = await prisma.user.create({ data });
  delete user.password;
  return user;
};

module.exports = { login, register };
