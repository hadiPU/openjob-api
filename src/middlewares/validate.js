const InvariantError = require('../exceptions/InvariantError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new InvariantError(error.details.map((d) => d.message).join(', ')));
  }
  next();
};

module.exports = validate;