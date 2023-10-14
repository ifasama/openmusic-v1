const ExportHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    const exportHandler = new ExportHandler(service, playlistsService, validator);
    server.route(routes(exportHandler));
  },
};
