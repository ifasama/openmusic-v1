const PlaylistSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlist_songs',
  version: '1.0.0',
  register: async (server, {
    playlistSongsService,
    songService,
    playlistsService,
    playlistActivitiesService,
    validator,
  }) => {
    const playlistSongHandler = new PlaylistSongHandler(
      playlistSongsService,
      songService,
      playlistsService,
      playlistActivitiesService,
      validator,
    );
    server.route(routes(playlistSongHandler));
  },
};
