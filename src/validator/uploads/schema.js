const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();
// valid is a variadic function (function of indefinite arity, like rest parameter) that will
// validate when the content-type property value is defined
// MIME type (types for pictures) is available to see on MDN

module.exports = { ImageHeadersSchema };
