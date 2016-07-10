'use strict';

var joi = require('joi');

var DEFAULT_OPTIONS = {
  abortEarly: true,
  presence: 'required',
  allowUnknown: true
};

var joiMethod = function joiMethod(respObj, schema, options) {
  if (!options) options = {};

  var body = respObj.response.body;
  var result = joi.validate(body, schema,
    Object.assign({}, DEFAULT_OPTIONS, options));

  this.assert(!result.error,
    'expected body to match Joi schema ' + errorMessages(result.error),
    'expected body to not match Joi schema');
};

var errorMessages = function errorMessages(errors) {
  if (!errors) return;

  return errors.details.reduce(function (message, error) {
    return message + '\n-----\n error: ' + error.message + '.\n data path: ' + error.path;
  }, '');
};

module.exports = joiMethod;
