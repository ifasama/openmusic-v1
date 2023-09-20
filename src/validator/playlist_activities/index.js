const {
  GetPlaylistActivitiesPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistActivitiesValidator = {
  validateGetPlaylistActivitiesPayload: (payload) => {
    const getValidationResult = GetPlaylistActivitiesPayloadSchema.validate(payload);

    if (getValidationResult.error) {
      throw new InvariantError(getValidationResult.error.message);
    }
  },
};

module.exports = PlaylistActivitiesValidator;
