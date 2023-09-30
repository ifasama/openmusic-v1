const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(collaborationService, playlistsService, usersService, validator) {
    this._collaborationService = collaborationService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(req, h) {
    this._validator.validateCollaborationPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._usersService.getUserById(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collabId = await this._collaborationService.addCollaboration(playlistId, userId);

    const res = h.response({
      status: 'success',
      data: {
        collaborationId: collabId,
      },
    });
    res.code(201);
    return res;
  }

  async deleteCollaborationHandler(req) {
    this._validator.validateCollaborationPayload(req.payload);
    const { id: credentialId } = req.auth.credentials;
    const { playlistId, userId } = req.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationHandler;
