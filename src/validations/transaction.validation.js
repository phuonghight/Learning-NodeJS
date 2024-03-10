const Joi = require("joi");

const getAll = {
  query: Joi.object().keys({
    keyword: Joi.string().optional(),
    page: Joi.number().positive().min(1).optional(),
    limit: Joi.number().positive().min(1).optional(),
    sortBy: Joi.string().optional(),
  }),
};
const create = {
  body: Joi.object().keys({
    total: Joi.number().required(),
    note: Joi.string().required(),
    date: Joi.date().required(),
    location: Joi.string().optional(),
    withPerson: Joi.string().optional(),
  }),
};
const update = {
  body: Joi.object().keys({
    total: Joi.number().optional(),
    note: Joi.string().optional(),
    date: Joi.date().optional(),
    location: Joi.string().optional(),
    withPerson: Joi.string().optional(),
  }),
};

module.exports = { create, update };
