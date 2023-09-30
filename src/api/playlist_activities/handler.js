const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistsService) {
    this._playlistActivitiesService = playlistActivitiesService;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(req) {
    const { pid } = req.params;
    const { id: userId } = req.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(pid, userId);
    const activities = await this._playlistActivitiesService.getPlaylistActivities(pid);

    return {
      status: 'success',
      data: {
        playlistId: pid,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
