const { baseColumns } = require('../common');

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('pin', {
    ...baseColumns(pgm),

    id: 'id',
    name: {
      type: 'varchar(200)',
      notNull: false,
    },
    description: {
      type: 'varchar(200)',
      notNull: false,
    },
    pinNumber: {
      type: 'smallint',
      notNull: true,
    },
    isEnable: {
      type: 'boolean',
      notNull: false,
    },
    lastCurrentValue: {
      type: 'float',
      notNull: false,
    },
    belongTo: {
      type: 'integer',
      notNull: true,
      references: '"board"',
      onDelete: "cascade"
    },
    lastSeenAt: {
      type: 'timestamp',
      notNull: false,
    },
  }, { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable('pin', {
    ifExists: true,
    cascade: true
  });
};
