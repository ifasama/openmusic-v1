const ClientError = require('../../exceptions/ClientError');

class CollaborationHandler {
  constructor(collaborationService, playlistsService, usersService, validator) {
    this._collaborationService = collaborationService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(req, h) {
    try {
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

  async deleteCollaborationHandler(req, h) {
    try {
      this._validator.validateCollaborationPayload(req.payload);
      const { id: credentialId } = req.auth.credentials;
      const { playlistId, userId } = req.payload;

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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

module.exports = CollaborationHandler;
