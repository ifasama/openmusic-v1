const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = { PostPlaylistsPayloadSchema };
