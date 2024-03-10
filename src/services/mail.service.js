const nodemailer = require("nodemailer");

const { mail } = require("../config/config");

const sendMail = async (to, subject, html) => {
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: mail,
  });

  await transport.sendMail({
    from: `Learning NodeJS <no_reply@learning-node.com>`,
    to,
    subject,
    html,
  });
};

module.exports = { sendMail };
