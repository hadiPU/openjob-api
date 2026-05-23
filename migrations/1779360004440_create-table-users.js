exports.up = (pgm) => {
  pgm.createTable('users', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    fullname: { type: 'TEXT', notNull: true },
    email: { type: 'VARCHAR(255)', notNull: true, unique: true },
    password: { type: 'TEXT', notNull: true },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
    updated_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};