const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
// const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(playlistsService) {
    this._pool = new Pool();
    this._playlistsService = playlistsService;
  }

  async addPlaylistSong(playlistId, songId, userId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const id = `plsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    // const resultString = JSON.stringify(result);
    // console.log(`addSongPlaylist: ${resultString}`);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke dalam playlist');
    }

    // return result.rows[0].id;
  }

  async getAllPlaylistSongs(playlistId, userId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const playlist = await this._playlistsService.getPlaylistById(userId);
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
      FROM songs LEFT JOIN
      playlist_songs AS ps ON songs.id = ps.song_id
      WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    // console.log(`getAllPlaylistSong: ${result}`);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menemukan lagu');
    }
    return { ...playlist, songs: result.rows };
  }

  async deletePlaylistSong(playlistId, songId, userId) {
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    // console.log(`deleteAllPlaylistSong: ${result}`);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }
}

module.exports = PlaylistSongsService;
