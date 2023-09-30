const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationsHandler(req, h) {
    this._validator.validatePostAuthenticationPayload(req.payload);

    const { username, password } = req.payload;
    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const res = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    res.code(201);
    return res;
  }

  async putAuthenticationsHandler(req) {
    this._validator.validatePutAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationsHandler(req) {
    this._validator.validateDeleteAuthenticationPayload(req.payload);
    const { refreshToken } = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
