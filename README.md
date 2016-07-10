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

## Basic Usage

```js
const schema = joi.object().keys({
  name: joi.string()
});

expect(response).to.joi(schema);
```

## Custom Options

Joi has several [options for validation](https://github.com/hapijs/joi/blob/v9.0.0/API.md#validatevalue-schema-options-callback) and it's possible to use them as shown bellow:

```js
expect(response).to.joi(schema, { abortEarly: false });
```

Default options:

```yml
abortEarly: true,     #stops validation on the first error
presence: 'required', #declared items must be found
allowUnknown: true    #unknown object keys are ignored
```


## License

MIT
