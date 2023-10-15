const fs = require('fs');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async addCoverUrl(albumId, coverUrl) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $2 WHERE id = $1 RETURNING id',
      values: [albumId, coverUrl],
    };

    const result = await this._pool.query(query);
    console.log(`coverResult: ${result.rows[0].id}`);

    if (!result.rows.length) {
      throw new InvariantError('Cover album gagal ditambahkan');
    }
  }
}

module.exports = StorageService;
