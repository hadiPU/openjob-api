const Joi = require('joi');

const companySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').required(),
  location: Joi.string().allow('').required(),
  website: Joi.string().allow('', null).optional(),
});

const companyUpdateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  website: Joi.string().allow('', null).optional(),
});

module.exports = { companySchema, companyUpdateSchema };