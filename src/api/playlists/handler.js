const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getAllPlaylistsHandler = this.getAllPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
  }

  async postPlaylistHandler(req, h) {
    try {
      this._validator.validatePostPlaylistsPayload(req.payload);
      const { name } = req.payload;
      const { id: owner } = req.auth.credentials;

      const playlist_id = await this._service.addPlaylist(name, owner);
      // console.log(`handlerPlaylistId: ${playlistId}`);
      const res = h.response({
        status: 'success',
        data: {
          playlistId: playlist_id,
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

  async getAllPlaylistsHandler(req) {
    const { id: credentialId } = req.auth.credentials;
    const output = await this._service.getPlaylists(credentialId);
    return {
      status: 'success',
      data: {
        playlists: output,
      },
    };
  }

  async deletePlaylistByIdHandler(req, h) {
    try {
      const { id } = req.params;
      const { id: credentialId } = req.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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

module.exports = PlaylistHandler;
