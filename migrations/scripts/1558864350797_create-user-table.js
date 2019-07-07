const { baseColumns, softDeleteColumns } = require('../common');

exports.shorthands = undefined;

exports.up = (pgm) => {

  pgm.createTable('user', {
    ...softDeleteColumns(pgm),
    ...baseColumns(pgm),

    id: 'id',
    fullName: {
      type: 'varchar(200)',
      notNull: true,
    },
    password: {
      type: 'varchar(200)',
      notNull: true,
    },
    address: {
      type: 'varchar(200)',
      notNull: false,
    },
    phoneNumber: {
      type: 'varchar(200)',
      notNull: false,
    },
    emailAddress: {
      type: 'varchar(200)',
      notNull: true,
      unique: true,
    },
    organizationName: {
      type: 'varchar(200)',
      notNull: false,
    },
    role: {
      type: 'varchar(30)',
      notNull: true,
      default: pgm.func('user')
    },
    isLoggedIn: {
      type: 'boolean',
      notNull: false,
    },
    passwordResetToken: {
      type: 'varchar(200)',
      notNull: false,
    },
    passwordResetTokenExpiresAt: {
      type: 'text',
      notNull: false,
    },
    emailProofToken: {
      type: 'varchar(200)',
      notNull: false,
    },
    emailProofTokenExpiresAt: {
      type: 'timestamp',
      notNull: false,
    },
    lastSeenAt: {
      type: 'timestamp',
      notNull: false,
    },
  }, { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropTable('user', {
    ifExists: true,
    cascade: true
  });
};
