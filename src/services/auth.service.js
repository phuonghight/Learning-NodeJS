const httpStatus = require("http-status");
const bcrypt = require("bcrypt");

const prisma = require("../prisma-client");
const ApiError = require("../utils/ApiError");
const { messageConstant, constants } = require("../constant");
const { sendMail } = require("./mail.service");

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

const resetPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user)
    throw new ApiError(httpStatus.NOT_FOUND, messageConstant.notFound("Email"));

  const characters =
    "ABCDEFGHIJK0123456789LMNOPQRSTUVWXYZ0123456789abcdefghijklm0123456789nopqrstuvwxyz";
  let newPassword = "";
  for (let i = 0; i < 8; i++) {
    const randomPos = ~~(Math.random() * characters.length);
    newPassword += characters.charAt(randomPos);
  }

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

module.exports = { login, register, resetPassword };
