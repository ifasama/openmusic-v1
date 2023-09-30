require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const ClientError = require('./exceptions/ClientError');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// songs
const song = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// playlist_songs
const playlist_songs = require('./api/playlist_songs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongValidator = require('./validator/playlist_songs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationService = require('./services/postgres/CollaborationService');
const CollaborationValidator = require('./validator/collaborations');

// playlist_activities
const playlist_activities = require('./api/playlist_activities');
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService');

const init = async () => {
  const albumsService = new AlbumsService();
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationService = new CollaborationService();
  const playlistsService = new PlaylistsService(collaborationService);
  const playlistSongsService = new PlaylistSongsService(playlistsService);
  const playlistActivitiesService = new PlaylistActivitiesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategi autnetikasi jwt
  server.auth.strategy('playlist_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlist_songs,
      options: {
        playlistSongsService,
        songService,
        playlistsService,
        playlistActivitiesService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationService,
        playlistsService,
        usersService,
        validator: CollaborationValidator,
      },
    },
    {
      plugin: playlist_activities,
      options: {
        playlistActivitiesService,
        playlistsService,
      },
    },
  ]);

  server.ext('onPreResponse', (req, h) => {
    // mendapatkan konteks response dari request
    const { response } = req;

    if (response instanceof Error) {
      // penanganan client error secara internal
      if (response instanceof ClientError) {
        const newRes = h.response({
          status: 'fail',
          message: response.message,
        });
        newRes.code(response.statusCode);
        return newRes;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404 etc.
      if (!response.isServer) {
        return h.continue;
      }

      // SERVER ERROR sesuai kebutuhan
      const newRes = h.response({
        status: 'error',
        message: 'Maaf ada gangguan pada server kami',
      });
      newRes.code(500);
      return newRes;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya tanpa terintervensi.
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
