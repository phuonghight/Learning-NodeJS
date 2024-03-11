const bcrypt = require("bcrypt");

const app = require("./app");
const prisma = require("./prisma-client");
const config = require("./config/config");
const logger = require("./config/winston.config");
const { constants } = require("./constant");

prisma
  .$connect()
  .then(async () => {
    logger.info(`✅ MySQL Database is connected`);

    if ((await prisma.user.count()) === 0) {
      await prisma.otp.create({
        data: {
          email: config.admin.email,
          otp: 0,
          deletedAt: new Date(),
        },
      });
      await prisma.user.create({
        data: {
          fullName: config.admin.fullName,
          email: config.admin.email,
          password: bcrypt.hashSync(
            config.admin.password,
            constants.bcryptSalt
          ),
          avatar: constants.emptyString,
          role: constants.role.admin,
        },
      });
    }

    app.listen(config.app.port, () => {
      logger.info(
        `✨ ${config.app.name} is running at http://localhost:${config.app.port}`
      );
    });
  })
  .catch((err) => {
    logger.error(`❌ Connect to MySQL Database is failed`);
    logger.error(err);
  });
