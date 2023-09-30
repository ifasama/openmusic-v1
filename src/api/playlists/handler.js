const autoBind = require('auto-bind');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(req, h) {
    const { name } = req.payload;
    const { id: owner } = req.auth.credentials;
    this._validator.validatePostPlaylistsPayload(req.payload);

    const playlistId = await this._service.addPlaylist(name, owner);
    const res = h.response({
      status: 'success',
      data: {
        playlistId,
      },
    });
    res.code(201);
    return res;
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

  async deletePlaylistByIdHandler(req) {
    const { id } = req.params;
    const { id: credentialId } = req.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistHandler;
