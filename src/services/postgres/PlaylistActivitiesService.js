const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

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

    if (!result.rows[0].id) {
      throw new InvariantError('Aktivitas gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistActivities(playlistId) {
    const queryUser = {
      text: `SELECT users.username, songs.title,
      psa.action, psa.time FROM playlist_song_activities AS psa
      JOIN playlists ON playlists.id = psa.playlist_id
      JOIN users ON users.id = psa.user_id
      JOIN songs ON songs.id = psa.song_id
      WHERE psa.playlist_id = $1`,
      values: [playlistId],
    };
    const resultUser = await this._pool.query(queryUser);
    return resultUser.rows;
  }
}

module.exports = PlaylistActivitiesService;
