const joiMethod = require('../index');
const joi = require('joi');
const chakram = require('chakram');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const expect = chakram.expect;

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
      expect(respObj(validObject)).to.joi(schema);
    });

    it('has about early, presence as required and allow unknown keys as default options', () => {
      expect(validate).to.have.been.calledWith(
        sinon.match.any,
        sinon.match.any,
        {
          abortEarly: true,
          presence: 'required',
          allowUnknown: true
        });
    });
  });
});
