const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUsersHandler(req, h) {
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
  }
}

module.exports = UsersHandler;
