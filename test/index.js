const joiMethod = require('../index');
const joi = require('joi');
const chakram = require('chakram');
const chai = require('chai');
const expect = chakram.expect;

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
        }).to.throw(chai.AssertionError, /error: "id" is not allowed.\n data path: id/);
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
});
