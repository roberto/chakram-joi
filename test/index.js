'use strict';

var chai = require('chai');
var chakram = require('chakram');
var expect = chakram.expect;
var joi = require('joi');
var joiMethod = require('../index');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");

chai.use(sinonChai);

describe('joiMethod', function () {
  before(function () {
    chakram.addMethod('joi', joiMethod);
  });

  var respObj = function respObj(obj) {
    return {
      response: {
        body: obj
      }
    };
  };
  var schema = joi.object().keys({
    name: joi.string()
  });
  var validObject = { name: 'test' };
  var invalidObject = { id: 'test' };

  describe('positive assertion', function () {
    it('passes when object is valid', function () {
      expect(respObj(validObject)).to.joi(schema);
    });

    describe('for invalid object', function () {
      it('fails', function () {
        expect(function () {
          expect(respObj(invalidObject)).to.joi(schema);
        }).to.throw(chai.AssertionError, /expected body to match Joi schema/);
      });

      it('adds error message indicating issue', function () {
        expect(function () {
          expect(respObj(invalidObject)).to.joi(schema);
        }).to.throw(chai.AssertionError, /error: "name" is required.\n data path: name/);
      });
    });
  });

  describe('negative assertion', function () {
    it('passes when object is invalid', function () {
      expect(respObj(invalidObject)).not.to.joi(schema);
    });

    it('fails when object is valid', function () {
      expect(function () {
        expect(respObj(validObject)).not.to.joi(schema);
      }).to.throw(chai.AssertionError, /expected body to not match Joi schema/);
    });
  });

  describe('options', function () {
    var validate;

    beforeEach(function () {
      validate = sinon.spy(joi, 'validate');
    });

    afterEach(function () {
      validate.restore();
    });

    it('has about early, presence as required and allow unknown keys as default options', function () {
      expect(respObj(validObject)).to.joi(schema);
      expect(validate).to.have.been.calledWith(sinon.match.any, sinon.match.any, {
        abortEarly: true,
        allowUnknown: true,
        presence: 'required'
      });
    });

    it('allows custom options', function () {
      expect(respObj(validObject)).to.joi(schema, { stripUnknown: true });
      expect(validate).to.have.been.calledWith(sinon.match.any, sinon.match.any, {
        abortEarly: true,
        allowUnknown: true,
        presence: 'required',
        stripUnknown: true
      });
    });

    it('allows overriding default options', function () {
      expect(respObj(validObject)).to.joi(schema, { abortEarly: false });
      expect(validate).to.have.been.calledWith(sinon.match.any, sinon.match.any, {
        abortEarly: false,
        allowUnknown: true,
        presence: 'required'
      });
    });
  });
});
