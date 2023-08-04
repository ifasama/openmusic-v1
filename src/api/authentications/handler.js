const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
    this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
    this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
  }

  async postAuthenticationsHandler(req, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      // SERVER ERROR
      const res = h.response({
        status: 'error',
        message: 'Maaf ada masalah pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async putAuthenticationsHandler(req, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      // SERVER ERROR
      const res = h.response({
        status: 'error',
        message: 'Maaf ada masalah pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async deleteAuthenticationsHandler(req, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.payload);
      const { refreshToken } = req.payload;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      // SERVER ERROR
      const res = h.response({
        status: 'error',
        message: 'Maaf ada masalah pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = AuthenticationsHandler;
