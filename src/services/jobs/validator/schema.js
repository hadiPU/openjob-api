const Joi = require('joi');

const jobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  salary: Joi.string().allow('', null).optional(),
  location: Joi.string().allow('').optional(),
  type: Joi.string().optional(),
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  job_type: Joi.string().optional(),
  experience_level: Joi.string().optional(),
  location_type: Joi.string().optional(),
  location_city: Joi.string().allow('').optional(),
  salary_min: Joi.number().optional(),
  salary_max: Joi.number().optional(),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string().optional(),
}).unknown(true);

module.exports = { jobSchema };