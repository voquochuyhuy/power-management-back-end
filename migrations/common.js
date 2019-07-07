const baseColumns = function (pgm) {
  return {
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updatedAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    id: {
      type: 'integer',
      primaryKey: true,
      notNull: true,
      unique: true,
      // default: pgm.func('uuid_generate_v4()'),
    },
  };
};

// const recordIdAttrs = function () {
//   return {
//     type: 'uuid',
//   };
// };

const softDeleteColumns = function () {
  return {
    deletedAt: {
      type: 'timestamp',
      notNull: false,
    },
  };
};

module.exports = {
  baseColumns,
  softDeleteColumns,
};
