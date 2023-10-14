const autoBind = require('auto-bind');

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverHandler(req, h) {
    const { data } = req.payload;
    const { id } = req.params;
    this._validator.validateImageHeaders(data.hapi.headers);

    const filename = await this._service.writeFile(data, data.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/covers/${filename}`;

    await this._service.addCoverUrl(id, coverUrl);
    const res = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: coverUrl,
      },
    });
    res.code(201);
    return res;
  }
}

module.exports = UploadHandler;
