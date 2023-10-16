const routes = require('./routes');
const LikesHandler = require('./handler');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, {
    service, usersService, albumsService, validator,
  }) => {
    const likesHandler = new LikesHandler(service, usersService, albumsService, validator);
    server.route(routes(likesHandler));
  },
};
