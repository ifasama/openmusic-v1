const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapDBAlbum = ({
  id,
  name,
  owner,
  coverUrl,
}) => ({
  id,
  name,
  owner,
  coverUrl,
});

const mapDBPlaylistSong = ({
  id,
  playlist_id,
  song_id,
}) => ({
  id,
  playlistId: playlist_id,
  songId: song_id,
});

module.exports = {
  mapDBToModel,
  mapDBAlbum,
  mapDBPlaylistSong,
};
