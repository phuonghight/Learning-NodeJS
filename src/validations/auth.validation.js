const Joi = require("joi");
const { constants } = require("../constant");

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(constants.passwordLength).required(),
    otp: Joi.number().min(100000).max(999999).required(),
  }),
};

const sendOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.number().min(100000).max(999999).required(),
  }),
};

module.exports = { sendOtp, register, login, resetPassword };
