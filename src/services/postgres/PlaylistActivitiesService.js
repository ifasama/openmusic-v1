const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivities(playlistId, songId, userId, action) {
    const id = `plact-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: 'SELECT playlist_id FROM playlist_song_activities AS pa WHERE pa.playlist_id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw NotFoundError('Aktivitas tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;
