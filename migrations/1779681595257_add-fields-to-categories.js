exports.up = (pgm) => {
  pgm.addColumn('categories', {
    description: { type: 'TEXT' },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('categories', 'description');
  pgm.dropColumn('categories', 'created_at');
};