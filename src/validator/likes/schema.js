const Joi = require('joi');

const LikesPayloadSchema = Joi.object({
  userId: Joi.string().required(),
  albumId: Joi.string().required(),
});

module.exports = { LikesPayloadSchema };
