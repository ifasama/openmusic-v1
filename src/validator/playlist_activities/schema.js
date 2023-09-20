const Joi = require('joi');

const GetPlaylistActivitiesPayloadSchema = {
  playlistId: Joi.string().required(),
};

module.exports = {
  GetPlaylistActivitiesPayloadSchema,
};
