const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{pid}/activities',
    handler: handler.getPlaylistActivitiesHandler,
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
