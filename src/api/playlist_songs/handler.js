const autoBind = require('auto-bind');

class PlaylistSongHandler {
  constructor(
    playlistSongsService,
    songService,
    playlistsService,
    playlistActivitiesService,
    validator,
  ) {
    this._playlistSongsService = playlistSongsService;
    this._songService = songService;
    this._playlistsService = playlistsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(req, h) {
    this._validator.validatePlaylistSongPayload(req.payload);
    const { id: userId } = req.auth.credentials;
    const { playlistId } = req.params;
    const { songId } = req.payload;
    await this._songService.verifySong(songId);

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistSongsService.addPlaylistSong(playlistId, songId, userId);
    await this._playlistActivitiesService.addPlaylistActivities(playlistId, songId, userId, 'add');

    const res = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
    });
    res.code(201);
    return res;
  }

  async getPlaylistSongHandler(req) {
    const { playlistId } = req.params;
    const { id: userId } = req.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const output = await this._playlistSongsService.getAllPlaylistSongs(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs: output,
        },
      },
    };
  }

  async deletePlaylistSongByIdHandler(req) {
    this._validator.validatePlaylistSongPayload(req.payload);
    const { songId } = req.payload;
    const { id: credentialId } = req.auth.credentials;
    const { playlistId } = req.params;

    await this._playlistSongsService.deletePlaylistSong(playlistId, songId, credentialId);
    await this._playlistActivitiesService.addPlaylistActivities(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistSongHandler;
