# Chakram-Joi

This project add assertions to [Chakram](https://github.com/dareid/chakram) for checking responses schema using [Joi](https://github.com/hapijs/joi).

## Installation

```
npm install --save-dev chakram-joi
```

## Setup

```js
chakram.addMethod('joi', require('chakram-joi'));
```

## Usage

```js
it('has correct schema', () => {
  const schema = joi.object().keys({
    name: joi.string()
  });

  expect(response).to.joi(schema);
});
```

## License

MIT
