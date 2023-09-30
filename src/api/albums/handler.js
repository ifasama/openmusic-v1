const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(req, h) {
    this._validator.validateAlbumPayload(req.payload);
    const { name, year } = req.payload;
    const album_id = await this._service.addAlbum({ name, year });

    const res = h.response({
      status: 'success',
      data: {
        albumId: album_id,
      },
    });
    res.code(201);
    return res;
  }

  async getAlbumByIdHandler(req) {
    const { id } = req.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(req) {
    this._validator.validateAlbumPayload(req.payload);
    const { id } = req.params;

    await this._service.editAlbumById(id, req.payload);
    return {
      status: 'success',
      message: 'Album berhasil diubah',
    };
  }

  async deleteAlbumByIdHandler(req) {
    const { id } = req.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
