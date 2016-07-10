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

  describe('positive assertion', () => {
    it('passes when object is valid', () => {
      expect(respObj({name: 'test'})).to.joi(schema);
    });

    it('fails when object is invalid', () => {
      expect(() => {
        expect(respObj({id: 'test'})).to.joi(schema);
      }).to.throw(chai.AssertionError, /expected body to match Joi schema/);
    });
  });

  describe('negative assertion', () => {
    it('passes when object is invalid', () => {
      expect(respObj({id: 'test'})).not.to.joi(schema);
    });

    it('fails when object is valid', () => {
      expect(() => {
        expect(respObj({name: 'test'})).not.to.joi(schema);
      }).to.throw(chai.AssertionError, /expected body to not match Joi schema/);
    });
  });
});
