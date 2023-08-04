const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUsersHandler = this.postUsersHandler.bind(this);
  }

  async postUsersHandler(req, h) {
    try {
      this._validator.validateUsersPayload(req.payload);
      const { username, password, fullname } = req.payload;

      const userId = await this._service.addUser({ username, password, fullname });

      const res = h.response({
        status: 'success',
        data: {
          userId,
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
        message: 'Maaf terjadi kegagalan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = UsersHandler;
