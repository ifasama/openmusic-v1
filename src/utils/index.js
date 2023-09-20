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

const mapDBPlaylist = ({
  id,
  name,
  owner,
}) => ({
  id,
  name,
  owner,
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
  mapDBPlaylist,
  mapDBPlaylistSong,
};
