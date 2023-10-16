const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class LikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikes(userId, albumId) {
    await this.verifyLikes(userId, albumId);
    const id = `like-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
    return result.rows[0].id;
  }

  async getLikes(albumId) {
    try {
      // const cache = 'cache';
      const result = await this._cacheService.get(`albumLikes:${albumId}`);
      const number = JSON.parse(result);
      return { number, cache: true };
    } catch (error) {
      const query = {
        text: 'SELECT count(*) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const number = Number(result.rows[0].count);
      // console.log(`totalLike:${JSON.stringify(result.rows[0])}`);
      await this._cacheService.set(`albumLikes:${albumId}`, JSON.stringify(number));
      return { number, cache: false };
    }
  }

  async deleteLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal membatalkan suka');
    }
    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async verifyLikes(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Sudah menyukai album');
    }
  }
}

module.exports = LikesService;
