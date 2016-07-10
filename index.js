const joi = require('joi');

const DEFAULT_OPTIONS = {
  abortEarly: true,
  presence: 'required',
  allowUnknown: true
};

const joiMethod = function (respObj, schema, options = {}) {
  const body = respObj.response.body;
  const result = joi.validate(body, schema,
    Object.assign({}, DEFAULT_OPTIONS, options));

  this.assert(!result.error,
    `expected body to match Joi schema ${errorMessages(result.error)}`,
    'expected body to not match Joi schema');
};

const errorMessages = (errors) => {
  if (!errors) return;

  return errors.details.reduce((message, error) =>
    `${message}\n-----\n error: ${error.message}.\n data path: ${error.path}`, '');
};

module.exports = joiMethod;
