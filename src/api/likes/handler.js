const autoBind = require('auto-bind');

class LikesHandler {
  constructor(service, usersService, albumsService, validator) {
    this._service = service;
    this._usersService = usersService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postLikesHandler(req, h) {
    // this._validator.validateLikesPayload(req.payload);
    const { id: user } = req.auth.credentials;
    const { albumId } = req.params;

    await this._usersService.verifyUserId(user);
    await this._albumsService.getAlbumById(albumId);
    await this._service.addLikes(user, albumId);

    const res = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    res.code(201);
    return res;
  }

  async getLikesHandler(req) {
    const { albumId } = req.params;

    // await this._albumsService.getAlbumId(albumId);
    const number = await this._service.getLikes(albumId);

    return {
      status: 'success',
      data: {
        likes: number,
      },
    };
  }

  async deleteLikesHandler(req) {
    const { id: user } = req.auth.credentials;
    const { albumId } = req.params;

    await this._usersService.verifyUserId(user);
    await this._albumsService.getAlbumById(albumId);
    await this._service.deleteLikes(user, albumId);

    return {
      status: 'success',
      message: 'Berhasil membatalkan suka',
    };
  }
}

module.exports = LikesHandler;
