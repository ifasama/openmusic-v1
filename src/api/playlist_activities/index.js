const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist_activities',
  version: '1.0.0',
  register: async (server, {
    playlistActivitiesService,
    playlistsService,
    // validator,
  }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(
      playlistActivitiesService,
      playlistsService,
      // validator,
    );
    server.route(routes(playlistActivitiesHandler));
  },
};
