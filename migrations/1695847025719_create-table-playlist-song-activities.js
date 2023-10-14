exports.up = (pgm) => {
  pgm.createType("activity", ['add', 'delete']);
  pgm.createTable("playlist_song_activities", {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'activity',
      notNull: true,
    },
    time: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('playlist_song_activities', 'fk_psa.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_song_activities");
  pgm.dropType("activity");
};
