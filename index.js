const joi = require('joi');

const joiMethod = function (respObj, schema) {
  const body = respObj.response.body;
  const result = joi.validate(body, schema);

  this.assert(!result.error,
    'expected body to match Joi schema',
    'expected body to not match Joi schema');
};

module.exports = joiMethod;
