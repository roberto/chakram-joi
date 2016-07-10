const joi = require('joi');

const joiMethod = function (respObj, schema) {
  const body = respObj.response.body;
  const result = joi.validate(body, schema);

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
