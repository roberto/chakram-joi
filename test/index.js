const chai = require('chai');
const chakram = require('chakram');
const expect = chakram.expect;
const joi = require('joi');
const joiMethod = require('../index');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");

chai.use(sinonChai);

describe('joiMethod', () => {
  before(() => {
    chakram.addMethod('joi', joiMethod);
  });

  const respObj = (obj) => ({
    response: {
      body: obj
    }
  });
  const schema = joi.object().keys({
    name: joi.string()
  });
  const validObject = {name: 'test'};
  const invalidObject = {id: 'test'};

  describe('positive assertion', () => {
    it('passes when object is valid', () => {
      expect(respObj(validObject)).to.joi(schema);
    });

    describe('for invalid object', () => {
      it('fails', () => {
        expect(() => {
          expect(respObj(invalidObject)).to.joi(schema);
        }).to.throw(chai.AssertionError, /expected body to match Joi schema/);
      });

      it('adds error message indicating issue', () => {
        expect(() => {
          expect(respObj(invalidObject)).to.joi(schema);
        }).to.throw(chai.AssertionError, /error: "name" is required.\n data path: name/);
      });
    });
  });

  describe('negative assertion', () => {
    it('passes when object is invalid', () => {
      expect(respObj(invalidObject)).not.to.joi(schema);
    });

    it('fails when object is valid', () => {
      expect(() => {
        expect(respObj(validObject)).not.to.joi(schema);
      }).to.throw(chai.AssertionError, /expected body to not match Joi schema/);
    });
  });

  describe('options', () => {
    let validate;

    beforeEach(() => {
      validate = sinon.spy(joi, 'validate');
    });

    afterEach(() => {
      validate.restore();
    });

    it('has about early, presence as required and allow unknown keys as default options', () => {
      expect(respObj(validObject)).to.joi(schema);
      expect(validate).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        {
          abortEarly: true,
          allowUnknown: true,
          presence: 'required'
        });
    });

    it('allows custom options', () => {
      expect(respObj(validObject)).to.joi(schema, { stripUnknown: true });
      expect(validate).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        {
          abortEarly: true,
          allowUnknown: true,
          presence: 'required',
          stripUnknown: true
        });
    });

    it('allows overriding default options', () => {
      expect(respObj(validObject)).to.joi(schema, { abortEarly: false });
      expect(validate).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        {
          abortEarly: false,
          allowUnknown: true,
          presence: 'required'
        });
    });
  });
});
