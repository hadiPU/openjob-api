exports.up = (pgm) => {
  pgm.createTable('companies', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'TEXT', notNull: true },
    description: { type: 'TEXT' },
    location: { type: 'TEXT' },
    website: { type: 'TEXT' },
    owner_id: { type: 'VARCHAR(50)', references: '"users"' },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('companies');
};