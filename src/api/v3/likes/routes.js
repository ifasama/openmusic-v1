const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: handler.postLikesHandler,
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: handler.getLikesHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}/likes',
    handler: handler.deleteLikesHandler,
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
