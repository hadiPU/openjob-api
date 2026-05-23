exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', references: '"users"' },
    filename: { type: 'TEXT', notNull: true },
    url: { type: 'TEXT', notNull: true },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};