exports.up = (pgm) => {
  pgm.addColumns('albums', {
    coverUrl: {
      type: 'TEXT',
      allowNull: true,
      ifNotExist: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('albums', {
    coverUrl: {
      type: 'TEXT',
      allowNull: true,
      ifNotExist: true,
    },
  });
};
