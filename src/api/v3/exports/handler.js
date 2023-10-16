const autoBind = require('auto-bind');

class ExportHandler {
  constructor(service, playlistsService, validator) {
    this._service = service;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(req, h) {
    this._validator.validateExportPlaylistPayload(req.payload);
    const { playlistId } = req.params;
    const { id: user } = req.auth.credentials;

    // await this._playlistsService.verifyPlaylistExists(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, user);
    // const { targetEmail } = req.payload;
    // const playlist = await this._playlistsService.getPlaylistById(playlistId);
    // const output = await this._playlistSongsService.getAllPlaylistSongs(playlistId);

    // console.log(`email: ${targetEmail}`);
    // console.log(`playlist: ${playlistId}`);
    // console.log(`userId: ${user}`);

    const message = {
      playlistId,
      targetEmail: req.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    const res = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    res.code(201);
    return res;
  }
}

module.exports = ExportHandler;
