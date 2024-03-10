const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const { constants, messageConstant } = require("../constant");
const prisma = require("../prisma-client");
const ApiError = require("../utils/ApiError");

const getAll = async ({ page, limit, sortBy }) => {
  page = parseInt(page) || constants.pageDefault;
  limit = parseInt(limit) || constants.limitDefault;
  sortBy ??= constants.sortByDefault;
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        fullName: true,
        email: true,
        avatar: true,
        role: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sortBy]: "asc",
      },
    }),
    prisma.user.count(),
  ]);
  return { users, page, limit, total, sortBy };
};
const getById = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      fullName: true,
      email: true,
      avatar: true,
      role: true,
    },
  });
  return user;
};
const getByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      fullName: true,
      email: true,
      avatar: true,
      role: true,
    },
  });
  return user;
};
const updateById = async (id, user) => {
  const { fullName, email, avatar } = user;
  const updateUser = await prisma.user.update({
    where: {
      id,
    },
    data: { fullName, email, avatar },
  });
  delete updateUser.password;
  return updateUser;
};
const deleteById = async (id) => {
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return user;
};
const changePasswordById = async (id, oldPassword, newPassword) => {
  let user = await prisma.user.findUnique({ where: { id } });
  if (!bcrypt.compareSync(oldPassword, user.password)) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      messageConstant.password.incorrect
    );
  }
  user = await prisma.user.update({
    where: { id },
    data: {
      password: bcrypt.hashSync(newPassword, constants.bcryptSalt),
    },
  });
  delete user.password;
  return user;
};

module.exports = {
  getAll,
  getById,
  getByEmail,
  updateById,
  deleteById,
  changePasswordById,
};
