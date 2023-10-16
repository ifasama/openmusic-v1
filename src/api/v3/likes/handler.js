const autoBind = require('auto-bind');

class LikesHandler {
  constructor(service, usersService, albumsService) {
    this._service = service;
    this._usersService = usersService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postLikesHandler(req, h) {
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

  async getLikesHandler(req, h) {
    const { albumId } = req.params;

    const { number, cache } = await this._service.getLikes(albumId);

    const res = h.response({
      status: 'success',
      data: {
        likes: number,
      },
    });
    res.code(200);
    if (cache) return res.header('X-Data-Source', 'cache');
    return res;
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
