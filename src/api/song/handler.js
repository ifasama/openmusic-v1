const ClientError = require('../../exceptions/ClientError');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      // katanya destructuring tidak diperlukan karena redundan dengan
      // di services, tapi saat dihilangkan, muncul problem
      // karena variable tidak diinisiasi
      const {
        title, year, performer, genre, duration, albumId,
      } = req.payload;

      const songId = await this._service.addSong({
        title, year, performer, genre, duration, albumId,
      });

      const res = h.response({
        status: 'success',
        data: {
          songId,
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
        message: 'maaf terjadi kegagalan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async getSongsHandler(req, h) {
    try {
      const { title, performer } = req.query;
      const songs = await this._service.getSongs(title, performer);

      return {
        status: 'success',
        data: {
          songs,
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
        message: 'maaf terjadi kegagalan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async getSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      // console.log(error);
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
        message: 'Maaf terjadi kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async putSongByIdHandler(req, h) {
    try {
      this._validator.validateSongPayload(req.payload);
      const { id } = req.params;
      await this._service.editSongById(id, req.payload);

      return {
        status: 'success',
        message: 'Lagu berhasil diubah',
      };
    } catch (error) {
      // console.log(error);
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
        message: 'Maaf terjadi kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async deleteSongByIdHandler(req, h) {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      // console.log(error);
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
        message: 'Maaf terjadi kegagalan pada server',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = SongHandler;
