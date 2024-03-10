const Joi = require("joi");

const { message } = require("../constant");

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
};

module.exports = { register, login };
