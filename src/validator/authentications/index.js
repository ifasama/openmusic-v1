const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const postValidationResult = PostAuthenticationPayloadSchema.validate(payload);
    if (postValidationResult.error) {
      throw new InvariantError(postValidationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const putValidationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (putValidationResult.error) {
      throw new InvariantError(putValidationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const deleteValidationResult = DeleteAuthenticationPayloadSchema.validate(payload);
    if (deleteValidationResult.error) {
      throw new InvariantError(deleteValidationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
