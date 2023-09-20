const ClientError = require('../../exceptions/ClientError');

class PlaylistSongHandler {
  constructor(
    playlistSongsService,
    songService,
    playlistsService,
    // playlistActivitiesService,
    validator,
  ) {
    this._playlistSongsService = playlistSongsService;
    this._songService = songService;
    this._playlistsService = playlistsService;
    // this._playlistActivitiesService = playlistActivitiesService;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler(req, h) {
    try {
      this._validator.validatePlaylistSongPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId } = req.params;
      const { songId } = req.payload;
      await this._songService.verifySong(songId);

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.addPlaylistSong(playlistId, songId);
      // await this._playlistsService.addPlaylistActivities(playlistId,
      // songId, credentialId, 'add');

      const res = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
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
        message: 'Maaf ada gangguan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async getPlaylistSongHandler(req, h) {
    try {
      const { playlistId } = req.params;
      const { id: credentialId } = req.auth.credentials;
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistSongsService.getAllPlaylistSongs(playlistId);

      // playlist.songs = songs;
      // console.log(songs);
      // console.log({ ...playlist, songs });
      return {
        status: 'success',
        data: {
          playlist: {
            ...playlist,
            songs,
          },
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
        message: 'Maaf ada gangguan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }

  async deletePlaylistSongByIdHandler(req, h) {
    try {
      this._validator.validatePlaylistSongPayload(req.payload);
      const { songId } = req.payload;
      await this._songService.verifySong(songId);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId } = req.params;

      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._playlistSongsService.deletePlaylistSong(playlistId, songId);
      // await this._playlistService.addPlaylistActivities(playlistId,
      // songId, credentialId, 'delete');

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
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
        message: 'Maaf ada gangguan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = PlaylistSongHandler;
