const ClientError = require('../../exceptions/ClientError');

class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService, validator) {
    this._playlistActivitiesService = playlistActivitiesService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  async getPlaylistActivitiesHandler(req, h) {
    try {
      // this._validator.validateGetPlaylistActivitiesPayload(req.payload);
      const { id } = req.params;
      // const { id: credentialId } = req.auth.credentials;

      // await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const activities = await this._playlistActivitiesService.getPlaylistActivities(id);
      console.log(activities);
      return {
        status: 'success',
        data: {
          playlistId: id,
          activities,
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
        message: 'Mohon maaf ada gangguan pada server kami',
      });
      res.code(500);
      console.error(error);
      return res;
    }
  }
}

module.exports = PlaylistActivitiesHandler;
