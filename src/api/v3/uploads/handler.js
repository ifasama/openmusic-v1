const autoBind = require('auto-bind');

class UploadHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadCoverHandler(req, h) {
    const { cover } = req.payload;
    const { albumId } = req.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/covers/${filename}`;

    await this._service.addCoverUrl(albumId, fileLocation);
    const res = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation,
      },
    });
    res.code(201);
    return res;
  }
}

module.exports = UploadHandler;
