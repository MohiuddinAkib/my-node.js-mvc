const Joi = require('joi');
const _ = require('lodash');

// Customer Schema
const UserSchema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .trim(),
  email: Joi.string()
    .min(5)
    .max(255)
    .required()
    .email()
    .trim()
});

module.exports = userValidateInput = data => {
  const errors = {};
  let values = {};

  UserSchema.validate(data, (err, value) => {
    if (err) {
      errors[err.details[0].path[0]] = err.details[0].message;
      return;
    }
    values = value;
  });

  return {
    errors,
    values,
    isValid: _.isEmpty(errors)
  };
};
