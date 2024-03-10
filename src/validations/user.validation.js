const Joi = require("joi");

const getAll = {
  query: Joi.object().keys({
    page: Joi.number().positive().min(1).optional(),
    limit: Joi.number().positive().optional(),
    sortBy: Joi.string().optional(),
  }),
};
const getById = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
  }),
};

module.exports = { getById, getAll, changePassword };
