const Joi = require('joi');

const applicationSchema = Joi.object({
  job_id: Joi.string().required(),
  cover_letter: Joi.string().allow('').optional(),
}).unknown(true); 

const applicationStatusSchema = Joi.object({
  status: Joi.string().required(),
}).unknown(true);

module.exports = { applicationSchema, applicationStatusSchema };