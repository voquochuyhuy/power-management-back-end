const { baseColumns, softDeleteColumns } = require('../common');

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('board', {
    ...softDeleteColumns(pgm),
    ...baseColumns(pgm),

    id: 'id',
    name: {
      type: 'varchar(200)',
      notNull: false,
    },
    provisionCode: {
      type: 'varchar(200)',
      notNull: true,
      unique: true,
    },
    description: {
      type: 'varchar(200)',
      notNull: false,
    },
    status: {
      type: 'varchar(200)',
      notNull: false,
    },
    ipAddress: {
      type: 'varchar(200)',
      notNull: false,
    },
    topicsSubcribed: {
      type: 'varchar(200)',
      notNull: false,
    },
    maxPins: {
      type: 'smallint',
      notNull: true,
      default: pgm.func(1),
    },
    socketQuantity: {
      type: 'smallint',
      notNull: false,
    },
    requestInterval: {
      type: 'smallint',
      notNull: false,
    },
    ownedBy: {
      type: 'integer',
      notNull: true,
      references: '"user"',
      onDelete: "cascade"
    },
    lastSeenAt: {
      type: 'timestamp',
      notNull: false,
    },
  }, { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable('board', {
    ifExists: true,
    cascade: true
  });
};
