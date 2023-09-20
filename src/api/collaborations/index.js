const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    collaborationService,
    playlistsService,
    usersService,
    validator,
  }) => {
    const collaborationHandler = new CollaborationHandler(
      collaborationService,
      playlistsService,
      usersService,
      validator,
    );
    server.route(routes(collaborationHandler));
  },
};
