const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // saran untuk menggunakan autobind (tapi nyoba nggak bisa)
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(req, h) {
    try {
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
    } catch (error) {
      // saran menggunakan onPreResponse tapi sudah dicoba tidak berjalan
      if (error instanceof ClientError) {
        const res = h.response({
          status: 'fail',
          message: error.message,
        });
        res.code(error.statusCode);
        return res;
      }

      const res = h.response({
        status: 'error',
        message: 'Maaf ada kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async getAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);

      return {
        status: 'success',
        data: {
          album,
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

      const res = h.response({
        status: 'error',
        message: 'Maaf ada kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async putAlbumByIdHandler(req, h) {
    try {
      this._validator.validateAlbumPayload(req.payload);
      const { id } = req.params;

      await this._service.editAlbumById(id, req.payload);
      return {
        status: 'success',
        message: 'Album berhasil diubah',
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

      const res = h.response({
        status: 'error',
        message: 'Maaf ada kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async deleteAlbumByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
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

      const res = h.response({
        status: 'error',
        message: 'Maaf ada kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = AlbumsHandler;
