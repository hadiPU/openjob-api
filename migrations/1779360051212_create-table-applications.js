exports.up = (pgm) => {
  pgm.createTable('applications', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', references: '"users"' },
    job_id: { type: 'VARCHAR(50)', references: '"jobs"' },
    status: { type: 'TEXT', default: "'pending'" },
    cover_letter: { type: 'TEXT' },
    created_at: { type: 'TIMESTAMP', default: pgm.func('NOW()') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('applications');
};