const LikesPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const LikesValidator = {
  validateLikesPayload: (payload) => {
    const validationResult = LikesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = LikesValidator;
