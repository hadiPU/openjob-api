exports.up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', references: '"users"' },
    job_id: { type: 'VARCHAR(50)', references: '"jobs"' },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('bookmarks');
};